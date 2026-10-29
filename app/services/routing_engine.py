"""Multimodal Routing Engine for Universal Public Transport (MaaS).

Matches and constructs seamless combined journeys across Bus, Train, and Taxi legs.
Calculates connection buffer times, total fares, and interchange stations.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models import RouteSegment, Booking, User
from app.config import DEFAULT_CONNECTION_BUFFER_MINUTES


def get_all_locations(db: Session) -> List[str]:
    """Returns sorted list of distinct origin and destination stops."""
    origins = [r[0] for r in db.query(RouteSegment.origin).distinct().all()]
    destinations = [r[0] for r in db.query(RouteSegment.destination).distinct().all()]
    all_locs = sorted(list(set(origins + destinations)))
    return all_locs


def find_multimodal_routes(
    db: Session,
    origin: str,
    destination: str,
    earliest_departure: Optional[datetime] = None,
    allow_taxi_feeder: bool = True,
    max_transfers: int = 2,
) -> List[Dict[str, Any]]:
    """Finds direct and connected multimodal journeys from origin to destination.

    Considers:
    - Direct trips (1 leg)
    - 2-leg trips (e.g. Train + Taxi, Bus + Train)
    - 3-leg trips (e.g. Bus + Train + Taxi)
    Ensures that for any transfer, connecting departure >= previous arrival + 5 minutes buffer.
    """
    segments = db.query(RouteSegment).filter(RouteSegment.status != "cancelled").all()
    if not segments:
        return []

    if not earliest_departure:
        earliest_departure = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    results: List[Dict[str, Any]] = []

    # 1. Direct segments
    for s in segments:
        if s.origin.lower() == origin.lower() and s.destination.lower() == destination.lower():
            if s.departure_time >= earliest_departure:
                results.append(_build_journey([s]))

    # 2. Two-leg connections
    for s1 in segments:
        if s1.origin.lower() == origin.lower() and s1.departure_time >= earliest_departure:
            for s2 in segments:
                if (
                    s2.origin.lower() == s1.destination.lower()
                    and s2.destination.lower() == destination.lower()
                    and s2.departure_time >= (s1.arrival_time + timedelta(minutes=5))
                ):
                    results.append(_build_journey([s1, s2]))

    # 3. Three-leg connections (e.g. Bus -> Train -> Taxi)
    for s1 in segments:
        if s1.origin.lower() == origin.lower() and s1.departure_time >= earliest_departure:
            for s2 in segments:
                if (
                    s2.origin.lower() == s1.destination.lower()
                    and s2.departure_time >= (s1.arrival_time + timedelta(minutes=5))
                ):
                    for s3 in segments:
                        if (
                            s3.origin.lower() == s2.destination.lower()
                            and s3.destination.lower() == destination.lower()
                            and s3.departure_time >= (s2.arrival_time + timedelta(minutes=5))
                        ):
                            results.append(_build_journey([s1, s2, s3]))

    # Filter taxi feeder if disabled
    if not allow_taxi_feeder:
        results = [j for j in results if "taxi" not in [seg["transport_type"] for seg in j["segments"]]]

    # Sort journeys by total duration then price
    results.sort(key=lambda j: (j["total_duration_minutes"], j["total_price"]))
    return results


def _build_journey(segments: List[RouteSegment]) -> Dict[str, Any]:
    """Helper to assemble a multimodal journey representation."""
    total_price = sum(s.price for s in segments)
    dep_time = segments[0].departure_time
    arr_time = segments[-1].arrival_time
    total_duration = int((arr_time - dep_time).total_seconds() // 60)

    modes = [s.transport_type.lower() for s in segments]
    mode_emojis = {
        "bus": "🚌 Bus",
        "train": "🚆 Train",
        "taxi": "🚕 Taxi",
    }
    mode_badges = [mode_emojis.get(m, m.title()) for m in modes]

    segment_data = []
    for idx, s in enumerate(segments):
        buffer_before = 0
        if idx > 0:
            prev_arr = segments[idx - 1].arrival_time
            buffer_before = max(0, int((s.departure_time - prev_arr).total_seconds() // 60))

        segment_data.append({
            "id": s.id,
            "segment_code": s.segment_code,
            "transport_type": s.transport_type,
            "operator_name": s.operator_name,
            "origin": s.origin,
            "destination": s.destination,
            "departure_time": s.departure_time,
            "departure_str": s.departure_time.strftime("%H:%M"),
            "arrival_time": s.arrival_time,
            "arrival_str": s.arrival_time.strftime("%H:%M"),
            "duration_minutes": s.duration_minutes,
            "price": s.price,
            "status": s.status,
            "delay_minutes": s.delay_minutes,
            "platform_or_vehicle": s.platform_or_vehicle or "N/A",
            "transfer_buffer_minutes": buffer_before,
        })

    return {
        "segment_ids": [s.id for s in segments],
        "origin": segments[0].origin,
        "destination": segments[-1].destination,
        "departure_str": dep_time.strftime("%H:%M"),
        "arrival_str": arr_time.strftime("%H:%M"),
        "departure_time": dep_time,
        "arrival_time": arr_time,
        "total_duration_minutes": total_duration,
        "total_price": round(total_price, 2),
        "transfers_count": len(segments) - 1,
        "modes": modes,
        "modes_summary": " ➔ ".join(mode_badges),
        "segments": segment_data,
    }


def create_passenger_booking(
    db: Session,
    user_id: int,
    segment_ids: List[int],
    payment_method: str = "mock_credit_card",
) -> Booking:
    """Creates a unified multimodal booking pass for a passenger."""
    import uuid
    import json

    segments = db.query(RouteSegment).filter(RouteSegment.id.in_(segment_ids)).all()
    # Preserve order of segment_ids
    seg_map = {s.id: s for s in segments}
    ordered_segments = [seg_map[sid] for sid in segment_ids if sid in seg_map]

    total_price = sum(s.price for s in ordered_segments)
    booking_ref = f"MAAS-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"

    qr_payload = (
        f"OMNIPASS:{booking_ref}:USER_{user_id}:"
        f"SEGMENTS_{'-'.join(str(s) for s in segment_ids)}"
    )

    booking = Booking(
        booking_reference=booking_ref,
        user_id=user_id,
        route_ids_json=json.dumps(segment_ids),
        total_price=round(total_price, 2),
        qr_code_str=qr_payload,
        status="confirmed",
        payment_status="paid",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
