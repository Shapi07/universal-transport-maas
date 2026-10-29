# Universal Public Transport Booking System (MaaS Platform) - Full Source Bundle

This single consolidated file contains the complete code for all project files.

---

## File: docker-compose.yml

``yaml
version: '3.8'

services:
  maas-platform:
    build: .
    container_name: universal-transport-maas
    ports:
      - "8501:8501"
    environment:
      - DATABASE_URL=sqlite:///./data/transport_maas.db
      - PYTHONUNBUFFERED=1
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8501/_stcore/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

``

---

## File: Dockerfile

``dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

ENTRYPOINT ["streamlit", "run", "app/main.py", "--server.port=8501", "--server.address=0.0.0.0"]

``

---

## File: PROJECT_ALL_IN_ONE.md

``markdown
# Universal Public Transport Booking System (MaaS Platform) - Full Source Bundle

This single consolidated file contains the complete code for all project files.

---

## File: docker-compose.yml

``yaml
version: '3.8'

services:
  maas-platform:
    build: .
    container_name: universal-transport-maas
    ports:
      - "8501:8501"
    environment:
      - DATABASE_URL=sqlite:///./data/transport_maas.db
      - PYTHONUNBUFFERED=1
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8501/_stcore/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

``

---

## File: Dockerfile

``dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

ENTRYPOINT ["streamlit", "run", "app/main.py", "--server.port=8501", "--server.address=0.0.0.0"]

``

---

## File: README.md

``markdown
# 🚆 OmniPass MaaS — Universal Public Transport Booking System

> A unified Mobility-as-a-Service (MaaS) multimodal platform integrating Buses, Trains, and Taxis into seamless end-to-end journeys with **Dynamic Disruption Recovery**.

---

## 🌟 Overview & Key Distinctive Feature

Traditional transport apps force passengers to book train, bus, and taxi legs separately. When a train is delayed, connecting taxi drivers depart or charge cancellation fees, leaving passengers stranded with no recourse.

**OmniPass MaaS** solves this with **Dynamic Disruption Recovery**:
- When a train or bus delay is reported by a transit operator or simulated by an administrator, the platform's central disruption engine **automatically recalculates downstream connections** and **reschedules the connecting taxi pickup time** without any penalty fees for the passenger.
- The passenger receives an instant in-app alert with their updated schedule and vehicle details, preserving the validity of their digital **Single Journey Pass QR code**.

---

## 👥 Three Primary Roles

1. **Passenger**
   - Search multimodal routes across Buses, Trains, and Taxis.
   - Interactive timeline cards showing transfers, buffer times, and operator information.
   - Single unified checkout via simulated Mock Payment Gateway.
   - Digital Single Journey Pass with high-resolution QR ticket.
   - Real-time delay and automatic rescheduling notification banner.

2. **Transport Operator**
   - Fleet and route timetable monitoring across all transport modes.
   - Incident & delay reporter with root-cause tracking (Signal Failure, Track Maintenance, Weather, Traffic).
   - Capacity and fare management tools.

3. **Admin / Support**
   - **Live Disruption Simulator**: Interactive slider to inject route delays and view a side-by-side comparison of Legacy vs. Dynamic MaaS Recovery.
   - Disruption audit trail and historical impact analysis.
   - Cross-operator passenger booking registry and customer care portal.
   - One-click prototype database reset to fresh seed state.

---

## 📂 Repository Structure

```text
├── app/
│   ├── __init__.py
│   ├── main.py                   # Entry point (auto-launches Streamlit or direct python)
│   ├── config.py                 # App configurations and constants
│   ├── database.py               # SQLite connection, session handling, seed & reset logic
│   ├── models.py                 # SQLAlchemy DB Models (User, RouteSegment, Booking, DisruptionLog)
│   ├── schemas.py                # Pydantic schemas / DTOs
│   ├── services/
│   │   ├── __init__.py
│   │   ├── routing_engine.py    # Multimodal route matching and booking generation
│   │   ├── disruption_engine.py # Dynamic Disruption Recovery (auto-reschedule taxi logic)
│   │   └── qr_generator.py      # QR code generation for digital Single Journey Pass
│   └── views/
│       ├── __init__.py
│       ├── passenger_ui.py      # Passenger interface components
│       ├── operator_ui.py       # Transport operator dashboard
│       └── admin_ui.py          # Admin portal & Live Disruption Simulator
├── data/
│   └── seed_data.json           # Initial multimodal routes, schedules, and mock drivers
├── tests/
│   └── test_disruption.py       # Pytest unit tests for disruption recovery & routing
├── Dockerfile                   # Production Docker image configuration
├── docker-compose.yml           # Container orchestration
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation & walkthrough
```

---

## 🚀 Quickstart Guide

### Option 1: Local Python Execution

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   You can run directly with Python:
   ```bash
   python app/main.py
   ```
   Or via the Streamlit CLI:
   ```bash
   streamlit run app/main.py
   ```

3. **Open the browser:**
   Navigate to `http://localhost:8501`.

---

### Option 2: Docker & Docker Compose

Run the entire platform inside a container with zero local setup:

```bash
docker-compose up --build
```

Access the UI at `http://localhost:8501`.

---

### 🧪 Running Unit Tests

Execute the unit tests verifying Dynamic Disruption Recovery and route matching:

```bash
pytest tests/test_disruption.py -v
```

---

## 🎬 3-Step Demo Walkthrough

1. **Step 1: Check Passenger Alice's Journey**
   - In the sidebar, select **Passenger** ➔ **Alice Smith**.
   - Navigate to the **"My Passes & Live Journey Protection"** tab.
   - Notice Alice's confirmed 3-leg trip:
     - `BUS-42`: Departs 08:00 ➔ Arrives 08:30 at *Metro Central Station*
     - `TRN-101`: Departs 08:40 ➔ Arrives 09:15 at *Grand Financial Terminal*
     - `TXI-88`: Departs 09:25 ➔ Arrives 09:50 at *Innovation Tech Park*

2. **Step 2: Simulate Delay in Admin Portal**
   - In the sidebar, switch the active role to **Admin / Support**.
   - Under the **"Live Disruption Simulator"** tab, select **TRN-101 (TRAIN)**.
   - Adjust the delay slider to **+25 minutes** (e.g. Signal Failure).
   - Click **"Trigger Live Disruption Simulation"**.

3. **Step 3: Verify Dynamic Disruption Recovery**
   - The simulator displays the **Side-by-Side Impact Comparison**:
     - *Legacy System*: Stranded passenger, missed taxi, $15 penalty fee.
     - *OmniPass MaaS*: Taxi `TXI-88` automatically shifted to **09:50** pickup with **$0 penalty fee**.
   - Switch back to **Passenger (Alice Smith)** ➔ **My Passes**.
   - Observe the prominent alert banner:
     > *"⚡ Dynamic Disruption Recovery Active: Connecting taxi (TXI-88) pickup rescheduled at no cost."*

---

## ⚙️ Technologies Used

- **Backend & Core Engines**: Python 3.11, SQLAlchemy 2.0 ORM, Pydantic 2.0
- **Database**: SQLite (ACID-compliant with thread-safe connection pooling)
- **Frontend / Prototyping**: Streamlit with custom CSS and responsive layout
- **Ticketing**: `qrcode` + Pillow (base64 digital pass generation)
- **Testing**: `pytest` with in-memory SQLite fixtures
- **DevOps**: Docker & Docker Compose

``

---

## File: requirements.txt

``text
streamlit>=1.32.0
sqlalchemy>=2.0.28
pydantic>=2.6.4
qrcode[pil]>=7.4.2
pillow>=10.2.0
pytest>=8.1.1
requests>=2.31.0
pandas>=2.2.1

``

---

## File: app/config.py

``python
"""Configuration settings for Universal Public Transport Booking System (MaaS)."""

import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Database Configuration
DEFAULT_DB_PATH = DATA_DIR / "transport_maas.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.as_posix()}")

# Seed Data Configuration
SEED_DATA_PATH = DATA_DIR / "seed_data.json"

# Application Settings
APP_TITLE = "OmniPass MaaS - Multimodal Transport Platform"
APP_SUBTITLE = "Seamless Bus, Train & Taxi Booking with Dynamic Disruption Recovery"
CURRENCY_SYMBOL = "$"

# Disruption Recovery Settings
DEFAULT_CONNECTION_BUFFER_MINUTES = 10
AUTO_RECOVERY_TAXIS_ENABLED = True

``

---

## File: app/database.py

``python
"""Database setup and session management using SQLAlchemy."""

import json
from contextlib import contextmanager
from datetime import datetime, timedelta
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import DATABASE_URL, SEED_DATA_PATH
from app.models import Base, User, RouteSegment, Booking, DisruptionLog

# Engine configuration (connect_args ensures SQLite thread safety)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """Context manager for handling database sessions safely."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db() -> Generator[Session, None, None]:
    """Dependency generator for FastAPI or view components."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_database(db: Session, force: bool = False) -> None:
    """Populates the database with initial users, multimodal routes, and sample bookings."""
    user_count = db.query(User).count()
    if user_count > 0 and not force:
        return

    # If force, clear existing data
    if force:
        db.query(DisruptionLog).delete()
        db.query(Booking).delete()
        db.query(RouteSegment).delete()
        db.query(User).delete()
        db.commit()

    if not SEED_DATA_PATH.exists():
        # Fallback to programmatic default seed if file not found
        _create_default_seed(db)
        return

    with open(SEED_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Seed Users
    users_by_email = {}
    for u in data.get("users", []):
        user = User(
            name=u["name"],
            email=u["email"],
            role=u["role"],
            phone=u.get("phone", "+1-555-0100"),
        )
        db.add(user)
        db.flush()
        users_by_email[u["email"]] = user

    # 2. Seed Route Segments
    base_today = datetime.utcnow().replace(hour=8, minute=0, second=0, microsecond=0)
    segments_by_code = {}
    for s in data.get("route_segments", []):
        dep_offset = s.get("dep_offset_minutes", 0)
        dur = s.get("duration_minutes", 30)

        dep_time = base_today + timedelta(minutes=dep_offset)
        arr_time = dep_time + timedelta(minutes=dur)

        segment = RouteSegment(
            segment_code=s["segment_code"],
            transport_type=s["transport_type"],
            operator_name=s.get("operator_name", "Metro Transit"),
            origin=s["origin"],
            destination=s["destination"],
            departure_time=dep_time,
            arrival_time=arr_time,
            price=float(s["price"]),
            capacity=s.get("capacity", 50),
            status=s.get("status", "scheduled"),
            delay_minutes=0,
            platform_or_vehicle=s.get("platform_or_vehicle", ""),
        )
        db.add(segment)
        db.flush()
        segments_by_code[s["segment_code"]] = segment

    # 3. Seed Sample Multimodal Bookings
    for b in data.get("sample_bookings", []):
        user = users_by_email.get(b["user_email"])
        if not user:
            continue

        segment_ids = [segments_by_code[code].id for code in b["segment_codes"] if code in segments_by_code]
        total_price = sum(segments_by_code[code].price for code in b["segment_codes"] if code in segments_by_code)

        # Generate QR code payload representation
        qr_payload = f"OMNIPASS:{b['booking_reference']}:USER_{user.id}:SEGMENTS_{'-'.join(str(i) for i in segment_ids)}"

        booking = Booking(
            booking_reference=b["booking_reference"],
            user_id=user.id,
            route_ids_json=json.dumps(segment_ids),
            total_price=round(total_price, 2),
            qr_code_str=qr_payload,
            status=b.get("status", "confirmed"),
            payment_status=b.get("payment_status", "paid"),
        )
        db.add(booking)

    db.commit()


def _create_default_seed(db: Session) -> None:
    """Fallback programmatic seeder if JSON is not present."""
    base_time = datetime.utcnow().replace(hour=8, minute=0, second=0, microsecond=0)

    alice = User(name="Alice Smith", email="alice@example.com", role="passenger", phone="+1-555-0101")
    bob = User(name="Bob Jones", email="bob@example.com", role="passenger", phone="+1-555-0102")
    operator = User(name="City Express Rail Operator", email="operator@metro.org", role="operator", phone="+1-555-0200")
    admin = User(name="Admin Support", email="admin@maas.gov", role="admin", phone="+1-555-0300")
    db.add_all([alice, bob, operator, admin])
    db.flush()

    bus1 = RouteSegment(
        segment_code="BUS-42",
        transport_type="bus",
        operator_name="MetroBus Co",
        origin="Suburbia Green",
        destination="Metro Central Station",
        departure_time=base_time,
        arrival_time=base_time + timedelta(minutes=30),
        price=3.50,
        capacity=40,
        status="scheduled",
        platform_or_vehicle="Bay 4",
    )
    train1 = RouteSegment(
        segment_code="TRN-101",
        transport_type="train",
        operator_name="MetroRail Express",
        origin="Metro Central Station",
        destination="Financial Grand Terminal",
        departure_time=base_time + timedelta(minutes=40),
        arrival_time=base_time + timedelta(minutes=75),
        price=12.00,
        capacity=200,
        status="scheduled",
        platform_or_vehicle="Platform 2B",
    )
    taxi1 = RouteSegment(
        segment_code="TXI-88",
        transport_type="taxi",
        operator_name="SwiftCab On-Demand",
        origin="Financial Grand Terminal",
        destination="Innovation Tech Park",
        departure_time=base_time + timedelta(minutes=85),
        arrival_time=base_time + timedelta(minutes=110),
        price=18.50,
        capacity=4,
        status="scheduled",
        platform_or_vehicle="Toyota Prius #88",
    )
    db.add_all([bus1, train1, taxi1])
    db.flush()

    # Pre-book Alice on Bus -> Train -> Taxi journey
    seg_ids = [bus1.id, train1.id, taxi1.id]
    booking = Booking(
        booking_reference="MAAS-2026-X892",
        user_id=alice.id,
        route_ids_json=json.dumps(seg_ids),
        total_price=34.00,
        qr_code_str=f"OMNIPASS:MAAS-2026-X892:USER_{alice.id}:SEGMENTS_{'-'.join(str(i) for i in seg_ids)}",
        status="confirmed",
        payment_status="paid",
    )
    db.add(booking)
    db.commit()


def init_db(seed: bool = True) -> None:
    """Initializes tables and populates seed data."""
    Base.metadata.create_all(bind=engine)
    if seed:
        with get_db_context() as db:
            seed_database(db, force=False)


def reset_db() -> None:
    """Drops and re-creates all tables with fresh seed data."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with get_db_context() as db:
        seed_database(db, force=True)

