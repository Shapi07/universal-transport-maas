"""Application Configuration and Core Domain Enums.

Defines foundational system settings, cancellation policies, transfer buffers,
and domain enumerations for the Universal Public Transport Booking System (MaaS).
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import os
from pathlib import Path
from typing import Optional


# ==============================================================================
# Domain Enumerations
# ==============================================================================

class TransportMode(str, Enum):
    """Supported multimodal transport modes."""
    BUS = "BUS"
    TRAIN = "TRAIN"
    TAXI = "TAXI"


class UserRole(str, Enum):
    """User access and privilege roles."""
    PASSENGER = "PASSENGER"
    OPERATOR = "OPERATOR"
    ADMIN = "ADMIN"


class BookingStatus(str, Enum):
    """Lifecycle statuses for a multimodal booking pass."""
    CONFIRMED = "CONFIRMED"
    RESCHEDULED = "RESCHEDULED"
    CANCELLED = "CANCELLED"


class SegmentStatus(str, Enum):
    """Operational status of an individual transit route segment."""
    ON_TIME = "ON_TIME"
    DELAYED = "DELAYED"
    CANCELLED = "CANCELLED"


# ==============================================================================
# Cancellation & Refund Rules
# ==============================================================================

@dataclass(frozen=True)
class CancellationPolicy:
    """Configures tiered penalty-free cancellation windows and refund rates.

    Rules:
    - Cancellations made >= 24 hours prior to departure: 100% full refund.
    - Cancellations made >= 2 hours prior to departure: 50% partial refund.
    - Cancellations made < 2 hours prior to departure: 0% refund (late cancellation penalty).
    """
    full_refund_window_hours: int = 24
    partial_refund_window_hours: int = 2
    full_refund_rate: float = 1.00
    partial_refund_rate: float = 0.50
    no_refund_rate: float = 0.00

    def calculate_refund_rate(
        self,
        departure_time: datetime,
        cancellation_time: Optional[datetime] = None,
    ) -> float:
        """Calculates the applicable refund percentage based on time remaining to departure."""
        now = cancellation_time or datetime.utcnow()
        if departure_time <= now:
            return self.no_refund_rate

        hours_remaining = (departure_time - now).total_seconds() / 3600.0

        if hours_remaining >= self.full_refund_window_hours:
            return self.full_refund_rate
        elif hours_remaining >= self.partial_refund_window_hours:
            return self.partial_refund_rate
        else:
            return self.no_refund_rate


# ==============================================================================
# System Settings
# ==============================================================================

@dataclass
class Settings:
    """Global system configuration for database, storage, and transfer policies."""

    # Project Directories
    base_dir: Path = field(default_factory=lambda: Path(__file__).resolve().parent.parent)
    data_dir: Path = field(init=False)

    # Database URI
    database_url: str = field(
        default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./data/maas_booking.db")
    )

    # Multimodal Routing & Transfer Rules
    default_connection_buffer_minutes: int = 10  # Minimum transfer buffer between connected legs

    # Tiered Cancellation Policy
    cancellation_policy: CancellationPolicy = field(default_factory=CancellationPolicy)

    # General System Constants
    app_name: str = "Universal Public Transport Booking System (MaaS)"
    currency_symbol: str = "$"

    def __post_init__(self) -> None:
        """Initializes and ensures runtime directories exist."""
        self.data_dir = self.base_dir / "data"
        self.data_dir.mkdir(parents=True, exist_ok=True)

        # Normalize relative sqlite URI to absolute path if needed
        if self.database_url.startswith("sqlite:///./"):
            rel_subpath = self.database_url.replace("sqlite:///./", "")
            resolved_db = self.base_dir / rel_subpath
            resolved_db.parent.mkdir(parents=True, exist_ok=True)
            self.database_url = f"sqlite:///{resolved_db.as_posix()}"


# Global Configuration Singleton Instance
settings = Settings()
