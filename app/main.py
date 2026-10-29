"""OmniPass MaaS - Universal Public Transport Booking System.

Visual-only MVP Prototype for the Passenger Interface using Streamlit.
"""

from datetime import date
import streamlit as st


# ==============================================================================
# 1. Page Configuration
# ==============================================================================
st.set_page_config(
    page_title="OmniPass MaaS",
    page_icon="🚆",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for polished, modern card styling
st.markdown(
    """
    <style>
    .main-header {
        background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
        padding: 24px 30px;
        border-radius: 12px;
        color: white;
        margin-bottom: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .main-header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 2.2rem;
        font-weight: 700;
    }
    .main-header p {
        color: #bfdbfe;
        margin: 6px 0 0 0;
        font-size: 1.05rem;
    }
    .ticket-card {
        background-color: #ffffff;
        border: 2px solid #2563eb;
        border-radius: 14px;
        padding: 24px;
        margin-top: 15px;
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1);
    }
    .leg-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        height: 100%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .leg-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
    }
    .badge-bus { background: #dbeafe; color: #1e40af; }
    .badge-train { background: #f3e8ff; color: #6b21a8; }
    .badge-taxi { background: #fef3c7; color: #92400e; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ==============================================================================
# 2. Sidebar Mock Login
# ==============================================================================
with st.sidebar:
    st.image(
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80",
        caption="OmniPass Mobility as a Service",
        use_container_width=True,
    )
    st.title("👤 User Profile")
    
    mock_user = st.selectbox(
        "Logged in as:",
        options=[
            "Alice Smith (Passenger)",
            "Bob Johnson (Passenger)",
            "Carlos Mendez (Driver Partner)",
            "Transit Dispatcher (Operator)",
        ],
        index=0,
    )
    
    st.caption("🟢 **Status:** Active Passenger • Verified ID")
    st.divider()

    st.markdown("### 📊 Account Overview")
    st.metric(label="Active Passes", value="1 Pass")
    st.metric(label="Saved Travel Time", value="35 mins", delta="MaaS Optimized")
    st.metric(label="Carbon Saved", value="4.8 kg CO₂", delta="Eco Friendly")
    
    st.divider()
    st.info("💡 **Prototype Mode:** This is a visual-only demonstration of the passenger booking flow.")


# ==============================================================================
# Header Banner
# ==============================================================================
st.markdown(
    """
    <div class="main-header">
        <h1>🚆 OmniPass MaaS</h1>
        <p>Universal Public Transport Booking System • Buses, Trains & Taxis in One Seamless Journey</p>
    </div>
    """,
    unsafe_allow_html=True,
)


# ==============================================================================
# 3. Main Content - Tabs
# ==============================================================================
tab1, tab2 = st.tabs(["🔍 Search & Book Route", "🎫 My Single Journey Pass"])


# ------------------------------------------------------------------------------
# TAB 1: Search & Book Route (Mockup)
# ------------------------------------------------------------------------------
with tab1:
    st.markdown("### 🗺️ Plan Your Multimodal Journey")
    st.caption("Search across all integrated transit operators and book a single ticket with guaranteed connections.")

    # Search Form Controls
    with st.container():
        col_orig, col_dest, col_date = st.columns(3)
        with col_orig:
            origin = st.selectbox(
                "Origin",
                ["Suburbia Green Heights", "Downtown Metro Station", "Westside Suburbs", "Northwood Commons"],
                index=0,
            )
        with col_dest:
            destination = st.selectbox(
                "Destination",
                ["Innovation Tech Park", "Grand Central Financial", "Airport Terminal 2", "Biopharma Campus"],
                index=0,
            )
        with col_date:
            travel_date = st.date_input("Travel Date", value=date.today())

        search_btn = st.button("🔍 Search Multimodal Route", type="primary", use_container_width=True)

    # Initialize session state for mock search and purchase
    if "search_executed" not in st.session_state:
        st.session_state["search_executed"] = False
    if "ticket_purchased" not in st.session_state:
        st.session_state["ticket_purchased"] = False

    if search_btn:
        st.session_state["search_executed"] = True

    # Display Mock Search Results
    if st.session_state["search_executed"]:
        st.divider()
        st.success("✅ **Fastest Multimodal Journey Found!** Seamless connection via Bus ➔ Train ➔ Taxi.")

        # Journey Overview Stats
        stat_c1, stat_c2, stat_c3, stat_c4 = st.columns(4)
        stat_c1.metric("Departure", "08:00 AM")
        stat_c2.metric("Arrival", "09:50 AM")
        stat_c3.metric("Total Duration", "1h 50m", delta="Zero wait penalty")
        stat_c4.metric("Single Pass Fare", "$34.00", delta="Save $8.50 vs individual")

        st.markdown("#### 📍 Journey Itinerary Breakdown")

        # 3-Leg Journey Display
        leg1, leg2, leg3 = st.columns(3)

        with leg1:
            st.markdown(
                """
                <div class="leg-card" style="border-top: 4px solid #3b82f6;">
                    <span class="leg-badge badge-bus">🚌 Leg 1: Feeder Bus</span>
                    <h4 style="margin: 4px 0 8px 0; color: #1e3a8a;">08:00 — 08:30</h4>
                    <p style="margin: 0; color: #475569; font-size: 0.9em;">
                        <strong>Route:</strong> Suburbia ➔ Central Station<br/>
                        <strong>Operator:</strong> City MetroBus (Route 42)<br/>
                        <strong>Platform:</strong> Bay 4<br/>
                        <strong>Leg Fare:</strong> $3.50
                    </p>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #cbd5e1;"/>
                    <small style="color: #059669;">⏳ 10 min connection buffer</small>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with leg2:
            st.markdown(
                """
                <div class="leg-card" style="border-top: 4px solid #8b5cf6;">
                    <span class="leg-badge badge-train">🚆 Leg 2: Express Train</span>
                    <h4 style="margin: 4px 0 8px 0; color: #581c87;">08:40 — 09:15</h4>
                    <p style="margin: 0; color: #475569; font-size: 0.9em;">
                        <strong>Route:</strong> Central ➔ Grand Terminal<br/>
                        <strong>Operator:</strong> MetroRail Rapid (Line 101)<br/>
                        <strong>Platform:</strong> Platform 2B<br/>
                        <strong>Leg Fare:</strong> $12.00
                    </p>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #cbd5e1;"/>
                    <small style="color: #059669;">⏳ 10 min connection buffer</small>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with leg3:
            st.markdown(
                """
                <div class="leg-card" style="border-top: 4px solid #f59e0b;">
                    <span class="leg-badge badge-taxi">🚕 Leg 3: On-Demand Taxi</span>
                    <h4 style="margin: 4px 0 8px 0; color: #78350f;">09:25 — 09:50</h4>
                    <p style="margin: 0; color: #475569; font-size: 0.9em;">
                        <strong>Route:</strong> Grand Terminal ➔ Tech Park<br/>
                        <strong>Operator:</strong> SwiftCab Mobility<br/>
                        <strong>Vehicle:</strong> Toyota Prius #88 (Bay A)<br/>
                        <strong>Leg Fare:</strong> $18.50
                    </p>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #cbd5e1;"/>
                    <small style="color: #2563eb;">⚡ Protected by Auto-Reschedule</small>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<br/>", unsafe_allow_html=True)
        
        # Booking Action Button
        buy_col1, buy_col2, buy_col3 = st.columns([1, 2, 1])
        with buy_col2:
            buy_btn = st.button("💳 Buy Single Pass ($34.00)", type="primary", use_container_width=True)
            if buy_btn:
                st.session_state["ticket_purchased"] = True
                st.balloons()
                st.success("🎉 **Single Pass Successfully Purchased!** Your digital ticket is ready in the **'My Single Journey Pass'** tab.")


# ------------------------------------------------------------------------------
# TAB 2: My Single Journey Pass (Mockup)
# ------------------------------------------------------------------------------
with tab2:
    st.markdown("### 🎫 Active Digital Travel Pass")
    st.caption("Your all-in-one digital pass covering all transit operators across your multimodal trip.")

    # Active Ticket Visual Card
    with st.container():
        # Top Metrics Bar
        m_col1, m_col2, m_col3 = st.columns(3)
        with m_col1:
            st.metric(
                label="Trip Status",
                value="ON TIME",
                delta="Dynamic Recovery Armed",
                delta_color="normal",
            )
        with m_col2:
            st.metric(
                label="Departure Time",
                value="08:00 AM",
                delta="Departs in 25 mins",
            )
        with m_col3:
            st.metric(
                label="Pass Reference",
                value="MAAS-2026-X892",
                delta="Single Unified Fare ($34.00)",
            )

        st.divider()

        # Visual Card Details
        ticket_left, ticket_right = st.columns([2, 1])

        with ticket_left:
            st.markdown(
                """
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; color: #1e3a8a;">Universal Mobility Pass</h4>
                        <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem;">CONFIRMED</span>
                    </div>
                    <p style="margin: 4px 0; color: #334155;"><strong>Passenger:</strong> Alice Smith</p>
                    <p style="margin: 4px 0; color: #334155;"><strong>Valid For:</strong> Today, Oct 28, 2026</p>
                    <p style="margin: 4px 0; color: #334155;"><strong>Route:</strong> Suburbia Green Heights ➔ Innovation Tech Park</p>
                    <p style="margin: 4px 0; color: #334155;"><strong>Total Fare:</strong> $34.00 (Single Mock Payment Settled)</p>
                    
                    <h5 style="margin: 16px 0 8px 0; color: #1e293b;">Protected Connections:</h5>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6;">
                        <li><strong>08:00 - 08:30:</strong> 🚌 Feeder Bus Route 42 (Bay 4)</li>
                        <li><strong>08:40 - 09:15:</strong> 🚆 MetroRail Express Line 101 (Platform 2B)</li>
                        <li><strong>09:25 - 09:50:</strong> 🚕 SwiftCab On-Demand (Toyota Prius #88)</li>
                    </ul>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with ticket_right:
            st.markdown(
                """
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px; text-align: center;">
                    <h5 style="margin: 0 0 10px 0; color: #1e3a8a;">Scan at Gates & Boarding</h5>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Generate or show an authentic QR Code placeholder image
            # Using clean official QR code generator API placeholder
            qr_url = (
                "https://api.qrserver.com/v1/create-qr-code/"
                "?size=200x200&color=1e3a8a&bgcolor=ffffff&data=OMNIPASS-ALICE-SMITH-MAAS-2026-X892"
            )
            st.image(
                qr_url,
                caption="Digital Pass: MAAS-2026-X892",
                use_container_width=True,
            )

        st.markdown("<br/>", unsafe_allow_html=True)

        # Highlighting the Dynamic Disruption Recovery Feature
        st.info(
            "⚡ **Dynamic Disruption Recovery is Active:** "
            "If your train or bus encounters any operational delay, the system will automatically "
            "recalculate downstream connections and reschedule your connecting SwiftCab taxi pickup time "
            "with **$0 rebooking penalty fees**."
        )


# ==============================================================================
# 4. Direct CLI Execution Support
# ==============================================================================
if __name__ == "__main__":
    import sys
    try:
        from streamlit.web import cli as stcli
        if not any("streamlit" in arg for arg in sys.argv):
            sys.argv = ["streamlit", "run", __file__] + sys.argv[1:]
            sys.exit(stcli.main())
    except ImportError:
        pass
