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