``

---

## File: app/main.py

``python
"""Main Application Entry Point for the Universal Public Transport Booking System (MaaS).

Can be launched via:
    streamlit run app/main.py
or directly:
    python app/main.py
"""

import sys
import os
from pathlib import Path

# Add project root to sys.path so imports work regardless of execution method
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st
from app.config import APP_TITLE, APP_SUBTITLE
from app.database import init_db, get_db_context
from app.models import User
from app.views.passenger_ui import render_passenger_ui
from app.views.operator_ui import render_operator_ui
from app.views.admin_ui import render_admin_ui


def init_app():
    """Initializes database schema and seed data on startup."""
    init_db(seed=True)


def main():
    """Streamlit application UI logic."""
    st.set_page_config(
        page_title="OmniPass MaaS",
        page_icon="🚆",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # Initialize DB tables and seed data if needed
    init_app()

    # Custom Header Styling
    st.markdown(
        """
        <style>
        .main-header {
            background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%);
            padding: 20px;
            border-radius: 10px;
            color: white;
            margin-bottom: 20px;
        }
        .main-header h1 {
            color: white;
            margin: 0;
            font-size: 2.2rem;
        }
        .main-header p {
            color: #dbeafe;
            margin: 5px 0 0 0;
            font-size: 1.05rem;
        }
        </style>
        <div class="main-header">
            <h1>🚆 OmniPass MaaS</h1>
            <p>Universal Multimodal Public Transport Platform • Dynamic Disruption Recovery</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    with get_db_context() as db:
        users = db.query(User).all()

        # Sidebar Role Switcher
        st.sidebar.image(
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80",
            caption="Universal Mobility as a Service",
            use_container_width=True,
        )
        st.sidebar.title("👤 Select Active Role")

        # Group users by role
        passengers = [u for u in users if u.role == "passenger"]
        operators = [u for u in users if u.role == "operator"]
        admins = [u for u in users if u.role == "admin"]

        role_category = st.sidebar.radio(
            "Portal Role",
            ["Passenger", "Transport Operator", "Admin / Support"],
            index=0,
            key="portal_role_radio",
        )

        current_user = None

        if role_category == "Passenger":
            selected_user_email = st.sidebar.selectbox(
                "Logged In Passenger",
                [u.email for u in passengers],
                format_func=lambda email: next((f"🧳 {u.name} ({u.email})" for u in passengers if u.email == email), email),
                key="passenger_select",
            )
            current_user = next((u for u in passengers if u.email == selected_user_email), passengers[0] if passengers else None)

        elif role_category == "Transport Operator":
            selected_user_email = st.sidebar.selectbox(
                "Operator Identity",
                [u.email for u in operators],
                format_func=lambda email: next((f"🚆 {u.name}" for u in operators if u.email == email), email),
                key="operator_select",
            )
            current_user = next((u for u in operators if u.email == selected_user_email), operators[0] if operators else None)

        else:
            selected_user_email = st.sidebar.selectbox(
                "Admin Staff",
                [u.email for u in admins],
                format_func=lambda email: next((f"🛠️ {u.name}" for u in admins if u.email == email), email),
                key="admin_select",
            )
            current_user = next((u for u in admins if u.email == selected_user_email), admins[0] if admins else None)

        # Quick Demo Guide in sidebar
        with st.sidebar.expander("💡 3-Step Demo Walkthrough", expanded=False):
            st.markdown(
                """
                **How to test Dynamic Disruption Recovery:**
                1. **Passenger:** View Alice Smith's active pass (*Tab: My Passes*). Notice Train TRN-101 (09:15 arrival) and Taxi TXI-88 (09:25 pickup).
                2. **Admin:** Switch role to **Admin / Support** ➔ *Live Disruption Simulator*. Add a **+25 min delay** to Train TRN-101 and click *Trigger Simulation*.
                3. **Observe:** Taxi TXI-88 pickup is automatically rescheduled to **09:50** ($0 penalty fee)! Switch back to Alice's pass to view the live recovery alert banner.
                """
            )

        st.sidebar.divider()
        st.sidebar.caption("Universal Transport MaaS Prototype v1.0.0")

        # Route to appropriate role view
        if not current_user:
            st.error("No valid user selected. Please check database configuration.")
            return

        if current_user.role == "passenger":
            render_passenger_ui(db, current_user)
        elif current_user.role == "operator":
            render_operator_ui(db, current_user)
        elif current_user.role == "admin":
            render_admin_ui(db, current_user)


if __name__ == "__main__":
    # Check if run directly via `python app/main.py`
    # If not running under Streamlit CLI, launch Streamlit programmatically
    import sys
    try:
        from streamlit.web import cli as stcli
        # If the script was called with `python app/main.py`
        if not any("streamlit" in arg for arg in sys.argv):
            sys.argv = ["streamlit", "run", os.path.abspath(__file__)] + sys.argv[1:]
            sys.exit(stcli.main())
        else:
            main()
    except ImportError:
        # Fallback if streamlit is invoked normally
        main()

``

---

## File: app/models.py

``python
"""SQLAlchemy Database Models for Universal Public Transport Booking System (MaaS)."""

import json
from datetime import datetime
from typing import List
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class User(Base):
    """Represents a system user (Passenger, Transport Operator, or Admin)."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    role = Column(String(20), nullable=False, default="passenger")  # passenger, operator, admin
    phone = Column(String(30), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} name='{self.name}' role='{self.role}'>"


class RouteSegment(Base):
    """Represents an individual leg of a journey (e.g., specific bus, train ride, or taxi pickup)."""

    __tablename__ = "route_segments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transport_type = Column(String(20), nullable=False, index=True)  # bus, train, taxi
    operator_name = Column(String(100), nullable=False, default="Metro Transit")
    segment_code = Column(String(50), nullable=False, unique=True, index=True)  # e.g., 'TRN-101', 'BUS-404'
    origin = Column(String(120), nullable=False, index=True)
    destination = Column(String(120), nullable=False, index=True)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    capacity = Column(Integer, default=50)
    status = Column(String(20), nullable=False, default="scheduled")  # scheduled, delayed, completed, cancelled
    delay_minutes = Column(Integer, default=0)
    platform_or_vehicle = Column(String(80), nullable=True)  # e.g., 'Platform 3', 'Bay 12', 'Cab #TX-40'

    # Relationships
    disruption_logs = relationship("DisruptionLog", back_populates="segment", cascade="all, delete-orphan")

    @property
    def duration_minutes(self) -> int:
        """Returns total duration in minutes."""
        if self.arrival_time and self.departure_time:
            delta = self.arrival_time - self.departure_time
            return max(0, int(delta.total_seconds() // 60))
        return 0

    def __repr__(self) -> str:
        return (
            f"<RouteSegment id={self.id} code='{self.segment_code}' "
            f"type='{self.transport_type}' {self.origin}->{self.destination} status='{self.status}'>"
        )


class Booking(Base):
    """Represents a unified multimodal journey booking made by a passenger."""

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_reference = Column(String(40), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    route_ids_json = Column(Text, nullable=False)  # JSON encoded list of RouteSegment IDs: e.g. "[1, 2, 3]"
    total_price = Column(Float, nullable=False, default=0.0)
    qr_code_str = Column(Text, nullable=True)  # Base64 or string QR payload for single-ticket pass
    status = Column(String(30), nullable=False, default="confirmed")  # confirmed, rescheduled, completed, cancelled
    payment_status = Column(String(20), default="paid")  # paid, refunded, pending
    rescheduled_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookings")

    @property
    def segment_ids(self) -> List[int]:
        """Parses and returns the list of route segment IDs."""
        try:
            return json.loads(self.route_ids_json)
        except Exception:
            return []

    @segment_ids.setter
    def segment_ids(self, ids: List[int]) -> None:
        """Serializes list of route segment IDs to JSON string."""
        self.route_ids_json = json.dumps(ids)

    def __repr__(self) -> str:
        return f"<Booking ref='{self.booking_reference}' user_id={self.user_id} status='{self.status}'>"


class DisruptionLog(Base):
    """Audit log capturing delay events and connection rescheduling history."""

    __tablename__ = "disruption_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    segment_id = Column(Integer, ForeignKey("route_segments.id"), nullable=False, index=True)
    delay_minutes = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    impacted_bookings_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    resolved = Column(Boolean, default=False)

    # Relationships
    segment = relationship("RouteSegment", back_populates="disruption_logs")

    def __repr__(self) -> str:
        return (
            f"<DisruptionLog id={self.id} segment_id={self.segment_id} "
            f"delay=+{self.delay_minutes}m reason='{self.reason}'>"
        )

``

---

## File: app/schemas.py

``python
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

``

---

## File: app/__init__.py

``python
"""Universal Public Transport Booking System (MaaS Platform)."""

__version__ = "1.0.0"

``

---

## File: app/services/disruption_engine.py

``python
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

``

---

## File: app/services/qr_generator.py

``python
"""Digital QR Code Generator for Multimodal Single Journey Passes."""

import io
import base64
from typing import Optional


def generate_qr_code_image(data_payload: str, box_size: int = 8, border: int = 2) -> str:
    """Generates a QR code image as a base64-encoded PNG string.

    Args:
        data_payload: The text payload to encode into the QR code.
        box_size: Number of pixels per QR code module.
        border: Thickness of the quiet zone border.

    Returns:
        Base64 string representing PNG image ('data:image/png;base64,...').
    """
    try:
        import qrcode
        from PIL import Image

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=box_size,
            border=border,
        )
        qr.add_data(data_payload)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#1E3A8A", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        # Fallback dummy inline SVG if QR generation library fails
        encoded_text = data_payload[:40]
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">'
            f'<rect width="200" height="200" fill="#f1f5f9"/>'
            f'<text x="20" y="100" font-family="monospace" font-size="12" fill="#334155">{encoded_text}</text>'
            f'</svg>'
        )
        b64_svg = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
        return f"data:image/svg+xml;base64,{b64_svg}"


def generate_qr_bytes(data_payload: str) -> bytes:
    """Returns raw bytes of generated QR PNG image."""
    import qrcode

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data_payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

``

---

## File: app/services/routing_engine.py

``python
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

``

---

## File: app/services/__init__.py

``python
"""Services package for routing, disruption recovery, and ticketing."""

``

---

## File: app/views/admin_ui.py

``python
"""Admin Portal & Live Disruption Simulator.

Features:
- Live Disruption Simulator: Interactive trigger for route delays with real-time
  side-by-side comparison (Traditional Missed Connection vs. Dynamic MaaS Auto-Recovery).
- Audit Disruption Logs.
- Booking & Passenger Support Monitor.
- Demo Database Quick Reset.
"""

import streamlit as st
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import User, RouteSegment, Booking, DisruptionLog
from app.services.disruption_engine import handle_segment_delay, get_active_disruptions
from app.database import reset_db


def render_admin_ui(db: Session, current_user: User) -> None:
    """Renders the admin control center and Live Disruption Simulator."""
    st.markdown(f"### 🛠️ Admin Control Center & System Oversight")
    st.caption("Real-time network monitoring, Live Disruption Simulation, and cross-operator passenger care.")

    tabs = st.tabs([
        "⚡ Live Disruption Simulator",
        "📜 Disruption Audit Logs",
        "👥 User Management",
        "📑 All Passenger Bookings",
        "🔄 System Maintenance",
    ])

    # ---------------- TAB 1: Live Disruption Simulator ----------------
    with tabs[0]:
        st.markdown("#### ⚡ Dynamic Disruption Recovery Simulator")
        st.write(
            "Simulate an unexpected train or bus delay in real time to observe how the **Dynamic Disruption Recovery Engine** "
            "protects multimodal passengers by automatically rescheduling connecting taxi pickups without penalty fees."
        )

        sim_col1, sim_col2 = st.columns([1, 1])

        # Candidate segments for simulation
        train_bus_segments = (
            db.query(RouteSegment)
            .filter(RouteSegment.transport_type.in_(["train", "bus"]))
            .order_by(RouteSegment.departure_time.asc())
            .all()
        )

        seg_labels = {
            f"{s.segment_code} ({s.transport_type.upper()}: {s.origin} ➔ {s.destination} @ {s.departure_time.strftime('%H:%M')})": s.id
            for s in train_bus_segments
        }

        with sim_col1:
            st.markdown("##### 1️⃣ Configure Simulated Delay")
            selected_label = st.selectbox("Select Active Route Segment", list(seg_labels.keys()), key="sim_seg_choice")
            target_segment_id = seg_labels[selected_label]
            target_seg = db.query(RouteSegment).filter(RouteSegment.id == target_segment_id).first()

            delay_slider = st.slider("Simulate Delay (Minutes)", min_value=5, max_value=60, value=25, step=5, key="sim_delay_val")
            sim_reason = st.selectbox(
                "Incident Scenario",
                [
                    "Signal Failure on Main Corridor",
                    "Overhead Power Line Voltage Drop",
                    "Flash Flooding on Rail Section",
                    "Heavy Highway Congestion",
                ],
                key="sim_reason_choice",
            )

            simulate_btn = st.button("🚀 Trigger Live Disruption Simulation", type="primary", use_container_width=True)

        with sim_col2:
            st.markdown("##### 2️⃣ Live Network State")
            if target_seg:
                st.info(
                    f"**Segment:** `{target_seg.segment_code}` ({target_seg.transport_type.upper()})\n\n"
                    f"**Operator:** {target_seg.operator_name}\n\n"
                    f"**Current Departure:** {target_seg.departure_time.strftime('%H:%M')}\n\n"
                    f"**Current Arrival:** {target_seg.arrival_time.strftime('%H:%M')}\n\n"
                    f"**Current Status:** `{target_seg.status.upper()}` (Delay: +{target_seg.delay_minutes}m)"
                )

        if simulate_btn:
            with st.spinner("Executing Dynamic Disruption Recovery..."):
                sim_result = handle_segment_delay(
                    db=db,
                    segment_id=target_segment_id,
                    delay_minutes=delay_slider,
                    reason=f"Admin Simulation: {sim_reason}",
                )
            st.session_state["latest_sim_result"] = sim_result
            st.rerun()

        # Side-by-side comparison view
        latest_result = st.session_state.get("latest_sim_result")
        if latest_result:
            st.divider()
            st.markdown("### 📊 Side-by-Side Impact Comparison")
            st.success(f"Simulation completed: {latest_result['message']}")

            side1, side2 = st.columns(2)

            with side1:
                st.markdown(
                    """
                    <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 10px; padding: 18px;">
                        <h4 style="color: #b91c1c; margin-top: 0;">❌ Legacy / Traditional Transport</h4>
                        <p style="color: #7f1d1d; font-size: 0.9em;">Without Dynamic Disruption Recovery:</p>
                        <ul style="color: #7f1d1d; font-size: 0.9em; line-height: 1.6;">
                            <li>Train experiences unexpected delay.</li>
                            <li>Downstream taxi driver waits 5 mins and marks <b>No-Show</b>.</li>
                            <li>Passenger arrives at terminal to find <b>Taxi departed</b>.</li>
                            <li>Passenger forced to pay <b>$15.00 Cancellation / Missed Fee</b>.</li>
                            <li>High passenger frustration and manual dispute calls.</li>
                        </ul>
                        <div style="background: white; border-radius: 6px; padding: 10px; border-left: 4px solid #ef4444; font-size: 0.85em; color: #991b1b;">
                            <b>Outcome:</b> Missed connection, stranded passenger, punitive fee.
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            with side2:
                st.markdown(
                    f"""
                    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 18px;">
                        <h4 style="color: #15803d; margin-top: 0;">✅ OmniPass MaaS Dynamic Recovery</h4>
                        <p style="color: #14532d; font-size: 0.9em;">With Automated Dynamic Connection Protection:</p>
                        <ul style="color: #14532d; font-size: 0.9em; line-height: 1.6;">
                            <li>Delay (+{latest_result['delay_minutes']}m) instantly detected by central MaaS engine.</li>
                            <li><b>{latest_result['rescheduled_taxis_count']} Connecting Taxi(s)</b> automatically shifted.</li>
                            <li>Passenger notified immediately via in-app banner.</li>
                            <li><b>$0.00 Rebooking Fee</b> guaranteed under single multimodal pass.</li>
                            <li>Taxi awaits passenger smoothly at new estimated arrival time.</li>
                        </ul>
                        <div style="background: white; border-radius: 6px; padding: 10px; border-left: 4px solid #22c55e; font-size: 0.85em; color: #166534;">
                            <b>Outcome:</b> Seamless end-to-end journey preserved, zero penalty.
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            # Impacted passenger breakdown table
            if latest_result.get("impacted_details"):
                st.markdown("##### 👥 Rescheduled Passenger Itineraries")
                for item in latest_result["impacted_details"]:
                    taxis_info = ", ".join(f"{t['taxi_code']} (New Pickup: {t['new_pickup']})" for t in item["taxis_rescheduled"]) or "Buffer adjusted"
                    st.info(
                        f"**Passenger:** {item['passenger_name']} ({item['passenger_phone']}) | "
                        f"**Pass Ref:** `{item['booking_reference']}` | "
                        f"**Connecting Taxi:** {taxis_info}"
                    )

    # ---------------- TAB 2: Disruption Audit Logs ----------------
    with tabs[1]:
        st.markdown("#### 📜 Incident & Recovery Audit Trail")
        logs = get_active_disruptions(db)
        if logs:
            df_logs = pd.DataFrame(logs)
            st.dataframe(df_logs, use_container_width=True)
        else:
            st.info("No disruption events recorded yet. Use the simulator above to generate one!")

    # ---------------- TAB 3: User Management ----------------
    with tabs[2]:
        st.markdown("#### 👥 Registered System Users")
        users = db.query(User).all()
        user_rows = []
        for u in users:
            user_rows.append({
                "ID": u.id,
                "Name": u.name,
                "Email": u.email,
                "Role": u.role.upper(),
                "Phone": u.phone or "-",
                "Created At": u.created_at.strftime("%Y-%m-%d %H:%M"),
            })
        st.dataframe(pd.DataFrame(user_rows), use_container_width=True)

    # ---------------- TAB 4: All Bookings ----------------
    with tabs[3]:
        st.markdown("#### 📑 Cross-Modal Booking Registry")
        all_bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
        b_rows = []
        for b in all_bookings:
            u = db.query(User).filter(User.id == b.user_id).first()
            b_rows.append({
                "Ref": b.booking_reference,
                "Passenger": u.name if u else f"User #{b.user_id}",
                "Status": b.status.upper(),
                "Total Fare": f"${b.total_price:.2f}",
                "Payment": b.payment_status.upper(),
                "Reason / Notes": b.rescheduled_reason or "-",
                "Date": b.created_at.strftime("%Y-%m-%d %H:%M"),
            })
        st.dataframe(pd.DataFrame(b_rows), use_container_width=True)

    # ---------------- TAB 5: System Maintenance ----------------
    with tabs[4]:
        st.markdown("#### 🔄 Prototype Environment Reset")
        st.write("Reset database to initial pristine seed data (resets all delays, bookings, and timestamps).")
        if st.button("⚠️ Reset Entire Database to Fresh Seed Data", type="secondary"):
            reset_db()
            st.session_state.clear()
            st.success("✅ Database successfully wiped and re-seeded with pristine multimodal timetable!")
            st.rerun()

``

---

## File: app/views/operator_ui.py

``python
"""Transport Operator Dashboard View.

Features:
- Fleet and schedule monitoring across Bus, Train, and Taxi legs.
- Operator delay reporting triggering Dynamic Disruption Recovery.
- Capacity, fare, and platform management.
"""

import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models import User, RouteSegment
from app.services.disruption_engine import handle_segment_delay


def render_operator_ui(db: Session, current_user: User) -> None:
    """Renders the transit operator management dashboard."""
    st.markdown(f"### 🚆 Operator Operations Hub — {current_user.name}")
    st.caption("Manage fleet timetables, report service delays, and trigger automated connection recovery.")

    tabs = st.tabs(["📊 Fleet & Route Status", "🚨 Report Operational Delay", "⚙️ Schedule & Fare Management"])

    # ---------------- TAB 1: Fleet & Route Status ----------------
    with tabs[0]:
        st.markdown("#### 📋 Active Transit Segments")

        mode_filter = st.multiselect(
            "Filter Transport Type",
            ["train", "bus", "taxi"],
            default=["train", "bus", "taxi"],
            format_func=lambda x: f"{'🚆' if x == 'train' else '🚌' if x == 'bus' else '🚕'} {x.upper()}",
        )

        query = db.query(RouteSegment)
        if mode_filter:
            query = query.filter(RouteSegment.transport_type.in_(mode_filter))
        segments = query.order_by(RouteSegment.departure_time.asc()).all()

        if segments:
            table_data = []
            for s in segments:
                table_data.append({
                    "Code": s.segment_code,
                    "Type": s.transport_type.upper(),
                    "Operator": s.operator_name,
                    "Origin ➔ Dest": f"{s.origin} ➔ {s.destination}",
                    "Departure": s.departure_time.strftime("%H:%M"),
                    "Arrival": s.arrival_time.strftime("%H:%M"),
                    "Status": s.status.upper(),
                    "Delay": f"+{s.delay_minutes}m" if s.delay_minutes > 0 else "On Time",
                    "Fare": f"${s.price:.2f}",
                    "Vehicle/Platform": s.platform_or_vehicle or "-",
                })
            df = pd.DataFrame(table_data)
            st.dataframe(df, use_container_width=True)
        else:
            st.info("No segments match the selected filter.")

    # ---------------- TAB 2: Report Operational Delay ----------------
    with tabs[1]:
        st.markdown("#### 🚨 Dispatcher Incident / Delay Notification")
        st.write("When an incident is reported, the system automatically recalculates downstream passenger journeys and reschedules connecting taxis.")

        # Filter segments that can have delays (train and bus primarily)
        reportable_segs = (
            db.query(RouteSegment)
            .filter(RouteSegment.transport_type.in_(["train", "bus"]))
            .order_by(RouteSegment.departure_time.asc())
            .all()
        )

        if not reportable_segs:
            st.warning("No train or bus segments available to report delays for.")
            return

        seg_options = {
            f"[{s.transport_type.upper()}] {s.segment_code} - {s.origin} ➔ {s.destination} ({s.departure_time.strftime('%H:%M')})": s.id
            for s in reportable_segs
        }

        selected_label = st.selectbox("Select Delayed Segment", list(seg_options.keys()))
        selected_seg_id = seg_options[selected_label]

        col1, col2 = st.columns(2)
        with col1:
            delay_mins = st.slider("Reported Delay (Minutes)", min_value=5, max_value=90, value=20, step=5)
        with col2:
            disruption_cause = st.selectbox(
                "Disruption Root Cause",
                [
                    "Track Maintenance & Signal Issue",
                    "Mechanical Locomotive Fault",
                    "Severe Weather / Heavy Rain",
                    "Traffic Congestion on Expressway",
                    "Medical Emergency Onboard",
                    "Infrastructure Power Outage",
                ],
            )

        additional_notes = st.text_input("Incident Log Notes", value="Operator field dispatch report")

        if st.button("🚀 Submit Delay & Trigger Auto-Recovery", type="primary"):
            full_reason = f"{disruption_cause} ({additional_notes})"
            with st.spinner("Processing disruption and updating passenger connections..."):
                result = handle_segment_delay(
                    db=db,
                    segment_id=selected_seg_id,
                    delay_minutes=delay_mins,
                    reason=full_reason,
                )

            if result["success"]:
                st.success(f"✅ {result['message']}")
                if result["rescheduled_taxis_count"] > 0:
                    st.info(f"🚕 {result['rescheduled_taxis_count']} connecting taxi pickup(s) successfully rescheduled without penalty fees.")
                st.rerun()
            else:
                st.error(f"❌ Failed to process delay: {result['message']}")

    # ---------------- TAB 3: Schedule & Fare Management ----------------
    with tabs[2]:
        st.markdown("#### ⚙️ Quick Segment Capacity & Fare Adjuster")
        all_segs = db.query(RouteSegment).order_by(RouteSegment.segment_code.asc()).all()
        seg_edit_opts = {f"{s.segment_code} ({s.transport_type.upper()}: {s.origin} ➔ {s.destination})": s.id for s in all_segs}

        edit_choice = st.selectbox("Select Segment to Update", list(seg_edit_opts.keys()), key="op_edit_seg")
        target_seg = db.query(RouteSegment).filter(RouteSegment.id == seg_edit_opts[edit_choice]).first()

        if target_seg:
            c1, c2, c3 = st.columns(3)
            with c1:
                new_price = st.number_input("Ticket Fare ($)", min_value=0.50, max_value=200.0, value=float(target_seg.price), step=0.50)
            with c2:
                new_cap = st.number_input("Passenger Capacity", min_value=1, max_value=500, value=int(target_seg.capacity), step=5)
            with c3:
                new_platform = st.text_input("Platform / Bay / Vehicle", value=target_seg.platform_or_vehicle or "")

            if st.button("💾 Save Segment Updates"):
                target_seg.price = new_price
                target_seg.capacity = new_cap
                target_seg.platform_or_vehicle = new_platform
                db.commit()
                st.success(f"Updated {target_seg.segment_code} details.")
                st.rerun()

``

---

## File: app/views/passenger_ui.py

``python
"""Passenger View Component.

Features:
- Multimodal journey search across Bus, Train, and Taxi.
- Unified single ticket purchase with mock payment gateway.
- Digital Single Journey Pass with dynamic QR code.
- Real-time Dynamic Disruption Recovery alerts and rescheduled taxi indicators.
"""

import streamlit as st
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import User, Booking, RouteSegment
from app.services.routing_engine import (
    get_all_locations,
    find_multimodal_routes,
    create_passenger_booking,
)
from app.services.qr_generator import generate_qr_code_image


def render_passenger_ui(db: Session, current_user: User) -> None:
    """Renders the comprehensive passenger mobility dashboard."""
    st.markdown(f"### 🧳 Welcome, {current_user.name}")
    st.caption("Plan, book, and manage your multimodal journeys with guaranteed dynamic connection protection.")

    tabs = st.tabs(["🔍 Search & Book Multimodal Trip", "🎟️ My Passes & Live Journey Protection", "💳 Mock Payment Portal"])

    # ---------------- TAB 1: Search & Book ----------------
    with tabs[0]:
        st.markdown("#### 🗺️ Multimodal Journey Planner")
        locations = get_all_locations(db)

        col1, col2, col3 = st.columns([2, 2, 1])
        with col1:
            default_origin_idx = 0
            for idx, loc in enumerate(locations):
                if "suburbia" in loc.lower():
                    default_origin_idx = idx
                    break
            origin = st.selectbox("Origin", locations, index=default_origin_idx, key="p_origin")

        with col2:
            default_dest_idx = min(1, len(locations) - 1)
            for idx, loc in enumerate(locations):
                if "tech park" in loc.lower() or "convention" in loc.lower():
                    default_dest_idx = idx
                    break
            destination = st.selectbox("Destination", locations, index=default_dest_idx, key="p_destination")

        with col3:
            include_taxi = st.checkbox("Include On-Demand Taxi", value=True, help="Include last-mile taxi feeder connections")

        if origin == destination:
            st.warning("⚠️ Origin and destination cannot be identical. Please select different stations.")
            return

        journeys = find_multimodal_routes(db, origin, destination, allow_taxi_feeder=include_taxi)

        st.markdown(f"**Found {len(journeys)} multimodal route options:**")

        if not journeys:
            st.info("No connected routes found between these locations. Try selecting 'Suburbia Green Heights' to 'Innovation Tech Park'.")
            if st.button("💡 Load Recommended Commute Route"):
                st.session_state["p_origin"] = "Suburbia Green Heights"
                st.session_state["p_destination"] = "Innovation Tech Park"
                st.rerun()

        for idx, journey in enumerate(journeys):
            with st.container():
                st.markdown(
                    f"""
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; color: #1e3a8a;">Option {idx + 1}: {journey['modes_summary']}</h4>
                            <span style="font-size: 1.3em; font-weight: bold; color: #047857;">${journey['total_price']:.2f}</span>
                        </div>
                        <p style="margin: 8px 0; color: #475569;">
                            ⏱️ <strong>{journey['departure_str']} ➔ {journey['arrival_str']}</strong> ({journey['total_duration_minutes']} mins total) 
                            • 🔀 Transfers: {journey['transfers_count']}
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                # Segment timeline breakdown
                cols = st.columns(len(journey["segments"]))
                for s_idx, seg in enumerate(journey["segments"]):
                    with cols[s_idx]:
                        badge_color = {
                            "bus": "#3b82f6",
                            "train": "#8b5cf6",
                            "taxi": "#f59e0b",
                        }.get(seg["transport_type"].lower(), "#64748b")

                        st.markdown(
                            f"""
                            <div style="background: white; border-top: 4px solid {badge_color}; border-radius: 6px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-size: 0.85em;">
                                <strong>{seg['transport_type'].upper()}: {seg['segment_code']}</strong><br/>
                                <span style="color:#64748b;">{seg['operator_name']}</span><br/>
                                📍 <b>{seg['origin']}</b> ({seg['departure_str']})<br/>
                                ➔ <b>{seg['destination']}</b> ({seg['arrival_str']})<br/>
                                🏷️ {seg['platform_or_vehicle']}<br/>
                                💵 ${seg['price']:.2f}
                            </div>
                            """,
                            unsafe_allow_html=True,
                        )
                        if seg["transfer_buffer_minutes"] > 0:
                            st.caption(f"⏳ {seg['transfer_buffer_minutes']}m buffer before next leg")

                book_col1, book_col2 = st.columns([3, 1])
                with book_col2:
                    if st.button(f"⚡ One-Click Book (${journey['total_price']:.2f})", key=f"book_btn_{idx}"):
                        new_booking = create_passenger_booking(
                            db=db,
                            user_id=current_user.id,
                            segment_ids=journey["segment_ids"],
                        )
                        st.success(f"🎉 Trip booked successfully! Reference: **{new_booking.booking_reference}**")
                        st.session_state["just_booked_ref"] = new_booking.booking_reference
                        st.rerun()

                st.divider()

    # ---------------- TAB 2: My Passes & Live Journey Protection ----------------
    with tabs[1]:
        st.markdown("#### 🎫 My Active Digital Passes & Protected Journeys")
        user_bookings = (
            db.query(Booking)
            .filter(Booking.user_id == current_user.id)
            .order_by(Booking.created_at.desc())
            .all()
        )

        if not user_bookings:
            st.info("You don't have any bookings yet. Search and book a journey above!")
            return

        for booking in user_bookings:
            seg_ids = booking.segment_ids
            segments = db.query(RouteSegment).filter(RouteSegment.id.in_(seg_ids)).all()
            seg_map = {s.id: s for s in segments}
            ordered_segs = [seg_map[sid] for sid in seg_ids if sid in seg_map]

            is_rescheduled = booking.status == "rescheduled"
            status_color = "#f59e0b" if is_rescheduled else "#10b981"
            border_color = "#f59e0b" if is_rescheduled else "#2563eb"

            # Dynamic Disruption Alert Box
            if is_rescheduled:
                st.markdown(
                    f"""
                    <div style="background-color: #fffbeb; border-left: 6px solid #f59e0b; padding: 14px; border-radius: 6px; margin-bottom: 12px;">
                        <h4 style="color: #b45309; margin: 0;">⚡ Dynamic Disruption Recovery Active</h4>
                        <p style="margin: 6px 0 0 0; color: #92400e; font-size: 0.95em;">
                            {booking.rescheduled_reason or 'Your connecting schedule was adjusted automatically with $0 penalty fee.'}
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            # Ticket Card container
            with st.container():
                st.markdown(
                    f"""
                    <div style="border: 2px solid {border_color}; border-radius: 12px; padding: 18px; background: white; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px;">
                            <div>
                                <span style="font-size: 1.1em; font-weight: bold; color: #1e293b;">Universal Single Journey Pass</span><br/>
                                <span style="font-family: monospace; color: #64748b;">REF: {booking.booking_reference}</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="background-color: {status_color}; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.85em; text-transform: uppercase;">
                                    {booking.status}
                                </span><br/>
                                <small style="color: #64748b;">Paid: ${booking.total_price:.2f}</small>
                            </div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                ticket_left, ticket_right = st.columns([2, 1])

                with ticket_left:
                    st.markdown("##### 📍 Itinerary Timeline")
                    for s in ordered_segs:
                        delay_text = f" <span style='color: #dc2626; font-weight: bold;'>(+{s.delay_minutes}m delay)</span>" if s.delay_minutes > 0 else ""
                        icon = "🚌" if s.transport_type == "bus" else "🚆" if s.transport_type == "train" else "🚕"
                        st.markdown(
                            f"""
                            - **{icon} {s.transport_type.upper()}: {s.segment_code}** ({s.operator_name})
                              - **Departure:** {s.departure_time.strftime('%H:%M')} from *{s.origin}*
                              - **Arrival:** {s.arrival_time.strftime('%H:%M')} at *{s.destination}*{delay_text}
                              - **Vehicle / Bay:** `{s.platform_or_vehicle}`
                            """,
                            unsafe_allow_html=True,
                        )

                with ticket_right:
                    st.markdown("##### 📱 Digital QR Pass")
                    qr_img_data = generate_qr_code_image(booking.qr_code_str or booking.booking_reference)
                    st.markdown(
                        f"""
                        <div style="text-align: center;">
                            <img src="{qr_img_data}" width="160" style="border-radius: 8px; border: 1px solid #cbd5e1; padding: 4px;"/>
                            <div style="font-size: 0.75em; color: #64748b; margin-top: 4px;">Scan at bus/train gates & taxi pickup</div>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

                st.divider()

    # ---------------- TAB 3: Mock Payment Portal ----------------
    with tabs[2]:
        st.markdown("#### 💳 Simulated Mock Payment Gateway")
        st.write("Demonstration of the frictionless unified single checkout for multimodal journeys.")
        pcol1, pcol2 = st.columns(2)
        with pcol1:
            st.text_input("Cardholder Name", value=current_user.name, disabled=True)
            st.text_input("Card Number", value="•••• •••• •••• 4242", disabled=True)
        with pcol2:
            st.text_input("Expiry", value="12/28", disabled=True)
            st.text_input("CVV", value="•••", disabled=True)

        st.success("✅ Payment Gateway connected: Mock Instant Settlement Mode (Active)")

``

---

## File: app/views/__init__.py

``python
"""UI Views and components package for Passenger, Operator, and Admin roles."""

``

---

## File: data/seed_data.json

``json
{
  "users": [
    {
      "name": "Alice Smith",
      "email": "alice@example.com",
      "role": "passenger",
      "phone": "+1-555-0101"
    },
    {
      "name": "Bob Jones",
      "email": "bob@example.com",
      "role": "passenger",
      "phone": "+1-555-0102"
    },
    {
      "name": "Elena Rostova",
      "email": "elena@example.com",
      "role": "passenger",
      "phone": "+1-555-0103"
    },
    {
      "name": "Metro Transit Dispatcher",
      "email": "operator@metro.org",
      "role": "operator",
      "phone": "+1-555-0200"
    },
    {
      "name": "SwiftCab Fleet Dispatch",
      "email": "dispatch@swiftcab.com",
      "role": "operator",
      "phone": "+1-555-0201"
    },
    {
      "name": "Admin Support Specialist",
      "email": "admin@maas.gov",
      "role": "admin",
      "phone": "+1-555-0300"
    }
  ],
  "route_segments": [
    {
      "segment_code": "BUS-42",
      "transport_type": "bus",
      "operator_name": "City MetroBus",
      "origin": "Suburbia Green Heights",
      "destination": "Metro Central Station",
      "dep_offset_minutes": 0,
      "duration_minutes": 30,
      "price": 3.50,
      "capacity": 40,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 4"
    },
    {
      "segment_code": "TRN-101",
      "transport_type": "train",
      "operator_name": "MetroRail Rapid Express",
      "origin": "Metro Central Station",
      "destination": "Grand Financial Terminal",
      "dep_offset_minutes": 40,
      "duration_minutes": 35,
      "price": 12.00,
      "capacity": 220,
      "status": "scheduled",
      "platform_or_vehicle": "Platform 2B"
    },
    {
      "segment_code": "TXI-88",
      "transport_type": "taxi",
      "operator_name": "SwiftCab On-Demand",
      "origin": "Grand Financial Terminal",
      "destination": "Innovation Tech Park",
      "dep_offset_minutes": 85,
      "duration_minutes": 25,
      "price": 18.50,
      "capacity": 4,
      "status": "scheduled",
      "platform_or_vehicle": "Toyota Camry #88 (Driver: Carlos M.)"
    },
    {
      "segment_code": "BUS-15",
      "transport_type": "bus",
      "operator_name": "Northside Shuttle",
      "origin": "Northwood Commons",
      "destination": "Metro Central Station",
      "dep_offset_minutes": 10,
      "duration_minutes": 25,
      "price": 2.75,
      "capacity": 35,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 1"
    },
    {
      "segment_code": "TRN-204",
      "transport_type": "train",
      "operator_name": "InterCity Coastal Rail",
      "origin": "Metro Central Station",
      "destination": "Airport Intermodal Hub",
      "dep_offset_minutes": 45,
      "duration_minutes": 40,
      "price": 15.00,
      "capacity": 180,
      "status": "scheduled",
      "platform_or_vehicle": "Platform 5A"
    },
    {
      "segment_code": "TXI-14",
      "transport_type": "taxi",
      "operator_name": "SwiftCab EcoFleet",
      "origin": "Airport Intermodal Hub",
      "destination": "Seaside Convention Center",
      "dep_offset_minutes": 95,
      "duration_minutes": 20,
      "price": 16.00,
      "capacity": 4,
      "status": "scheduled",
      "platform_or_vehicle": "Hyundai Ioniq #14 (Driver: Sarah K.)"
    },
    {
      "segment_code": "BUS-99",
      "transport_type": "bus",
      "operator_name": "City MetroBus",
      "origin": "Grand Financial Terminal",
      "destination": "Innovation Tech Park",
      "dep_offset_minutes": 90,
      "duration_minutes": 35,
      "price": 3.00,
      "capacity": 45,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 8"
    }
  ],
  "sample_bookings": [
    {
      "booking_reference": "MAAS-2026-X892",
      "user_email": "alice@example.com",
      "segment_codes": ["BUS-42", "TRN-101", "TXI-88"],
      "status": "confirmed",
      "payment_status": "paid"
    },
    {
      "booking_reference": "MAAS-2026-T404",
      "user_email": "bob@example.com",
      "segment_codes": ["TRN-101", "TXI-88"],
      "status": "confirmed",
      "payment_status": "paid"
    },
    {
      "booking_reference": "MAAS-2026-A109",
      "user_email": "elena@example.com",
      "segment_codes": ["BUS-15", "TRN-204", "TXI-14"],
      "status": "confirmed",
      "payment_status": "paid"
    }
  ]
}

``

---

## File: tests/test_disruption.py

``python
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

``

---

## File: tests/.pytest_cache/.gitignore

``
# Created by pytest automatically.
*

``

---

## File: tests/.pytest_cache/CACHEDIR.TAG

``
Signature: 8a477f597d28d172789f06886806bc55
# This file is a cache directory tag created by pytest.
# For information about cache directory tags, see:
#	https://bford.info/cachedir/spec.html

``

---

## File: tests/.pytest_cache/README.md

``markdown
# pytest cache directory #

This directory contains data from the pytest's cache plugin,
which provides the `--lf` and `--ff` options, as well as the `cache` fixture.

**Do not** commit this to version control.

See [the docs](https://docs.pytest.org/en/stable/how-to/cache.html) for more information.

``

---

## File: tests/.pytest_cache/v/cache/nodeids

``
[
  "test_disruption.py::test_handle_segment_delay_invalid_inputs",
  "test_disruption.py::test_handle_segment_delay_recovers_taxi_connection",
  "test_disruption.py::test_multimodal_routing_engine"
]
``

---

``

---

## File: README.md

``markdown
# 🚆 OmniPass MaaS — Universal Public Transport Booking System

> A unified Mobility-as-a-Service (MaaS) multimodal platform integrating Buses, Trains, and Taxis into seamless end-to-end journeys with **Dynamic Disruption Recovery**.

---

## 🌟 Overview & Key Distinctive Feature

Traditional transport apps force passengers to book train, bus, and taxi legs separately. When a train is delayed, connecting taxi drivers depart or charge cancellation fees, leaving passengers stranded with no recourse.

**OmniPass MaaS** solves this with **Dynamic Disruption Recovery**:
- When a train or bus delay is reported by a transit operator or simulated by an administrator, the platform's central disruption engine **automatically recalculates downstream connections** and **reschedules the connecting taxi pickup time** without any penalty fees for the passenger.
- The passenger receives an instant in-app alert with their updated schedule and vehicle details, preserving the validity of their digital **Single Journey Pass QR code**.

---

## 👥 Three Primary Roles

1. **Passenger**
   - Search multimodal routes across Buses, Trains, and Taxis.
   - Interactive timeline cards showing transfers, buffer times, and operator information.
   - Single unified checkout via simulated Mock Payment Gateway.
   - Digital Single Journey Pass with high-resolution QR ticket.
   - Real-time delay and automatic rescheduling notification banner.

2. **Transport Operator**
   - Fleet and route timetable monitoring across all transport modes.
   - Incident & delay reporter with root-cause tracking (Signal Failure, Track Maintenance, Weather, Traffic).
   - Capacity and fare management tools.

3. **Admin / Support**
   - **Live Disruption Simulator**: Interactive slider to inject route delays and view a side-by-side comparison of Legacy vs. Dynamic MaaS Recovery.
   - Disruption audit trail and historical impact analysis.
   - Cross-operator passenger booking registry and customer care portal.
   - One-click prototype database reset to fresh seed state.

---

## 📂 Repository Structure

```text
├── app/
│   ├── __init__.py
│   ├── main.py                   # Entry point (auto-launches Streamlit or direct python)
│   ├── config.py                 # App configurations and constants
│   ├── database.py               # SQLite connection, session handling, seed & reset logic
│   ├── models.py                 # SQLAlchemy DB Models (User, RouteSegment, Booking, DisruptionLog)
│   ├── schemas.py                # Pydantic schemas / DTOs
│   ├── services/
│   │   ├── __init__.py
│   │   ├── routing_engine.py    # Multimodal route matching and booking generation
│   │   ├── disruption_engine.py # Dynamic Disruption Recovery (auto-reschedule taxi logic)
│   │   └── qr_generator.py      # QR code generation for digital Single Journey Pass
│   └── views/
│       ├── __init__.py
│       ├── passenger_ui.py      # Passenger interface components
│       ├── operator_ui.py       # Transport operator dashboard
│       └── admin_ui.py          # Admin portal & Live Disruption Simulator
├── data/
│   └── seed_data.json           # Initial multimodal routes, schedules, and mock drivers
├── tests/
│   └── test_disruption.py       # Pytest unit tests for disruption recovery & routing
├── Dockerfile                   # Production Docker image configuration
├── docker-compose.yml           # Container orchestration
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation & walkthrough
```

---

## 🚀 Quickstart Guide

### Option 1: Local Python Execution

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   You can run directly with Python:
   ```bash
   python app/main.py
   ```
   Or via the Streamlit CLI:
   ```bash
   streamlit run app/main.py
   ```

3. **Open the browser:**
   Navigate to `http://localhost:8501`.

---

### Option 2: Docker & Docker Compose

Run the entire platform inside a container with zero local setup:

```bash
docker-compose up --build
```

Access the UI at `http://localhost:8501`.

---

### 🧪 Running Unit Tests

Execute the unit tests verifying Dynamic Disruption Recovery and route matching:

```bash
pytest tests/test_disruption.py -v
```

---

## 🎬 3-Step Demo Walkthrough

1. **Step 1: Check Passenger Alice's Journey**
   - In the sidebar, select **Passenger** ➔ **Alice Smith**.
   - Navigate to the **"My Passes & Live Journey Protection"** tab.
   - Notice Alice's confirmed 3-leg trip:
     - `BUS-42`: Departs 08:00 ➔ Arrives 08:30 at *Metro Central Station*
     - `TRN-101`: Departs 08:40 ➔ Arrives 09:15 at *Grand Financial Terminal*
     - `TXI-88`: Departs 09:25 ➔ Arrives 09:50 at *Innovation Tech Park*

2. **Step 2: Simulate Delay in Admin Portal**
   - In the sidebar, switch the active role to **Admin / Support**.
   - Under the **"Live Disruption Simulator"** tab, select **TRN-101 (TRAIN)**.
   - Adjust the delay slider to **+25 minutes** (e.g. Signal Failure).
   - Click **"Trigger Live Disruption Simulation"**.

3. **Step 3: Verify Dynamic Disruption Recovery**
   - The simulator displays the **Side-by-Side Impact Comparison**:
     - *Legacy System*: Stranded passenger, missed taxi, $15 penalty fee.
     - *OmniPass MaaS*: Taxi `TXI-88` automatically shifted to **09:50** pickup with **$0 penalty fee**.
   - Switch back to **Passenger (Alice Smith)** ➔ **My Passes**.
   - Observe the prominent alert banner:
     > *"⚡ Dynamic Disruption Recovery Active: Connecting taxi (TXI-88) pickup rescheduled at no cost."*

---

## ⚙️ Technologies Used

- **Backend & Core Engines**: Python 3.11, SQLAlchemy 2.0 ORM, Pydantic 2.0
- **Database**: SQLite (ACID-compliant with thread-safe connection pooling)
- **Frontend / Prototyping**: Streamlit with custom CSS and responsive layout
- **Ticketing**: `qrcode` + Pillow (base64 digital pass generation)
- **Testing**: `pytest` with in-memory SQLite fixtures
- **DevOps**: Docker & Docker Compose

``

---

## File: requirements.txt

``text
streamlit>=1.32.0
sqlalchemy>=2.0.28
pydantic>=2.6.4
qrcode[pil]>=7.4.2
pillow>=10.2.0
pytest>=8.1.1
requests>=2.31.0
pandas>=2.2.1

``

---

## File: .pytest_cache/.gitignore

``
# Created by pytest automatically.
*

``

---

## File: .pytest_cache/CACHEDIR.TAG

``
Signature: 8a477f597d28d172789f06886806bc55
# This file is a cache directory tag created by pytest.
# For information about cache directory tags, see:
#	https://bford.info/cachedir/spec.html

``

---

## File: .pytest_cache/README.md

``markdown
# pytest cache directory #

This directory contains data from the pytest's cache plugin,
which provides the `--lf` and `--ff` options, as well as the `cache` fixture.

**Do not** commit this to version control.

See [the docs](https://docs.pytest.org/en/stable/how-to/cache.html) for more information.

``

---

## File: .pytest_cache/v/cache/nodeids

``
[
  "tests/test_disruption.py::test_handle_segment_delay_invalid_inputs",
  "tests/test_disruption.py::test_handle_segment_delay_recovers_taxi_connection",
  "tests/test_disruption.py::test_multimodal_routing_engine"
]
``

---

## File: app/config.py

``python
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

``

---

## File: app/database.py

``python
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

``

---

## File: app/main.py

``python
"""Main Application Entry Point for the Universal Public Transport Booking System (MaaS).

Can be launched via:
    streamlit run app/main.py
or directly:
    python app/main.py
"""

import sys
import os
from pathlib import Path

# Add project root to sys.path so imports work regardless of execution method
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st
from app.config import APP_TITLE, APP_SUBTITLE
from app.database import init_db, get_db_context
from app.models import User
from app.views.passenger_ui import render_passenger_ui
from app.views.operator_ui import render_operator_ui
from app.views.admin_ui import render_admin_ui


def init_app():
    """Initializes database schema and seed data on startup."""
    init_db(seed=True)


def main():
    """Streamlit application UI logic."""
    st.set_page_config(
        page_title="OmniPass MaaS",
        page_icon="🚆",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # Initialize DB tables and seed data if needed
    init_app()

    # Custom Header Styling
    st.markdown(
        """
        <style>
        .main-header {
            background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%);
            padding: 20px;
            border-radius: 10px;
            color: white;
            margin-bottom: 20px;
        }
        .main-header h1 {
            color: white;
            margin: 0;
            font-size: 2.2rem;
        }
        .main-header p {
            color: #dbeafe;
            margin: 5px 0 0 0;
            font-size: 1.05rem;
        }
        </style>
        <div class="main-header">
            <h1>🚆 OmniPass MaaS</h1>
            <p>Universal Multimodal Public Transport Platform • Dynamic Disruption Recovery</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    with get_db_context() as db:
        users = db.query(User).all()

        # Sidebar Role Switcher
        st.sidebar.image(
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80",
            caption="Universal Mobility as a Service",
            use_container_width=True,
        )
        st.sidebar.title("👤 Select Active Role")

        # Group users by role
        passengers = [u for u in users if u.role == "passenger"]
        operators = [u for u in users if u.role == "operator"]
        admins = [u for u in users if u.role == "admin"]

        role_category = st.sidebar.radio(
            "Portal Role",
            ["Passenger", "Transport Operator", "Admin / Support"],
            index=0,
            key="portal_role_radio",
        )

        current_user = None

        if role_category == "Passenger":
            selected_user_email = st.sidebar.selectbox(
                "Logged In Passenger",
                [u.email for u in passengers],
                format_func=lambda email: next((f"🧳 {u.name} ({u.email})" for u in passengers if u.email == email), email),
                key="passenger_select",
            )
            current_user = next((u for u in passengers if u.email == selected_user_email), passengers[0] if passengers else None)

        elif role_category == "Transport Operator":
            selected_user_email = st.sidebar.selectbox(
                "Operator Identity",
                [u.email for u in operators],
                format_func=lambda email: next((f"🚆 {u.name}" for u in operators if u.email == email), email),
                key="operator_select",
            )
            current_user = next((u for u in operators if u.email == selected_user_email), operators[0] if operators else None)

        else:
            selected_user_email = st.sidebar.selectbox(
                "Admin Staff",
                [u.email for u in admins],
                format_func=lambda email: next((f"🛠️ {u.name}" for u in admins if u.email == email), email),
                key="admin_select",
            )
            current_user = next((u for u in admins if u.email == selected_user_email), admins[0] if admins else None)

        # Quick Demo Guide in sidebar
        with st.sidebar.expander("💡 3-Step Demo Walkthrough", expanded=False):
            st.markdown(
                """
                **How to test Dynamic Disruption Recovery:**
                1. **Passenger:** View Alice Smith's active pass (*Tab: My Passes*). Notice Train TRN-101 (09:15 arrival) and Taxi TXI-88 (09:25 pickup).
                2. **Admin:** Switch role to **Admin / Support** ➔ *Live Disruption Simulator*. Add a **+25 min delay** to Train TRN-101 and click *Trigger Simulation*.
                3. **Observe:** Taxi TXI-88 pickup is automatically rescheduled to **09:50** ($0 penalty fee)! Switch back to Alice's pass to view the live recovery alert banner.
                """
            )

        st.sidebar.divider()
        st.sidebar.caption("Universal Transport MaaS Prototype v1.0.0")

        # Route to appropriate role view
        if not current_user:
            st.error("No valid user selected. Please check database configuration.")
            return

        if current_user.role == "passenger":
            render_passenger_ui(db, current_user)
        elif current_user.role == "operator":
            render_operator_ui(db, current_user)
        elif current_user.role == "admin":
            render_admin_ui(db, current_user)


if __name__ == "__main__":
    # Check if run directly via `python app/main.py`
    # If not running under Streamlit CLI, launch Streamlit programmatically
    import sys
    try:
        from streamlit.web import cli as stcli
        # If the script was called with `python app/main.py`
        if not any("streamlit" in arg for arg in sys.argv):
            sys.argv = ["streamlit", "run", os.path.abspath(__file__)] + sys.argv[1:]
            sys.exit(stcli.main())
        else:
            main()
    except ImportError:
        # Fallback if streamlit is invoked normally
        main()

``

---

## File: app/models.py

``python
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

``

---

## File: app/schemas.py

``python
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

``

---

## File: app/__init__.py

``python
"""Universal Public Transport Booking System (MaaS Platform)."""

__version__ = "1.0.0"

``

---

## File: app/services/disruption_engine.py

``python
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

``

---

## File: app/services/qr_generator.py

``python
"""Digital QR Code Generator for Multimodal Single Journey Passes."""

import io
import base64
from typing import Optional


def generate_qr_code_image(data_payload: str, box_size: int = 8, border: int = 2) -> str:
    """Generates a QR code image as a base64-encoded PNG string.

    Args:
        data_payload: The text payload to encode into the QR code.
        box_size: Number of pixels per QR code module.
        border: Thickness of the quiet zone border.

    Returns:
        Base64 string representing PNG image ('data:image/png;base64,...').
    """
    try:
        import qrcode
        from PIL import Image

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=box_size,
            border=border,
        )
        qr.add_data(data_payload)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#1E3A8A", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        # Fallback dummy inline SVG if QR generation library fails
        encoded_text = data_payload[:40]
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">'
            f'<rect width="200" height="200" fill="#f1f5f9"/>'
            f'<text x="20" y="100" font-family="monospace" font-size="12" fill="#334155">{encoded_text}</text>'
            f'</svg>'
        )
        b64_svg = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
        return f"data:image/svg+xml;base64,{b64_svg}"


def generate_qr_bytes(data_payload: str) -> bytes:
    """Returns raw bytes of generated QR PNG image."""
    import qrcode

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data_payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

``

---

## File: app/services/routing_engine.py

``python
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

``

---

## File: app/services/__init__.py

``python
"""Services package for routing, disruption recovery, and ticketing."""

``

---

## File: app/views/admin_ui.py

``python
"""Admin Portal & Live Disruption Simulator.

Features:
- Live Disruption Simulator: Interactive trigger for route delays with real-time
  side-by-side comparison (Traditional Missed Connection vs. Dynamic MaaS Auto-Recovery).
- Audit Disruption Logs.
- Booking & Passenger Support Monitor.
- Demo Database Quick Reset.
"""

import streamlit as st
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import User, RouteSegment, Booking, DisruptionLog
from app.services.disruption_engine import handle_segment_delay, get_active_disruptions
from app.database import reset_db


def render_admin_ui(db: Session, current_user: User) -> None:
    """Renders the admin control center and Live Disruption Simulator."""
    st.markdown(f"### 🛠️ Admin Control Center & System Oversight")
    st.caption("Real-time network monitoring, Live Disruption Simulation, and cross-operator passenger care.")

    tabs = st.tabs([
        "⚡ Live Disruption Simulator",
        "📜 Disruption Audit Logs",
        "👥 User Management",
        "📑 All Passenger Bookings",
        "🔄 System Maintenance",
    ])

    # ---------------- TAB 1: Live Disruption Simulator ----------------
    with tabs[0]:
        st.markdown("#### ⚡ Dynamic Disruption Recovery Simulator")
        st.write(
            "Simulate an unexpected train or bus delay in real time to observe how the **Dynamic Disruption Recovery Engine** "
            "protects multimodal passengers by automatically rescheduling connecting taxi pickups without penalty fees."
        )

        sim_col1, sim_col2 = st.columns([1, 1])

        # Candidate segments for simulation
        train_bus_segments = (
            db.query(RouteSegment)
            .filter(RouteSegment.transport_type.in_(["train", "bus"]))
            .order_by(RouteSegment.departure_time.asc())
            .all()
        )

        seg_labels = {
            f"{s.segment_code} ({s.transport_type.upper()}: {s.origin} ➔ {s.destination} @ {s.departure_time.strftime('%H:%M')})": s.id
            for s in train_bus_segments
        }

        with sim_col1:
            st.markdown("##### 1️⃣ Configure Simulated Delay")
            selected_label = st.selectbox("Select Active Route Segment", list(seg_labels.keys()), key="sim_seg_choice")
            target_segment_id = seg_labels[selected_label]
            target_seg = db.query(RouteSegment).filter(RouteSegment.id == target_segment_id).first()

            delay_slider = st.slider("Simulate Delay (Minutes)", min_value=5, max_value=60, value=25, step=5, key="sim_delay_val")
            sim_reason = st.selectbox(
                "Incident Scenario",
                [
                    "Signal Failure on Main Corridor",
                    "Overhead Power Line Voltage Drop",
                    "Flash Flooding on Rail Section",
                    "Heavy Highway Congestion",
                ],
                key="sim_reason_choice",
            )

            simulate_btn = st.button("🚀 Trigger Live Disruption Simulation", type="primary", use_container_width=True)

        with sim_col2:
            st.markdown("##### 2️⃣ Live Network State")
            if target_seg:
                st.info(
                    f"**Segment:** `{target_seg.segment_code}` ({target_seg.transport_type.upper()})\n\n"
                    f"**Operator:** {target_seg.operator_name}\n\n"
                    f"**Current Departure:** {target_seg.departure_time.strftime('%H:%M')}\n\n"
                    f"**Current Arrival:** {target_seg.arrival_time.strftime('%H:%M')}\n\n"
                    f"**Current Status:** `{target_seg.status.upper()}` (Delay: +{target_seg.delay_minutes}m)"
                )

        if simulate_btn:
            with st.spinner("Executing Dynamic Disruption Recovery..."):
                sim_result = handle_segment_delay(
                    db=db,
                    segment_id=target_segment_id,
                    delay_minutes=delay_slider,
                    reason=f"Admin Simulation: {sim_reason}",
                )
            st.session_state["latest_sim_result"] = sim_result
            st.rerun()

        # Side-by-side comparison view
        latest_result = st.session_state.get("latest_sim_result")
        if latest_result:
            st.divider()
            st.markdown("### 📊 Side-by-Side Impact Comparison")
            st.success(f"Simulation completed: {latest_result['message']}")

            side1, side2 = st.columns(2)

            with side1:
                st.markdown(
                    """
                    <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 10px; padding: 18px;">
                        <h4 style="color: #b91c1c; margin-top: 0;">❌ Legacy / Traditional Transport</h4>
                        <p style="color: #7f1d1d; font-size: 0.9em;">Without Dynamic Disruption Recovery:</p>
                        <ul style="color: #7f1d1d; font-size: 0.9em; line-height: 1.6;">
                            <li>Train experiences unexpected delay.</li>
                            <li>Downstream taxi driver waits 5 mins and marks <b>No-Show</b>.</li>
                            <li>Passenger arrives at terminal to find <b>Taxi departed</b>.</li>
                            <li>Passenger forced to pay <b>$15.00 Cancellation / Missed Fee</b>.</li>
                            <li>High passenger frustration and manual dispute calls.</li>
                        </ul>
                        <div style="background: white; border-radius: 6px; padding: 10px; border-left: 4px solid #ef4444; font-size: 0.85em; color: #991b1b;">
                            <b>Outcome:</b> Missed connection, stranded passenger, punitive fee.
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            with side2:
                st.markdown(
                    f"""
                    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 18px;">
                        <h4 style="color: #15803d; margin-top: 0;">✅ OmniPass MaaS Dynamic Recovery</h4>
                        <p style="color: #14532d; font-size: 0.9em;">With Automated Dynamic Connection Protection:</p>
                        <ul style="color: #14532d; font-size: 0.9em; line-height: 1.6;">
                            <li>Delay (+{latest_result['delay_minutes']}m) instantly detected by central MaaS engine.</li>
                            <li><b>{latest_result['rescheduled_taxis_count']} Connecting Taxi(s)</b> automatically shifted.</li>
                            <li>Passenger notified immediately via in-app banner.</li>
                            <li><b>$0.00 Rebooking Fee</b> guaranteed under single multimodal pass.</li>
                            <li>Taxi awaits passenger smoothly at new estimated arrival time.</li>
                        </ul>
                        <div style="background: white; border-radius: 6px; padding: 10px; border-left: 4px solid #22c55e; font-size: 0.85em; color: #166534;">
                            <b>Outcome:</b> Seamless end-to-end journey preserved, zero penalty.
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            # Impacted passenger breakdown table
            if latest_result.get("impacted_details"):
                st.markdown("##### 👥 Rescheduled Passenger Itineraries")
                for item in latest_result["impacted_details"]:
                    taxis_info = ", ".join(f"{t['taxi_code']} (New Pickup: {t['new_pickup']})" for t in item["taxis_rescheduled"]) or "Buffer adjusted"
                    st.info(
                        f"**Passenger:** {item['passenger_name']} ({item['passenger_phone']}) | "
                        f"**Pass Ref:** `{item['booking_reference']}` | "
                        f"**Connecting Taxi:** {taxis_info}"
                    )

    # ---------------- TAB 2: Disruption Audit Logs ----------------
    with tabs[1]:
        st.markdown("#### 📜 Incident & Recovery Audit Trail")
        logs = get_active_disruptions(db)
        if logs:
            df_logs = pd.DataFrame(logs)
            st.dataframe(df_logs, use_container_width=True)
        else:
            st.info("No disruption events recorded yet. Use the simulator above to generate one!")

    # ---------------- TAB 3: User Management ----------------
    with tabs[2]:
        st.markdown("#### 👥 Registered System Users")
        users = db.query(User).all()
        user_rows = []
        for u in users:
            user_rows.append({
                "ID": u.id,
                "Name": u.name,
                "Email": u.email,
                "Role": u.role.upper(),
                "Phone": u.phone or "-",
                "Created At": u.created_at.strftime("%Y-%m-%d %H:%M"),
            })
        st.dataframe(pd.DataFrame(user_rows), use_container_width=True)

    # ---------------- TAB 4: All Bookings ----------------
    with tabs[3]:
        st.markdown("#### 📑 Cross-Modal Booking Registry")
        all_bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
        b_rows = []
        for b in all_bookings:
            u = db.query(User).filter(User.id == b.user_id).first()
            b_rows.append({
                "Ref": b.booking_reference,
                "Passenger": u.name if u else f"User #{b.user_id}",
                "Status": b.status.upper(),
                "Total Fare": f"${b.total_price:.2f}",
                "Payment": b.payment_status.upper(),
                "Reason / Notes": b.rescheduled_reason or "-",
                "Date": b.created_at.strftime("%Y-%m-%d %H:%M"),
            })
        st.dataframe(pd.DataFrame(b_rows), use_container_width=True)

    # ---------------- TAB 5: System Maintenance ----------------
    with tabs[4]:
        st.markdown("#### 🔄 Prototype Environment Reset")
        st.write("Reset database to initial pristine seed data (resets all delays, bookings, and timestamps).")
        if st.button("⚠️ Reset Entire Database to Fresh Seed Data", type="secondary"):
            reset_db()
            st.session_state.clear()
            st.success("✅ Database successfully wiped and re-seeded with pristine multimodal timetable!")
            st.rerun()

``

---

## File: app/views/operator_ui.py

``python
"""Transport Operator Dashboard View.

Features:
- Fleet and schedule monitoring across Bus, Train, and Taxi legs.
- Operator delay reporting triggering Dynamic Disruption Recovery.
- Capacity, fare, and platform management.
"""

import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models import User, RouteSegment
from app.services.disruption_engine import handle_segment_delay


def render_operator_ui(db: Session, current_user: User) -> None:
    """Renders the transit operator management dashboard."""
    st.markdown(f"### 🚆 Operator Operations Hub — {current_user.name}")
    st.caption("Manage fleet timetables, report service delays, and trigger automated connection recovery.")

    tabs = st.tabs(["📊 Fleet & Route Status", "🚨 Report Operational Delay", "⚙️ Schedule & Fare Management"])

    # ---------------- TAB 1: Fleet & Route Status ----------------
    with tabs[0]:
        st.markdown("#### 📋 Active Transit Segments")

        mode_filter = st.multiselect(
            "Filter Transport Type",
            ["train", "bus", "taxi"],
            default=["train", "bus", "taxi"],
            format_func=lambda x: f"{'🚆' if x == 'train' else '🚌' if x == 'bus' else '🚕'} {x.upper()}",
        )

        query = db.query(RouteSegment)
        if mode_filter:
            query = query.filter(RouteSegment.transport_type.in_(mode_filter))
        segments = query.order_by(RouteSegment.departure_time.asc()).all()

        if segments:
            table_data = []
            for s in segments:
                table_data.append({
                    "Code": s.segment_code,
                    "Type": s.transport_type.upper(),
                    "Operator": s.operator_name,
                    "Origin ➔ Dest": f"{s.origin} ➔ {s.destination}",
                    "Departure": s.departure_time.strftime("%H:%M"),
                    "Arrival": s.arrival_time.strftime("%H:%M"),
                    "Status": s.status.upper(),
                    "Delay": f"+{s.delay_minutes}m" if s.delay_minutes > 0 else "On Time",
                    "Fare": f"${s.price:.2f}",
                    "Vehicle/Platform": s.platform_or_vehicle or "-",
                })
            df = pd.DataFrame(table_data)
            st.dataframe(df, use_container_width=True)
        else:
            st.info("No segments match the selected filter.")

    # ---------------- TAB 2: Report Operational Delay ----------------
    with tabs[1]:
        st.markdown("#### 🚨 Dispatcher Incident / Delay Notification")
        st.write("When an incident is reported, the system automatically recalculates downstream passenger journeys and reschedules connecting taxis.")

        # Filter segments that can have delays (train and bus primarily)
        reportable_segs = (
            db.query(RouteSegment)
            .filter(RouteSegment.transport_type.in_(["train", "bus"]))
            .order_by(RouteSegment.departure_time.asc())
            .all()
        )

        if not reportable_segs:
            st.warning("No train or bus segments available to report delays for.")
            return

        seg_options = {
            f"[{s.transport_type.upper()}] {s.segment_code} - {s.origin} ➔ {s.destination} ({s.departure_time.strftime('%H:%M')})": s.id
            for s in reportable_segs
        }

        selected_label = st.selectbox("Select Delayed Segment", list(seg_options.keys()))
        selected_seg_id = seg_options[selected_label]

        col1, col2 = st.columns(2)
        with col1:
            delay_mins = st.slider("Reported Delay (Minutes)", min_value=5, max_value=90, value=20, step=5)
        with col2:
            disruption_cause = st.selectbox(
                "Disruption Root Cause",
                [
                    "Track Maintenance & Signal Issue",
                    "Mechanical Locomotive Fault",
                    "Severe Weather / Heavy Rain",
                    "Traffic Congestion on Expressway",
                    "Medical Emergency Onboard",
                    "Infrastructure Power Outage",
                ],
            )

        additional_notes = st.text_input("Incident Log Notes", value="Operator field dispatch report")

        if st.button("🚀 Submit Delay & Trigger Auto-Recovery", type="primary"):
            full_reason = f"{disruption_cause} ({additional_notes})"
            with st.spinner("Processing disruption and updating passenger connections..."):
                result = handle_segment_delay(
                    db=db,
                    segment_id=selected_seg_id,
                    delay_minutes=delay_mins,
                    reason=full_reason,
                )

            if result["success"]:
                st.success(f"✅ {result['message']}")
                if result["rescheduled_taxis_count"] > 0:
                    st.info(f"🚕 {result['rescheduled_taxis_count']} connecting taxi pickup(s) successfully rescheduled without penalty fees.")
                st.rerun()
            else:
                st.error(f"❌ Failed to process delay: {result['message']}")

    # ---------------- TAB 3: Schedule & Fare Management ----------------
    with tabs[2]:
        st.markdown("#### ⚙️ Quick Segment Capacity & Fare Adjuster")
        all_segs = db.query(RouteSegment).order_by(RouteSegment.segment_code.asc()).all()
        seg_edit_opts = {f"{s.segment_code} ({s.transport_type.upper()}: {s.origin} ➔ {s.destination})": s.id for s in all_segs}

        edit_choice = st.selectbox("Select Segment to Update", list(seg_edit_opts.keys()), key="op_edit_seg")
        target_seg = db.query(RouteSegment).filter(RouteSegment.id == seg_edit_opts[edit_choice]).first()

        if target_seg:
            c1, c2, c3 = st.columns(3)
            with c1:
                new_price = st.number_input("Ticket Fare ($)", min_value=0.50, max_value=200.0, value=float(target_seg.price), step=0.50)
            with c2:
                new_cap = st.number_input("Passenger Capacity", min_value=1, max_value=500, value=int(target_seg.capacity), step=5)
            with c3:
                new_platform = st.text_input("Platform / Bay / Vehicle", value=target_seg.platform_or_vehicle or "")

            if st.button("💾 Save Segment Updates"):
                target_seg.price = new_price
                target_seg.capacity = new_cap
                target_seg.platform_or_vehicle = new_platform
                db.commit()
                st.success(f"Updated {target_seg.segment_code} details.")
                st.rerun()

``

---

## File: app/views/passenger_ui.py

``python
"""Passenger View Component.

Features:
- Multimodal journey search across Bus, Train, and Taxi.
- Unified single ticket purchase with mock payment gateway.
- Digital Single Journey Pass with dynamic QR code.
- Real-time Dynamic Disruption Recovery alerts and rescheduled taxi indicators.
"""

import streamlit as st
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import User, Booking, RouteSegment
from app.services.routing_engine import (
    get_all_locations,
    find_multimodal_routes,
    create_passenger_booking,
)
from app.services.qr_generator import generate_qr_code_image


def render_passenger_ui(db: Session, current_user: User) -> None:
    """Renders the comprehensive passenger mobility dashboard."""
    st.markdown(f"### 🧳 Welcome, {current_user.name}")
    st.caption("Plan, book, and manage your multimodal journeys with guaranteed dynamic connection protection.")

    tabs = st.tabs(["🔍 Search & Book Multimodal Trip", "🎟️ My Passes & Live Journey Protection", "💳 Mock Payment Portal"])

    # ---------------- TAB 1: Search & Book ----------------
    with tabs[0]:
        st.markdown("#### 🗺️ Multimodal Journey Planner")
        locations = get_all_locations(db)

        col1, col2, col3 = st.columns([2, 2, 1])
        with col1:
            default_origin_idx = 0
            for idx, loc in enumerate(locations):
                if "suburbia" in loc.lower():
                    default_origin_idx = idx
                    break
            origin = st.selectbox("Origin", locations, index=default_origin_idx, key="p_origin")

        with col2:
            default_dest_idx = min(1, len(locations) - 1)
            for idx, loc in enumerate(locations):
                if "tech park" in loc.lower() or "convention" in loc.lower():
                    default_dest_idx = idx
                    break
            destination = st.selectbox("Destination", locations, index=default_dest_idx, key="p_destination")

        with col3:
            include_taxi = st.checkbox("Include On-Demand Taxi", value=True, help="Include last-mile taxi feeder connections")

        if origin == destination:
            st.warning("⚠️ Origin and destination cannot be identical. Please select different stations.")
            return

        journeys = find_multimodal_routes(db, origin, destination, allow_taxi_feeder=include_taxi)

        st.markdown(f"**Found {len(journeys)} multimodal route options:**")

        if not journeys:
            st.info("No connected routes found between these locations. Try selecting 'Suburbia Green Heights' to 'Innovation Tech Park'.")
            if st.button("💡 Load Recommended Commute Route"):
                st.session_state["p_origin"] = "Suburbia Green Heights"
                st.session_state["p_destination"] = "Innovation Tech Park"
                st.rerun()

        for idx, journey in enumerate(journeys):
            with st.container():
                st.markdown(
                    f"""
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; color: #1e3a8a;">Option {idx + 1}: {journey['modes_summary']}</h4>
                            <span style="font-size: 1.3em; font-weight: bold; color: #047857;">${journey['total_price']:.2f}</span>
                        </div>
                        <p style="margin: 8px 0; color: #475569;">
                            ⏱️ <strong>{journey['departure_str']} ➔ {journey['arrival_str']}</strong> ({journey['total_duration_minutes']} mins total) 
                            • 🔀 Transfers: {journey['transfers_count']}
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                # Segment timeline breakdown
                cols = st.columns(len(journey["segments"]))
                for s_idx, seg in enumerate(journey["segments"]):
                    with cols[s_idx]:
                        badge_color = {
                            "bus": "#3b82f6",
                            "train": "#8b5cf6",
                            "taxi": "#f59e0b",
                        }.get(seg["transport_type"].lower(), "#64748b")

                        st.markdown(
                            f"""
                            <div style="background: white; border-top: 4px solid {badge_color}; border-radius: 6px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-size: 0.85em;">
                                <strong>{seg['transport_type'].upper()}: {seg['segment_code']}</strong><br/>
                                <span style="color:#64748b;">{seg['operator_name']}</span><br/>
                                📍 <b>{seg['origin']}</b> ({seg['departure_str']})<br/>
                                ➔ <b>{seg['destination']}</b> ({seg['arrival_str']})<br/>
                                🏷️ {seg['platform_or_vehicle']}<br/>
                                💵 ${seg['price']:.2f}
                            </div>
                            """,
                            unsafe_allow_html=True,
                        )
                        if seg["transfer_buffer_minutes"] > 0:
                            st.caption(f"⏳ {seg['transfer_buffer_minutes']}m buffer before next leg")

                book_col1, book_col2 = st.columns([3, 1])
                with book_col2:
                    if st.button(f"⚡ One-Click Book (${journey['total_price']:.2f})", key=f"book_btn_{idx}"):
                        new_booking = create_passenger_booking(
                            db=db,
                            user_id=current_user.id,
                            segment_ids=journey["segment_ids"],
                        )
                        st.success(f"🎉 Trip booked successfully! Reference: **{new_booking.booking_reference}**")
                        st.session_state["just_booked_ref"] = new_booking.booking_reference
                        st.rerun()

                st.divider()

    # ---------------- TAB 2: My Passes & Live Journey Protection ----------------
    with tabs[1]:
        st.markdown("#### 🎫 My Active Digital Passes & Protected Journeys")
        user_bookings = (
            db.query(Booking)
            .filter(Booking.user_id == current_user.id)
            .order_by(Booking.created_at.desc())
            .all()
        )

        if not user_bookings:
            st.info("You don't have any bookings yet. Search and book a journey above!")
            return

        for booking in user_bookings:
            seg_ids = booking.segment_ids
            segments = db.query(RouteSegment).filter(RouteSegment.id.in_(seg_ids)).all()
            seg_map = {s.id: s for s in segments}
            ordered_segs = [seg_map[sid] for sid in seg_ids if sid in seg_map]

            is_rescheduled = booking.status == "rescheduled"
            status_color = "#f59e0b" if is_rescheduled else "#10b981"
            border_color = "#f59e0b" if is_rescheduled else "#2563eb"

            # Dynamic Disruption Alert Box
            if is_rescheduled:
                st.markdown(
                    f"""
                    <div style="background-color: #fffbeb; border-left: 6px solid #f59e0b; padding: 14px; border-radius: 6px; margin-bottom: 12px;">
                        <h4 style="color: #b45309; margin: 0;">⚡ Dynamic Disruption Recovery Active</h4>
                        <p style="margin: 6px 0 0 0; color: #92400e; font-size: 0.95em;">
                            {booking.rescheduled_reason or 'Your connecting schedule was adjusted automatically with $0 penalty fee.'}
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            # Ticket Card container
            with st.container():
                st.markdown(
                    f"""
                    <div style="border: 2px solid {border_color}; border-radius: 12px; padding: 18px; background: white; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px;">
                            <div>
                                <span style="font-size: 1.1em; font-weight: bold; color: #1e293b;">Universal Single Journey Pass</span><br/>
                                <span style="font-family: monospace; color: #64748b;">REF: {booking.booking_reference}</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="background-color: {status_color}; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.85em; text-transform: uppercase;">
                                    {booking.status}
                                </span><br/>
                                <small style="color: #64748b;">Paid: ${booking.total_price:.2f}</small>
                            </div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                ticket_left, ticket_right = st.columns([2, 1])

                with ticket_left:
                    st.markdown("##### 📍 Itinerary Timeline")
                    for s in ordered_segs:
                        delay_text = f" <span style='color: #dc2626; font-weight: bold;'>(+{s.delay_minutes}m delay)</span>" if s.delay_minutes > 0 else ""
                        icon = "🚌" if s.transport_type == "bus" else "🚆" if s.transport_type == "train" else "🚕"
                        st.markdown(
                            f"""
                            - **{icon} {s.transport_type.upper()}: {s.segment_code}** ({s.operator_name})
                              - **Departure:** {s.departure_time.strftime('%H:%M')} from *{s.origin}*
                              - **Arrival:** {s.arrival_time.strftime('%H:%M')} at *{s.destination}*{delay_text}
                              - **Vehicle / Bay:** `{s.platform_or_vehicle}`
                            """,
                            unsafe_allow_html=True,
                        )

                with ticket_right:
                    st.markdown("##### 📱 Digital QR Pass")
                    qr_img_data = generate_qr_code_image(booking.qr_code_str or booking.booking_reference)
                    st.markdown(
                        f"""
                        <div style="text-align: center;">
                            <img src="{qr_img_data}" width="160" style="border-radius: 8px; border: 1px solid #cbd5e1; padding: 4px;"/>
                            <div style="font-size: 0.75em; color: #64748b; margin-top: 4px;">Scan at bus/train gates & taxi pickup</div>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

                st.divider()

    # ---------------- TAB 3: Mock Payment Portal ----------------
    with tabs[2]:
        st.markdown("#### 💳 Simulated Mock Payment Gateway")
        st.write("Demonstration of the frictionless unified single checkout for multimodal journeys.")
        pcol1, pcol2 = st.columns(2)
        with pcol1:
            st.text_input("Cardholder Name", value=current_user.name, disabled=True)
            st.text_input("Card Number", value="•••• •••• •••• 4242", disabled=True)
        with pcol2:
            st.text_input("Expiry", value="12/28", disabled=True)
            st.text_input("CVV", value="•••", disabled=True)

        st.success("✅ Payment Gateway connected: Mock Instant Settlement Mode (Active)")

``

---

## File: app/views/__init__.py

``python
"""UI Views and components package for Passenger, Operator, and Admin roles."""

``

---

## File: data/seed_data.json

``json
{
  "users": [
    {
      "name": "Alice Smith",
      "email": "alice@example.com",
      "role": "passenger",
      "phone": "+1-555-0101"
    },
    {
      "name": "Bob Jones",
      "email": "bob@example.com",
      "role": "passenger",
      "phone": "+1-555-0102"
    },
    {
      "name": "Elena Rostova",
      "email": "elena@example.com",
      "role": "passenger",
      "phone": "+1-555-0103"
    },
    {
      "name": "Metro Transit Dispatcher",
      "email": "operator@metro.org",
      "role": "operator",
      "phone": "+1-555-0200"
    },
    {
      "name": "SwiftCab Fleet Dispatch",
      "email": "dispatch@swiftcab.com",
      "role": "operator",
      "phone": "+1-555-0201"
    },
    {
      "name": "Admin Support Specialist",
      "email": "admin@maas.gov",
      "role": "admin",
      "phone": "+1-555-0300"
    }
  ],
  "route_segments": [
    {
      "segment_code": "BUS-42",
      "transport_type": "bus",
      "operator_name": "City MetroBus",
      "origin": "Suburbia Green Heights",
      "destination": "Metro Central Station",
      "dep_offset_minutes": 0,
      "duration_minutes": 30,
      "price": 3.50,
      "capacity": 40,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 4"
    },
    {
      "segment_code": "TRN-101",
      "transport_type": "train",
      "operator_name": "MetroRail Rapid Express",
      "origin": "Metro Central Station",
      "destination": "Grand Financial Terminal",
      "dep_offset_minutes": 40,
      "duration_minutes": 35,
      "price": 12.00,
      "capacity": 220,
      "status": "scheduled",
      "platform_or_vehicle": "Platform 2B"
    },
    {
      "segment_code": "TXI-88",
      "transport_type": "taxi",
      "operator_name": "SwiftCab On-Demand",
      "origin": "Grand Financial Terminal",
      "destination": "Innovation Tech Park",
      "dep_offset_minutes": 85,
      "duration_minutes": 25,
      "price": 18.50,
      "capacity": 4,
      "status": "scheduled",
      "platform_or_vehicle": "Toyota Camry #88 (Driver: Carlos M.)"
    },
    {
      "segment_code": "BUS-15",
      "transport_type": "bus",
      "operator_name": "Northside Shuttle",
      "origin": "Northwood Commons",
      "destination": "Metro Central Station",
      "dep_offset_minutes": 10,
      "duration_minutes": 25,
      "price": 2.75,
      "capacity": 35,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 1"
    },
    {
      "segment_code": "TRN-204",
      "transport_type": "train",
      "operator_name": "InterCity Coastal Rail",
      "origin": "Metro Central Station",
      "destination": "Airport Intermodal Hub",
      "dep_offset_minutes": 45,
      "duration_minutes": 40,
      "price": 15.00,
      "capacity": 180,
      "status": "scheduled",
      "platform_or_vehicle": "Platform 5A"
    },
    {
      "segment_code": "TXI-14",
      "transport_type": "taxi",
      "operator_name": "SwiftCab EcoFleet",
      "origin": "Airport Intermodal Hub",
      "destination": "Seaside Convention Center",
      "dep_offset_minutes": 95,
      "duration_minutes": 20,
      "price": 16.00,
      "capacity": 4,
      "status": "scheduled",
      "platform_or_vehicle": "Hyundai Ioniq #14 (Driver: Sarah K.)"
    },
    {
      "segment_code": "BUS-99",
      "transport_type": "bus",
      "operator_name": "City MetroBus",
      "origin": "Grand Financial Terminal",
      "destination": "Innovation Tech Park",
      "dep_offset_minutes": 90,
      "duration_minutes": 35,
      "price": 3.00,
      "capacity": 45,
      "status": "scheduled",
      "platform_or_vehicle": "Bay 8"
    }
  ],
  "sample_bookings": [
    {
      "booking_reference": "MAAS-2026-X892",
      "user_email": "alice@example.com",
      "segment_codes": ["BUS-42", "TRN-101", "TXI-88"],
      "status": "confirmed",
      "payment_status": "paid"
    },
    {
      "booking_reference": "MAAS-2026-T404",
      "user_email": "bob@example.com",
      "segment_codes": ["TRN-101", "TXI-88"],
      "status": "confirmed",
      "payment_status": "paid"
    },
    {
      "booking_reference": "MAAS-2026-A109",
      "user_email": "elena@example.com",
      "segment_codes": ["BUS-15", "TRN-204", "TXI-14"],
      "status": "confirmed",
      "payment_status": "paid"
    }
  ]
}

``

---

## File: tests/test_disruption.py

``python
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

``

---

## File: tests/.pytest_cache/.gitignore

``
# Created by pytest automatically.
*

``

---

## File: tests/.pytest_cache/CACHEDIR.TAG

``
Signature: 8a477f597d28d172789f06886806bc55
# This file is a cache directory tag created by pytest.
# For information about cache directory tags, see:
#	https://bford.info/cachedir/spec.html

``

---

## File: tests/.pytest_cache/README.md

``markdown
# pytest cache directory #

This directory contains data from the pytest's cache plugin,
which provides the `--lf` and `--ff` options, as well as the `cache` fixture.

**Do not** commit this to version control.

See [the docs](https://docs.pytest.org/en/stable/how-to/cache.html) for more information.

``

---

## File: tests/.pytest_cache/v/cache/nodeids

``
[
  "test_disruption.py::test_handle_segment_delay_invalid_inputs",
  "test_disruption.py::test_handle_segment_delay_recovers_taxi_connection",
  "test_disruption.py::test_multimodal_routing_engine"
]
``

---
