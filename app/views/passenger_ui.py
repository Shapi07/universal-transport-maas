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
