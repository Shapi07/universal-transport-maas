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
