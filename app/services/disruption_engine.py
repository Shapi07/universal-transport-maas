"""Dynamic Disruption Recovery Engine.

Core business logic for MaaS platform:
When a train or bus segment is delayed, this engine automatically identifies
all affected bookings and reschedules downstream connecting taxi pickups
without passenger penalty fees.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models import RouteSegment, Booking, DisruptionLog, User


def handle_segment_delay(
    db: Session,
    segment_id: int,
    delay_minutes: int,
    reason: str = "Technical disruption reported",
) -> Dict[str, Any]:
    """Handles a reported delay on a route segment.

    1. Updates segment departure/arrival times and sets status to 'delayed'.
    2. Queries all active bookings containing this segment.
    3. Finds downstream connecting taxi segments and reschedules their pickup time:
       new_taxi_time = old_taxi_time + delay_minutes.
    4. Marks booking status as 'rescheduled' with zero penalty fees.
    5. Creates an audit DisruptionLog entry.

    Returns a comprehensive result summary for the Live Disruption Simulator.
    """
    if delay_minutes <= 0:
        return {
            "success": False,
            "message": "Delay minutes must be greater than zero.",
            "impacted_bookings_count": 0,
            "rescheduled_taxis_count": 0,
            "impacted_details": [],
        }

    # 1. Fetch delayed segment
    delayed_segment = db.query(RouteSegment).filter(RouteSegment.id == segment_id).first()
    if not delayed_segment:
        return {
            "success": False,
            "message": f"Route segment with ID {segment_id} not found.",
            "impacted_bookings_count": 0,
            "rescheduled_taxis_count": 0,
            "impacted_details": [],
        }

    # Update delayed segment times
    old_dep = delayed_segment.departure_time
    old_arr = delayed_segment.arrival_time
    delayed_segment.delay_minutes += delay_minutes
    delayed_segment.departure_time = old_dep + timedelta(minutes=delay_minutes)
    delayed_segment.arrival_time = old_arr + timedelta(minutes=delay_minutes)
    delayed_segment.status = "delayed"

    # 2. Find all active bookings containing this segment
    all_bookings = (
        db.query(Booking)
        .filter(Booking.status.in_(["confirmed", "rescheduled"]))
        .all()
    )

    impacted_bookings: List[Booking] = []
    impacted_details: List[Dict[str, Any]] = []
    rescheduled_taxis_count = 0
    taxis_shifted_set = set()

    for booking in all_bookings:
        segment_ids = booking.segment_ids
        if segment_id not in segment_ids:
            continue

        impacted_bookings.append(booking)
        delayed_idx = segment_ids.index(segment_id)

        # Inspect all downstream segments (segments after the delayed one)
        downstream_ids = segment_ids[delayed_idx + 1 :]
        booking_taxis_rescheduled = []

        for ds_id in downstream_ids:
            ds_segment = db.query(RouteSegment).filter(RouteSegment.id == ds_id).first()
            if not ds_segment:
                continue

            # Check if this connecting leg is a taxi
            if ds_segment.transport_type.lower() == "taxi":
                old_taxi_pickup = ds_segment.departure_time
                old_taxi_arrival = ds_segment.arrival_time

                # Shift taxi pickup time only once per segment ID
                if ds_segment.id not in taxis_shifted_set:
                    ds_segment.departure_time = old_taxi_pickup + timedelta(minutes=delay_minutes)
                    ds_segment.arrival_time = old_taxi_arrival + timedelta(minutes=delay_minutes)
                    ds_segment.delay_minutes += delay_minutes
                    ds_segment.status = "rescheduled"
                    taxis_shifted_set.add(ds_segment.id)
                    rescheduled_taxis_count += 1

                new_taxi_pickup = ds_segment.departure_time
                booking_taxis_rescheduled.append({
                    "taxi_code": ds_segment.segment_code,
                    "old_pickup": old_taxi_pickup.strftime("%H:%M"),
                    "new_pickup": new_taxi_pickup.strftime("%H:%M"),
                    "vehicle": ds_segment.platform_or_vehicle,
                    "origin": ds_segment.origin,
                })

        # Update booking status and reason
        booking.status = "rescheduled"
        user = db.query(User).filter(User.id == booking.user_id).first()
        passenger_name = user.name if user else "Passenger"
        passenger_phone = user.phone if user else "N/A"

        rescheduled_desc = (
            f"Dynamic Recovery: {delayed_segment.segment_code} delayed +{delay_minutes}m. "
        )
        if booking_taxis_rescheduled:
            taxi_names = ", ".join(t["taxi_code"] for t in booking_taxis_rescheduled)
            rescheduled_desc += f"Connecting taxi ({taxi_names}) pickup rescheduled at no cost."
        else:
            rescheduled_desc += "Itinerary updated. Connecting buffer adjusted."

        booking.rescheduled_reason = rescheduled_desc

        impacted_details.append({
            "booking_id": booking.id,
            "booking_reference": booking.booking_reference,
            "passenger_name": passenger_name,
            "passenger_phone": passenger_phone,
            "delayed_segment_code": delayed_segment.segment_code,
            "delay_added_minutes": delay_minutes,
            "taxis_rescheduled": booking_taxis_rescheduled,
            "booking_status": booking.status,
            "notification_message": (
                f"Notice for {passenger_name}: Your {delayed_segment.transport_type} "
                f"({delayed_segment.segment_code}) is running {delay_minutes} mins late. "
                f"Your connecting taxi pickup has been automatically adjusted with $0 penalty fee."
            ),
        })

    # 3. Create DisruptionLog
    disruption_log = DisruptionLog(
        segment_id=segment_id,
        delay_minutes=delay_minutes,
        reason=reason,
        impacted_bookings_count=len(impacted_bookings),
        timestamp=datetime.utcnow(),
        resolved=False,
    )
    db.add(disruption_log)
    db.commit()

    return {
        "success": True,
        "segment_id": segment_id,
        "segment_code": delayed_segment.segment_code,
        "delay_minutes": delay_minutes,
        "reason": reason,
        "impacted_bookings_count": len(impacted_bookings),
        "rescheduled_taxis_count": rescheduled_taxis_count,
        "impacted_details": impacted_details,
        "log_id": disruption_log.id,
        "message": (
            f"Successfully logged +{delay_minutes}m delay on {delayed_segment.segment_code}. "
            f"Auto-rescheduled {rescheduled_taxis_count} connecting taxi(s) across "
            f"{len(impacted_bookings)} active booking(s)."
        ),
    }


def get_active_disruptions(db: Session) -> List[Dict[str, Any]]:
    """Retrieves all logged disruptions with segment details."""
    logs = (
        db.query(DisruptionLog)
        .order_by(DisruptionLog.timestamp.desc())
        .limit(50)
        .all()
    )
    result = []
    for log in logs:
        seg = db.query(RouteSegment).filter(RouteSegment.id == log.segment_id).first()
        result.append({
            "id": log.id,
            "segment_id": log.segment_id,
            "segment_code": seg.segment_code if seg else "N/A",
            "transport_type": seg.transport_type if seg else "N/A",
            "delay_minutes": log.delay_minutes,
            "reason": log.reason,
            "impacted_bookings": log.impacted_bookings_count,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M UTC"),
            "resolved": log.resolved,
        })
    return result
