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
