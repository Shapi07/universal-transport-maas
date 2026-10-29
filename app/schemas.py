"""Pydantic schemas and Data Transfer Objects for the MaaS Platform."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "passenger"
    phone: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Route Segment Schemas ---
class RouteSegmentBase(BaseModel):
    segment_code: str
    transport_type: str  # bus, train, taxi
    operator_name: str
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    capacity: int = 50
    status: str = "scheduled"
    delay_minutes: int = 0
    platform_or_vehicle: Optional[str] = None


class RouteSegmentCreate(RouteSegmentBase):
    pass


class RouteSegmentResponse(RouteSegmentBase):
    id: int
    duration_minutes: int

    class Config:
        from_attributes = True


# --- Booking Schemas ---
class BookingCreateRequest(BaseModel):
    user_id: int
    segment_ids: List[int]
    payment_method: str = "mock_credit_card"


class BookingResponse(BaseModel):
    id: int
    booking_reference: str
    user_id: int
    route_ids_json: str
    total_price: float
    qr_code_str: Optional[str]
    status: str
    payment_status: str
    rescheduled_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookingDetailResponse(BookingResponse):
    passenger_name: str
    passenger_email: str
    segments: List[RouteSegmentResponse]


# --- Disruption Engine Schemas ---
class DelaySimulationRequest(BaseModel):
    segment_id: int = Field(..., description="ID of the bus or train segment delayed")
    delay_minutes: int = Field(..., ge=1, le=180, description="Delay in minutes (1 to 180)")
    reason: str = Field(default="Technical Delay", description="Disruption explanation")


class DisruptionImpactItem(BaseModel):
    booking_id: int
    booking_reference: str
    passenger_name: str
    passenger_phone: Optional[str]
    old_taxi_pickup: Optional[str]
    new_taxi_pickup: Optional[str]
    delay_added_minutes: int
    taxi_code: Optional[str]
    status: str


class DisruptionRecoveryResult(BaseModel):
    success: bool
    segment_id: int
    segment_code: str
    delay_minutes: int
    reason: str
    impacted_bookings_count: int
    rescheduled_taxis_count: int
    impacted_details: List[DisruptionImpactItem]
    message: str


# --- Disruption Log Schemas ---
class DisruptionLogResponse(BaseModel):
    id: int
    segment_id: int
    delay_minutes: int
    reason: str
    impacted_bookings_count: int
    timestamp: datetime
    resolved: bool

    class Config:
        from_attributes = True
