"""SQLAlchemy ORM Data Models.

Defines database entities for Users, Multimodal Route Segments, Bookings,
and Disruption Audit Logs in the Universal Public Transport Booking System (MaaS).
"""

from datetime import datetime
import json
from typing import Any, Dict, List, Optional
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import declarative_base, relationship

from app.config import BookingStatus, SegmentStatus, TransportMode, UserRole

Base = declarative_base()


class User(Base):
    """System user entity representing Passengers, Transport Operators, or Admins."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    role = Column(String(20), nullable=False, default=UserRole.PASSENGER.value)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    bookings = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def to_dict(self) -> Dict[str, Any]:
        """Serializes user model to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<User id={self.id} name='{self.name}' role='{self.role}'>"


class RouteSegment(Base):
    """An individual journey leg (Bus route, Train service, or Taxi connection)."""

    __tablename__ = "route_segments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transport_type = Column(String(20), nullable=False, index=True)  # BUS, TRAIN, TAXI
    route_name = Column(String(120), nullable=False, index=True)      # e.g., "Metro Rail Line 1", "City Bus Route 42"
    operator_name = Column(String(100), nullable=False)              # e.g., "Metro Transit Authority", "SwiftCab Fleet"
    origin = Column(String(120), nullable=False, index=True)
    destination = Column(String(120), nullable=False, index=True)
    departure_time = Column(DateTime, nullable=False, index=True)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    status = Column(String(20), nullable=False, default=SegmentStatus.ON_TIME.value)  # ON_TIME, DELAYED, CANCELLED
    delay_minutes = Column(Integer, nullable=False, default=0)

    # Relationships
    disruption_logs = relationship(
        "DisruptionLog",
        back_populates="segment",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    @property
    def duration_minutes(self) -> int:
        """Returns journey segment duration in minutes."""
        if self.arrival_time and self.departure_time:
            delta = self.arrival_time - self.departure_time
            return max(0, int(delta.total_seconds() // 60))
        return 0

    @property
    def segment_code(self) -> str:
        """Convenience identifier for display (e.g. TRN-1, BUS-2, TXI-3)."""
        mode_prefix = {
            TransportMode.BUS.value: "BUS",
            TransportMode.TRAIN.value: "TRN",
            TransportMode.TAXI.value: "TXI",
        }.get(str(self.transport_type).upper(), "SEG")
        return f"{mode_prefix}-{self.id}"

    @property
    def platform_or_vehicle(self) -> str:
        """Convenience identifier for platform or vehicle display."""
        return self.route_name

    def to_dict(self) -> Dict[str, Any]:
        """Serializes route segment model to dictionary."""
        return {
            "id": self.id,
            "transport_type": self.transport_type,
            "route_name": self.route_name,
            "operator_name": self.operator_name,
            "origin": self.origin,
            "destination": self.destination,
            "departure_time": self.departure_time.isoformat() if self.departure_time else None,
            "arrival_time": self.arrival_time.isoformat() if self.arrival_time else None,
            "duration_minutes": self.duration_minutes,
            "price": self.price,
            "status": self.status,
            "delay_minutes": self.delay_minutes,
        }

    def __repr__(self) -> str:
        return (
            f"<RouteSegment id={self.id} type='{self.transport_type}' "
            f"name='{self.route_name}' {self.origin}->{self.destination} status='{self.status}'>"
        )


class Booking(Base):
    """Multimodal journey pass uniting multiple route segments under a single booking."""

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    total_price = Column(Float, nullable=False, default=0.0)
    status = Column(
        String(20),
        nullable=False,
        default=BookingStatus.CONFIRMED.value,
    )  # CONFIRMED, RESCHEDULED, CANCELLED
    qr_code_payload = Column(Text, nullable=False)
    segments_json = Column(Text, nullable=False)  # JSON-encoded array of segment IDs e.g. "[1, 2, 3]"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="bookings")

    @property
    def segment_ids(self) -> List[int]:
        """Parses and returns segment IDs list from JSON column."""
        try:
            return json.loads(self.segments_json)
        except Exception:
            return []

    @segment_ids.setter
    def segment_ids(self, ids: List[int]) -> None:
        """Serializes list of integer segment IDs into JSON column."""
        self.segments_json = json.dumps(ids)

    # Backward compatibility properties
    @property
    def qr_code_str(self) -> str:
        """Alias for qr_code_payload."""
        return self.qr_code_payload

    @qr_code_str.setter
    def qr_code_str(self, val: str) -> None:
        self.qr_code_payload = val

    @property
    def route_ids_json(self) -> str:
        """Alias for segments_json."""
        return self.segments_json

    @route_ids_json.setter
    def route_ids_json(self, val: str) -> None:
        self.segments_json = val

    @property
    def booking_reference(self) -> str:
        """Formatted booking reference identifier."""
        return f"MAAS-{self.created_at.year}-{self.id:04d}"

    def to_dict(self) -> Dict[str, Any]:
        """Serializes booking model to dictionary."""
        return {
            "id": self.id,
            "booking_reference": self.booking_reference,
            "user_id": self.user_id,
            "total_price": self.total_price,
            "status": self.status,
            "qr_code_payload": self.qr_code_payload,
            "segment_ids": self.segment_ids,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<Booking id={self.id} user_id={self.user_id} total=${self.total_price:.2f} status='{self.status}'>"


class DisruptionLog(Base):
    """Audit record capturing transit delay events and affected multimodal bookings."""

    __tablename__ = "disruption_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    segment_id = Column(
        Integer,
        ForeignKey("route_segments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    delay_minutes = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    affected_bookings_count = Column(Integer, nullable=False, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    segment = relationship("RouteSegment", back_populates="disruption_logs")

    @property
    def impacted_bookings_count(self) -> int:
        """Alias for affected_bookings_count for backwards compatibility."""
        return self.affected_bookings_count

    @impacted_bookings_count.setter
    def impacted_bookings_count(self, val: int) -> None:
        self.affected_bookings_count = val

    def to_dict(self) -> Dict[str, Any]:
        """Serializes disruption log model to dictionary."""
        return {
            "id": self.id,
            "segment_id": self.segment_id,
            "delay_minutes": self.delay_minutes,
            "reason": self.reason,
            "affected_bookings_count": self.affected_bookings_count,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }

    def __repr__(self) -> str:
        return (
            f"<DisruptionLog id={self.id} segment_id={self.segment_id} "
            f"delay=+{self.delay_minutes}m affected={self.affected_bookings_count}>"
        )
