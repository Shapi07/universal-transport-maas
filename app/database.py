"""Database Connection, Session Management, and Data Seeding.

Sets up SQLite engine with thread-safety, transaction context managers,
table creation, and safe idempotent initial data seeding.
"""

from contextlib import contextmanager
from datetime import datetime, timedelta
import json
from typing import Generator, Optional
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import (
    BookingStatus,
    SegmentStatus,
    TransportMode,
    UserRole,
    settings,
)
from app.models import Base, Booking, DisruptionLog, RouteSegment, User

# ==============================================================================
# Engine and Session Configuration
# ==============================================================================

engine: Engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
    echo=False,
)

SessionLocal: sessionmaker = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ==============================================================================
# Session Context Managers & Generators
# ==============================================================================

@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """Context manager for atomic transaction handling.

    Yields an active database session, automatically committing on successful
    exit, rolling back on unhandled exceptions, and ensuring the session is closed.
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db() -> Generator[Session, None, None]:
    """FastAPI-compatible session generator for dependency injection."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================================================================
# Database Initialization & Idempotent Seeding
# ==============================================================================

def init_db(bind_engine: Optional[Engine] = None) -> None:
    """Creates all database tables defined in SQLAlchemy models cleanly."""
    target_engine = bind_engine or engine
    Base.metadata.create_all(bind=target_engine)


def seed_db(db: Optional[Session] = None, force: bool = False) -> None:
    """Safely seeds the database with realistic users, multimodal segments, and bookings.

    Idempotent: If records already exist and force=False, seeding is safely skipped.
    """
    if db is None:
        with get_db_context() as session:
            _execute_seed(session, force=force)
    else:
        _execute_seed(db, force=force)


def _execute_seed(session: Session, force: bool = False) -> None:
    """Internal implementation for database data seeding."""
    # Check if data already exists
    existing_users_count = session.query(User).count()
    if existing_users_count > 0 and not force:
        return

    # Clear existing data if forced re-seed
    if force:
        session.query(DisruptionLog).delete()
        session.query(Booking).delete()
        session.query(RouteSegment).delete()
        session.query(User).delete()
        session.flush()

    # 1. Populate Mock Users across all roles
    alice = User(
        name="Alice Smith",
        email="alice.smith@example.com",
        role=UserRole.PASSENGER.value,
    )
    bob = User(
        name="Bob Johnson",
        email="bob.johnson@example.com",
        role=UserRole.PASSENGER.value,
    )
    operator = User(
        name="Metro Express Dispatcher",
        email="dispatcher@metrotransit.org",
        role=UserRole.OPERATOR.value,
    )
    admin = User(
        name="Transit Support Admin",
        email="admin@maas.gov",
        role=UserRole.ADMIN.value,
    )

    session.add_all([alice, bob, operator, admin])
    session.flush()  # Generate user IDs

    # 2. Populate Realistic Multimodal Route Segments
    base_time = datetime.utcnow().replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=1)

    # Feeder Bus
    bus_segment = RouteSegment(
        transport_type=TransportMode.BUS.value,
        route_name="Feeder Bus Route 42",
        operator_name="MetroBus Co",
        origin="Suburbia Heights",
        destination="Metro Central Station",
        departure_time=base_time,
        arrival_time=base_time + timedelta(minutes=30),
        price=3.50,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    # Mainline Train
    train_segment = RouteSegment(
        transport_type=TransportMode.TRAIN.value,
        route_name="Rapid Express Rail 101",
        operator_name="MetroRail Express",
        origin="Metro Central Station",
        destination="Grand Financial Terminal",
        departure_time=base_time + timedelta(minutes=40),  # 10m buffer after bus
        arrival_time=base_time + timedelta(minutes=75),
        price=12.00,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    # Connecting Taxi (Last-Mile Feeder)
    taxi_segment = RouteSegment(
        transport_type=TransportMode.TAXI.value,
        route_name="SwiftCab On-Demand 88",
        operator_name="SwiftCab Mobility",
        origin="Grand Financial Terminal",
        destination="Innovation Tech Park",
        departure_time=base_time + timedelta(minutes=85),  # 10m buffer after train
        arrival_time=base_time + timedelta(minutes=110),
        price=18.50,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    # Alternative Route: Northside Shuttle & Coastal Rail
    bus_alt = RouteSegment(
        transport_type=TransportMode.BUS.value,
        route_name="Northside Shuttle 15",
        operator_name="Northside Shuttle Co",
        origin="Northwood Commons",
        destination="Metro Central Station",
        departure_time=base_time + timedelta(minutes=10),
        arrival_time=base_time + timedelta(minutes=35),
        price=2.75,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    train_alt = RouteSegment(
        transport_type=TransportMode.TRAIN.value,
        route_name="Coastal InterCity Rail 204",
        operator_name="Coastal InterCity",
        origin="Metro Central Station",
        destination="Airport Intermodal Hub",
        departure_time=base_time + timedelta(minutes=45),
        arrival_time=base_time + timedelta(minutes=85),
        price=15.00,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    taxi_alt = RouteSegment(
        transport_type=TransportMode.TAXI.value,
        route_name="Airport EcoCab 14",
        operator_name="SwiftCab Mobility",
        origin="Airport Intermodal Hub",
        destination="Seaside Convention Center",
        departure_time=base_time + timedelta(minutes=95),
        arrival_time=base_time + timedelta(minutes=115),
        price=16.00,
        status=SegmentStatus.ON_TIME.value,
        delay_minutes=0,
    )

    session.add_all([bus_segment, train_segment, taxi_segment, bus_alt, train_alt, taxi_alt])
    session.flush()  # Generate segment IDs

    # 3. Populate Sample Multimodal Bookings
    # Alice's 3-Leg Journey: Bus 42 -> Train 101 -> Taxi 88
    alice_segment_ids = [bus_segment.id, train_segment.id, taxi_segment.id]
    alice_total = bus_segment.price + train_segment.price + taxi_segment.price

    alice_booking = Booking(
        user_id=alice.id,
        total_price=alice_total,
        status=BookingStatus.CONFIRMED.value,
        qr_code_payload=f"OMNIPASS:USER_{alice.id}:SEGMENTS_{'-'.join(str(i) for i in alice_segment_ids)}:SECURE_TOKEN",
        segments_json=json.dumps(alice_segment_ids),
    )

    # Bob's 2-Leg Journey: Train 101 -> Taxi 88
    bob_segment_ids = [train_segment.id, taxi_segment.id]
    bob_total = train_segment.price + taxi_segment.price

    bob_booking = Booking(
        user_id=bob.id,
        total_price=bob_total,
        status=BookingStatus.CONFIRMED.value,
        qr_code_payload=f"OMNIPASS:USER_{bob.id}:SEGMENTS_{'-'.join(str(i) for i in bob_segment_ids)}:SECURE_TOKEN",
        segments_json=json.dumps(bob_segment_ids),
    )

    session.add_all([alice_booking, bob_booking])
    session.commit()


def reset_db() -> None:
    """Drops all tables and re-creates a clean, fresh seed state."""
    Base.metadata.drop_all(bind=engine)
    init_db()
    seed_db(force=True)
