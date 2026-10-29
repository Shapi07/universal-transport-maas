"""Unit tests for Dynamic Disruption Recovery and Multimodal Routing Engine."""

import pytest
import json
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base, User, RouteSegment, Booking, DisruptionLog
from app.services.disruption_engine import handle_segment_delay
from app.services.routing_engine import find_multimodal_routes, create_passenger_booking


@pytest.fixture
def test_db():
    """In-memory SQLite database session fixture."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()

    # Seed test users
    alice = User(name="Alice Test", email="alice@test.com", role="passenger", phone="+1-555-0101")
    session.add(alice)
    session.flush()

    # Seed 3-leg journey: Bus -> Train -> Taxi
    base_time = datetime(2026, 10, 22, 8, 0, 0)

    bus = RouteSegment(
        segment_code="BUS-TEST-1",
        transport_type="bus",
        operator_name="MetroBus Test",
        origin="Station A",
        destination="Station B",
        departure_time=base_time,
        arrival_time=base_time + timedelta(minutes=30),  # 08:00 -> 08:30
        price=3.0,
        status="scheduled",
    )
    train = RouteSegment(
        segment_code="TRN-TEST-1",
        transport_type="train",
        operator_name="MetroRail Test",
        origin="Station B",
        destination="Station C",
        departure_time=base_time + timedelta(minutes=40),  # 08:40 -> 09:15
        arrival_time=base_time + timedelta(minutes=75),
        price=12.0,
        status="scheduled",
    )
    taxi = RouteSegment(
        segment_code="TXI-TEST-1",
        transport_type="taxi",
        operator_name="SwiftCab Test",
        origin="Station C",
        destination="Station D",
        departure_time=base_time + timedelta(minutes=85),  # 09:25 -> 09:50
        arrival_time=base_time + timedelta(minutes=110),
        price=15.0,
        status="scheduled",
        platform_or_vehicle="Cab #88",
    )
    session.add_all([bus, train, taxi])
    session.flush()

    # Create active booking for Alice
    seg_ids = [bus.id, train.id, taxi.id]
    booking = Booking(
        booking_reference="TEST-MAAS-001",
        user_id=alice.id,
        route_ids_json=json.dumps(seg_ids),
        total_price=30.0,
        status="confirmed",
        payment_status="paid",
    )
    session.add(booking)
    session.commit()

    yield session

    session.close()


def test_handle_segment_delay_recovers_taxi_connection(test_db):
    """Test that train delay automatically shifts connecting taxi pickup without fees."""
    train = test_db.query(RouteSegment).filter(RouteSegment.segment_code == "TRN-TEST-1").first()
    taxi = test_db.query(RouteSegment).filter(RouteSegment.segment_code == "TXI-TEST-1").first()
    booking = test_db.query(Booking).filter(Booking.booking_reference == "TEST-MAAS-001").first()

    old_train_arr = train.arrival_time
    old_taxi_pickup = taxi.departure_time
    old_taxi_arr = taxi.arrival_time

    delay_minutes = 25
    result = handle_segment_delay(
        db=test_db,
        segment_id=train.id,
        delay_minutes=delay_minutes,
        reason="Signal Failure on Line B",
    )

    assert result["success"] is True
    assert result["delay_minutes"] == delay_minutes
    assert result["impacted_bookings_count"] == 1
    assert result["rescheduled_taxis_count"] == 1

    # Verify delayed train times
    test_db.refresh(train)
    assert train.status == "delayed"
    assert train.delay_minutes == delay_minutes
    assert train.arrival_time == old_train_arr + timedelta(minutes=delay_minutes)

    # Verify taxi rescheduled pickup time
    test_db.refresh(taxi)
    assert taxi.status == "rescheduled"
    assert taxi.departure_time == old_taxi_pickup + timedelta(minutes=delay_minutes)
    assert taxi.arrival_time == old_taxi_arr + timedelta(minutes=delay_minutes)

    # Verify booking status
    test_db.refresh(booking)
    assert booking.status == "rescheduled"
    assert "Connecting taxi" in booking.rescheduled_reason
    assert "rescheduled at no cost" in booking.rescheduled_reason

    # Verify DisruptionLog audit
    log = test_db.query(DisruptionLog).filter(DisruptionLog.segment_id == train.id).first()
    assert log is not None
    assert log.delay_minutes == delay_minutes
    assert log.impacted_bookings_count == 1


def test_handle_segment_delay_invalid_inputs(test_db):
    """Test edge cases: zero delay and non-existent segment."""
    res_zero = handle_segment_delay(test_db, segment_id=1, delay_minutes=0)
    assert res_zero["success"] is False

    res_neg = handle_segment_delay(test_db, segment_id=1, delay_minutes=-10)
    assert res_neg["success"] is False

    res_nonexistent = handle_segment_delay(test_db, segment_id=9999, delay_minutes=20)
    assert res_nonexistent["success"] is False


def test_multimodal_routing_engine(test_db):
    """Test that routing engine finds multimodal combined routes."""
    journeys = find_multimodal_routes(
        db=test_db,
        origin="Station A",
        destination="Station D",
        earliest_departure=datetime(2026, 10, 22, 7, 0, 0),
    )

    assert len(journeys) >= 1
    best_journey = journeys[0]
    assert best_journey["origin"] == "Station A"
    assert best_journey["destination"] == "Station D"
    assert len(best_journey["segments"]) == 3
    assert best_journey["total_price"] == 30.0
    assert best_journey["transfers_count"] == 2
