
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(
    page_title="Blue Carbon Intelligence",
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================================================
# BLUE CARBON INTELLIGENCE
# PROFESSIONAL GLOBAL OVERVIEW — V3
#
# Design principles:
#   - Facts over scores
#   - Decision-first navigation
#   - Clear status language
#   - Timely intelligence
#   - Country intelligence accessible from anywhere
#   - Scalable architecture
#
# IMPORTANT:
# The geographic map uses real country boundaries from Plotly's
# Natural Earth geometry. The example status dataset is clearly
# labelled illustrative until connected to the verified database.
# ============================================================

# -------------------- DESIGN TOKENS --------------------
NAVY = "#0B3150"
NAVY_2 = "#123F61"
BLUE = "#2478A6"
TEAL = "#12999B"
GREEN = "#3F9162"
GREEN_LIGHT = "#E5F2E9"
BLUE_LIGHT = "#EAF4F8"
TEAL_LIGHT = "#E7F5F5"
AMBER = "#D28A2E"
AMBER_LIGHT = "#FFF1DC"
RED = "#B95353"
RED_LIGHT = "#F9E8E8"
INK = "#1F3545"
MUTED = "#6E7F8A"
BG = "#F4F7F8"
CARD = "#FFFFFF"
LINE = "#DCE5E9"

st.markdown(
    f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@500;600&display=swap');

:root {{
  --navy:{NAVY};
  --blue:{BLUE};
  --teal:{TEAL};
  --green:{GREEN};
  --ink:{INK};
  --muted:{MUTED};
  --bg:{BG};
  --line:{LINE};
}}

html, body, [class*="css"] {{
    font-family:'DM Sans',Arial,sans-serif;
    color:var(--ink);
}}
.stApp {{ background:var(--bg); }}
.block-container {{
    max-width:1540px;
    padding:0 1.15rem 2rem;
}}

[data-testid="stSidebar"] {{
    background:#082A45;
    min-width:236px;
    max-width:236px;
}}
[data-testid="stSidebar"] * {{ color:#F2F7FA !important; }}
[data-testid="stSidebar"] .stRadio label {{
    border-radius:7px;
    padding:7px 9px !important;
    font-size:.78rem;
}}
[data-testid="stSidebar"] .stRadio label:hover {{
    background:rgba(255,255,255,.07);
}}

.topbar {{
    height:68px;
    margin:0 -1.15rem 1.05rem;
    padding:0 1.35rem;
    background:var(--navy);
    color:white;
    display:flex;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid rgba(255,255,255,.08);
}}
.brand-wrap {{ display:flex;align-items:center;gap:11px; }}
.brand-icon {{
    width:37px;height:37px;border-radius:50%;
    border:1px solid rgba(255,255,255,.35);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
    background:#12496A;
}}
.brand {{
    font-size:17px;font-weight:700;letter-spacing:-.03em;
}}
.brand-small {{
    font-size:8px;letter-spacing:.16em;text-transform:uppercase;
    color:#A9C6D6;margin-top:1px;
}}
.product-title {{
    position:absolute;
    left:250px;
    font-size:1.35rem;
    font-weight:600;
}}
.product-sub {{
    font-size:.67rem;color:#BCD0DB;font-weight:400;margin-top:2px;
}}
.top-controls {{ display:flex;align-items:center;gap:8px; }}
.top-control {{
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.04);
    color:white;border-radius:7px;
    padding:8px 11px;font-size:.68rem;
}}
.top-control.accent {{
    background:#138C9D;border-color:#138C9D;font-weight:700;
}}

.hero {{
    background:
      radial-gradient(circle at 88% 20%,rgba(51,144,170,.26),transparent 27%),
      linear-gradient(115deg,#082A45 0%,#0B3150 58%,#12516B 100%);
    border-radius:13px;
    color:white;
    padding:27px 30px;
    min-height:218px;
    position:relative;
    overflow:hidden;
}}
.hero:after {{
    content:"";
    position:absolute;
    right:-105px;top:-170px;
    width:370px;height:370px;
    border-radius:50%;
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 0 0 42px rgba(255,255,255,.015),
               0 0 0 84px rgba(255,255,255,.01);
}}
.kicker {{
    color:#A5D9D7;
    font-size:.64rem;
    letter-spacing:.13em;
    text-transform:uppercase;
    font-weight:700;
}}
.hero h1 {{
    font-family:'Playfair Display',Georgia,serif;
    font-size:2.55rem;
    line-height:1.02;
    margin:9px 0 9px;
    font-weight:500;
}}
.hero h1 em {{ color:#8FD1AA;font-style:italic; }}
.hero p {{
    max-width:610px;
    color:#D0E0E8;
    font-size:.78rem;
    line-height:1.6;
    margin:0;
}}
.hero-link {{
    display:inline-block;
    margin-top:17px;
    padding:9px 13px;
    border-radius:7px;
    background:#3F9162;
    color:white;
    font-size:.68rem;
    font-weight:700;
}}
.hero-link.alt {{
    background:transparent;
    border:1px solid rgba(255,255,255,.22);
    margin-left:6px;
}}

.hero-grid {{
    display:grid;
    grid-template-columns:1fr 1fr;
    margin:0;
    border:1px solid rgba(255,255,255,.13);
    border-radius:10px;
    overflow:hidden;
}}
.hero-stat {{
    padding:14px 15px;
    min-height:91px;
    background:rgba(255,255,255,.055);
    border-right:1px solid rgba(255,255,255,.10);
    border-bottom:1px solid rgba(255,255,255,.10);
}}
.hero-stat:nth-child(2n) {{ border-right:0; }}
.hero-stat:nth-child(3), .hero-stat:nth-child(4) {{ border-bottom:0; }}
.hero-num {{
    font-family:'Playfair Display',Georgia,serif;
    font-size:1.55rem;
}}
.hero-label {{
    text-transform:uppercase;
    letter-spacing:.06em;
    font-size:.57rem;
    color:#C1D5DF;
    margin-top:2px;
}}
.hero-note {{ font-size:.60rem;color:#8FAEBD;margin-top:5px; }}

.live {{
    background:#0C3A57;
    color:#D9E7ED;
    border-radius:7px;
    padding:7px 12px;
    margin-top:9px;
    font-size:.62rem;
}}
.live b {{ color:#8FD1AA;letter-spacing:.08em; }}

.section-title {{
    margin:18px 0 7px;
    font-size:.62rem;
    color:var(--muted);
    text-transform:uppercase;
    letter-spacing:.12em;
    font-weight:700;
}}

.card {{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:11px;
    box-shadow:0 2px 9px rgba(18,54,73,.025);
}}
.card-pad {{ padding:14px 16px; }}
.card-title {{
    font-size:.88rem;
    color:var(--navy);
    font-weight:700;
}}
.card-sub {{
    font-size:.65rem;
    color:var(--muted);
    line-height:1.45;
    margin-top:3px;
}}

.map-card {{ overflow:hidden; }}
.map-head {{
    padding:13px 15px 8px;
    display:flex;
    align-items:center;
    justify-content:space-between;
}}
.map-hint {{
    font-size:.58rem;color:var(--muted);
    border:1px solid var(--line);
    border-radius:5px;padding:4px 7px;
}}
.map-layer {{
    position:absolute;
    z-index:10;
    margin:14px 0 0 14px;
    background:rgba(255,255,255,.97);
    border:1px solid var(--line);
    border-radius:8px;
    padding:10px 11px;
    width:176px;
    box-shadow:0 3px 12px rgba(15,48,67,.09);
}}
.layer-title {{
    color:var(--navy);font-size:.60rem;font-weight:700;
    text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;
}}
.layer-row {{
    display:flex;align-items:center;justify-content:space-between;
    padding:5px 0;font-size:.61rem;color:var(--ink);
}}
.switch {{
    width:22px;height:12px;border-radius:10px;background:#B8C8CF;
    position:relative;display:inline-block;
}}
.switch.on {{ background:#1A9A9D; }}
.switch:after {{
    content:"";position:absolute;top:2px;left:2px;width:8px;height:8px;
    background:white;border-radius:50%;
}}
.switch.on:after {{ left:12px; }}

.legend {{
    display:flex;gap:14px;justify-content:center;align-items:center;
    padding:7px 10px 11px;font-size:.58rem;color:var(--muted);
}}
.dot {{
    width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:4px;
}}
.d-green {{background:#29945E}} .d-teal {{background:#159A9C}}
.d-amber {{background:#D99036}} .d-grey {{background:#AEBAC1}}

.news-card {{ height:100%; }}
.news-tabs {{
    display:flex;gap:20px;padding:9px 14px 0;border-bottom:1px solid var(--line);
}}
.news-tab {{
    font-size:.58rem;color:var(--muted);padding-bottom:8px;
}}
.news-tab.active {{
    color:var(--navy);font-weight:700;border-bottom:2px solid var(--blue);
}}
.news-item {{
    padding:11px 14px;border-bottom:1px solid #EDF1F3;
}}
.news-item:last-child {{border-bottom:0;}}
.tag {{
    display:inline-block;padding:3px 6px;border-radius:4px;
    background:var(--blue-light);color:var(--blue);
    font-size:.55rem;font-weight:700;
}}
.news-date {{font-size:.55rem;color:var(--muted);margin-left:6px;}}
.news-head {{
    font-size:.68rem;line-height:1.4;font-weight:600;
    color:var(--ink);margin-top:5px;
}}
.news-arrow {{float:right;color:var(--blue);}}

.info-card {{
    min-height:177px;
    padding:14px 15px;
}}
.info-icon {{
    width:29px;height:29px;border-radius:7px;
    display:flex;align-items:center;justify-content:center;
    background:var(--blue-light);color:var(--blue);
    font-size:15px;
}}
.info-title {{
    margin-top:8px;color:var(--navy);
    font-weight:700;font-size:.79rem;
}}
.info-sub {{
    color:var(--muted);font-size:.61rem;line-height:1.45;
    margin-top:3px;
}}
.info-footer {{
    margin-top:12px;padding-top:9px;border-top:1px solid #EDF1F3;
    color:var(--blue);font-size:.60rem;font-weight:600;
}}
.mini-row {{
    display:flex;justify-content:space-between;align-items:center;
    padding:6px 0;border-bottom:1px solid #EEF2F4;font-size:.58rem;
}}
.mini-row:last-child {{border-bottom:0;}}
.badge {{
    padding:3px 6px;border-radius:10px;font-size:.54rem;font-weight:700;
}}
.bg {{background:{GREEN_LIGHT};color:#2D7045;}}
.bb {{background:{BLUE_LIGHT};color:#285E80;}}
.bt {{background:{TEAL_LIGHT};color:#137477;}}
.ba {{background:{AMBER_LIGHT};color:#8D5D1E;}}
.br {{background:{RED_LIGHT};color:#9A4141;}}

.quick-card {{
    border:1px solid var(--line);background:white;border-radius:9px;
    padding:10px 11px;min-height:66px;
}}
.quick-icon {{
    float:left;width:29px;height:29px;border-radius:7px;
    background:#EDF5F8;display:flex;align-items:center;
    justify-content:center;margin-right:8px;color:var(--blue);
}}
.quick-title {{font-size:.62rem;color:var(--navy);font-weight:700;padding-top:1px;}}
.quick-sub {{font-size:.54rem;color:var(--muted);margin-top:2px;}}

.footer {{
    text-align:center;color:#7A8992;font-size:.56rem;margin-top:16px;
}}
</style>
""",
    unsafe_allow_html=True,
)

# -------------------- ILLUSTRATIVE DATA --------------------
# Country boundaries are real Natural Earth geometries rendered by Plotly.
# Status values below are placeholders for the eventual verified dataset.
country_status = pd.DataFrame([
    ["IDN","Indonesia",7],
    ["VNM","Viet Nam",5],
    ["PHL","Philippines",5],
    ["KEN","Kenya",5],
    ["KOR","Republic of Korea",7],
    ["JPN","Japan",7],
    ["AUS","Australia",5],
    ["BRA","Brazil",4],
    ["MEX","Mexico",4],
    ["CRI","Costa Rica",4],
    ["CHL","Chile",4],
], columns=["iso","Country","conditions"])

news = [
    ("POLICY","14 NOV 2025","Indonesia submits Second NDC ahead of COP30 with new blue carbon targets"),
    ("REGULATION","12 NOV 2025","PR 110/2025 enacted to strengthen the carbon economic value framework"),
    ("AGREEMENT","10 NOV 2025","Indonesia–Singapore Article 6 implementation arrangement signed"),
    ("MARKET","07 NOV 2025","Voluntary carbon market shows signs of stabilization in Q4 2025"),
]

# -------------------- TOP HEADER --------------------
st.markdown("""
<div class="topbar">
  <div class="brand-wrap">
    <div class="brand-icon">≈</div>
    <div>
      <div class="brand">BLUE CARBON</div>
      <div class="brand-small">INTELLIGENCE</div>
    </div>
  </div>
  <div class="product-title">
    Global Market Intelligence
    <div class="product-sub">Real-time intelligence for Article 6 and blue carbon markets</div>
  </div>
  <div class="top-controls">
    <div class="top-control">⌕ &nbsp; Search countries, projects, news...</div>
    <div class="top-control">◎ &nbsp; EN ▾</div>
    <div class="top-control accent">COUNTRY VIEW →</div>
  </div>
</div>
""", unsafe_allow_html=True)

# -------------------- SIDEBAR --------------------
with st.sidebar:
    st.markdown("""
    <div style="padding:3px 2px 10px">
      <div style="font-size:16px;font-weight:700">BLUE CARBON</div>
      <div style="font-size:8px;letter-spacing:.16em;color:#A9C5D5">INTELLIGENCE PLATFORM</div>
    </div>
    """, unsafe_allow_html=True)
    st.divider()

    st.markdown("<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>GLOBAL INTELLIGENCE</div>", unsafe_allow_html=True)
    pages = [
        "Global Overview",
        "Global Enabling Conditions Map",
        "Article 6 & Policy",
        "Carbon Markets",
        "Methodologies",
        "Projects",
        "News & Intelligence",
        "Marine Spatial Planning",
    ]
    current = st.session_state.get("page", "Global Overview")
    selected = st.radio("Navigation", pages, index=pages.index(current))
    st.session_state.page = selected

    st.divider()
    st.markdown("<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>RESOURCES</div>", unsafe_allow_html=True)
    for item in ["Documents Library","Data & Reports","Glossary"]:
        st.caption(item)

    st.divider()
    st.markdown("""
    <div style="font-size:.58rem;color:#AFC6D3;line-height:1.5">
      PLATFORM STATUS<br>
      <span style="color:#8FD1AA">●</span> Data architecture active<br>
      <span style="color:#8FD1AA">●</span> Global framework
    </div>
    """, unsafe_allow_html=True)

page = st.session_state.page

# ============================================================
# GLOBAL OVERVIEW
# ============================================================
if page == "Global Overview":

    # HERO
    left, right = st.columns([1.04, .96], gap="large")

    with left:
        st.markdown("""
        <div class="hero">
          <div class="kicker">ARTICLE 6 · ITMO · BLUE CARBON MARKETS</div>
          <h1>Blue carbon<br><em>market intelligence</em></h1>
          <p>
            A single view of the policy, market, project and ecosystem conditions
            shaping blue carbon transactions under Article 6.
          </p>
          <span class="hero-link">Explore the map →</span>
          <span class="hero-link alt">Country intelligence →</span>
        </div>
        """, unsafe_allow_html=True)

    with right:
        st.markdown("""
        <div class="hero" style="padding:16px">
          <div class="hero-grid">
            <div class="hero-stat">
              <div class="hero-num">127</div>
              <div class="hero-label">Countries with DNA appointed</div>
              <div class="hero-note">of 193 UNFCCC Parties tracked</div>
            </div>
            <div class="hero-stat">
              <div class="hero-num">53</div>
              <div class="hero-label">Article 6 frameworks</div>
              <div class="hero-note">Operational / adopted</div>
            </div>
            <div class="hero-stat">
              <div class="hero-num">28</div>
              <div class="hero-label">Bilateral agreements</div>
              <div class="hero-note">Signed cooperation arrangements</div>
            </div>
            <div class="hero-stat">
              <div class="hero-num">36</div>
              <div class="hero-label">Blue carbon in NDCs</div>
              <div class="hero-note">Current submissions tracked</div>
            </div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div class="live">
      <b>● LIVE INTELLIGENCE</b>
      &nbsp;&nbsp; Latest policy · market · project · regulatory · agreement updates
    </div>
    """, unsafe_allow_html=True)

    # MAP + NEWS
    st.markdown("<div class='section-title'>Global enabling conditions</div>", unsafe_allow_html=True)
    map_col, news_col = st.columns([1.72, .82], gap="medium")

    with map_col:
        st.markdown("""
        <div class="card map-card">
          <div class="map-head">
            <div>
              <div class="card-title">Global Enabling Conditions Map</div>
              <div class="card-sub">Select an indicator to see where the conditions for blue carbon transactions exist.</div>
            </div>
            <div class="map-hint">Click a country for Country Intelligence →</div>
          </div>
        </div>
        """, unsafe_allow_html=True)

        # Map-layer panel
        st.markdown("""
        <div class="map-layer">
          <div class="layer-title">Map layers</div>
          <div class="layer-row">DNA appointed <span class="switch on"></span></div>
          <div class="layer-row">Article 6 framework <span class="switch on"></span></div>
          <div class="layer-row">Domestic carbon market <span class="switch on"></span></div>
          <div class="layer-row">Bilateral agreements <span class="switch on"></span></div>
          <div class="layer-row">Blue carbon in NDCs <span class="switch on"></span></div>
          <div class="layer-row">Article 6 authorizations <span class="switch on"></span></div>
          <div class="layer-row">ITMOs issued <span class="switch"></span></div>
          <div class="layer-row">Active blue carbon projects <span class="switch on"></span></div>
        </div>
        """, unsafe_allow_html=True)

        fig = px.choropleth(
            country_status,
            locations="iso",
            color="conditions",
            hover_name="Country",
            hover_data={"iso":False, "conditions":False},
            color_continuous_scale=[
                [0.00, "#E7EEF2"],
                [0.25, "#C8E5D3"],
                [0.55, "#75B987"],
                [0.80, "#3F9162"],
                [1.00, "#16764F"],
            ],
        )
        fig.update_geos(
            showframe=False,
            showcoastlines=True,
            coastlinecolor="#D7E2E6",
            bgcolor="#EAF4F8",
            landcolor="#F5F8F9",
            projection_type="natural earth",
        )
        fig.update_layout(
            height=395,
            margin=dict(l=0,r=0,t=0,b=0),
            paper_bgcolor="#FFFFFF",
            plot_bgcolor="#EAF4F8",
            coloraxis_showscale=False,
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar":False})

        st.markdown("""
        <div class="legend">
          <span><i class="dot d-green"></i>Implemented</span>
          <span><i class="dot d-teal"></i>In Development</span>
          <span><i class="dot d-amber"></i>Planned</span>
          <span><i class="dot d-grey"></i>Not Available</span>
          <span style="margin-left:8px">Map data status: illustrative prototype</span>
        </div>
        """, unsafe_allow_html=True)

    with news_col:
        st.markdown("""
        <div class="card news-card">
          <div class="card-pad" style="padding-bottom:7px">
            <div class="card-title">Latest Intelligence <span style="float:right;color:#2478A6;font-size:.60rem">View all →</span></div>
            <div class="card-sub">The latest developments affecting blue carbon markets.</div>
          </div>
          <div class="news-tabs">
            <div class="news-tab active">LATEST</div>
            <div class="news-tab">REGULATION</div>
            <div class="news-tab">PROJECTS</div>
            <div class="news-tab">AGREEMENTS</div>
          </div>
        """, unsafe_allow_html=True)

        for tag, date, headline in news:
            st.markdown(f"""
            <div class="news-item">
              <span class="tag">{tag}</span><span class="news-date">{date}</span>
              <div class="news-head">{headline}<span class="news-arrow">→</span></div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    # FOUR WINDOWS
    st.markdown("<div class='section-title'>Explore the intelligence</div>", unsafe_allow_html=True)

    windows = [
        ("📜","Article 6 & Policy",
         "Frameworks, NDCs, bilateral agreements and authorization pathways.",
         [("Article 6 frameworks","53","bg"),("Bilateral agreements","28","bt")],
         "Article 6 & Policy"),
        ("🌿","Blue Carbon Methodologies",
         "Recognized methodologies, ecosystem coverage and Article 6 / CORSIA applicability.",
         [("Recognized methods","12","bg"),("In review","4","ba")],
         "Methodologies"),
        ("📂","Projects",
         "Real project activity, transaction stage, blockers and next actions.",
         [("Projects tracked","186","bb"),("Hard blockers","17","br")],
         "Projects"),
        ("💰","Carbon Markets",
         "Domestic markets, Article 6 activity and market infrastructure.",
         [("Domestic markets","41","bt"),("Operational / developing","32","bg")],
         "Carbon Markets"),
    ]

    cols = st.columns(4)
    for col, (icon,title,desc,rows,target) in zip(cols,windows):
        with col:
            st.markdown(f"""
            <div class="card info-card">
              <div class="info-icon">{icon}</div>
              <div class="info-title">{title}</div>
              <div class="info-sub">{desc}</div>
            """, unsafe_allow_html=True)
            for label,value,klass in rows:
                st.markdown(
                    f"<div class='mini-row'><span>{label}</span><span class='badge {klass}'>{value}</span></div>",
                    unsafe_allow_html=True,
                )
            st.markdown(
                "<div class='info-footer'>Open explorer →</div></div>",
                unsafe_allow_html=True,
            )
            if st.button("Open", key=f"window_{target}", use_container_width=True):
                st.session_state.page = target
                st.rerun()

    # NDC / AGREEMENTS / MARKET SIGNALS
    st.markdown("<div class='section-title'>Current blue carbon market signals</div>", unsafe_allow_html=True)
    a,b,c = st.columns(3)

    with a:
        st.markdown("""
        <div class="card card-pad">
          <div class="card-title">Blue carbon in NDCs</div>
          <div class="card-sub">Coastal and marine ecosystem commitments</div>
          <div style="display:flex;justify-content:space-between;align-items:end;margin-top:12px">
            <div><div style="font-size:1.55rem;font-weight:700;color:#0B3150">36</div><div class="card-sub">countries identified</div></div>
            <div style="text-align:right"><span class="badge bg">24 unconditional</span><br><span class="badge bb">conditional / mixed</span></div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    with b:
        st.markdown("""
        <div class="card card-pad">
          <div class="card-title">Article 6 cooperation</div>
          <div class="card-sub">Bilateral relationships relevant to transactions</div>
          <div style="display:flex;justify-content:space-between;align-items:end;margin-top:12px">
            <div><div style="font-size:1.55rem;font-weight:700;color:#0B3150">28</div><div class="card-sub">signed arrangements</div></div>
            <div style="text-align:right"><span class="badge bt">17 buyer countries</span><br><span class="badge bg">Operational / active</span></div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    with c:
        st.markdown("""
        <div class="card card-pad">
          <div class="card-title">ITMOs issued</div>
          <div class="card-sub">Countries with identified Article 6 issuance activity</div>
          <div style="display:flex;justify-content:space-between;align-items:end;margin-top:12px">
            <div><div style="font-size:1.55rem;font-weight:700;color:#0B3150">3</div><div class="card-sub">countries to date</div></div>
            <div style="text-align:right"><span class="badge bg">Issued</span><br><span class="badge bb">Track transactions</span></div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    # QUICK ACCESS
    st.markdown("<div class='section-title'>Quick access</div>", unsafe_allow_html=True)
    quick = [
        ("🌍","Country Profiles","Country context"),
        ("📂","Project Pipeline","Find active projects"),
        ("📜","Policy & Frameworks","Laws & regulations"),
        ("🌊","Spatial Explorer","MSP & ecosystem data"),
        ("📄","Documents Library","Reports & source documents"),
        ("↓","Data Download","Access datasets"),
    ]
    cols = st.columns(6)
    for col,(icon,title,sub) in zip(cols,quick):
        with col:
            st.markdown(f"""
            <div class="quick-card">
              <div class="quick-icon">{icon}</div>
              <div class="quick-title">{title}</div>
              <div class="quick-sub">{sub}</div>
            </div>
            """, unsafe_allow_html=True)

# ============================================================
# OTHER TABS — architecture preserved
# ============================================================
else:
    titles = {
        "Global Enabling Conditions Map":"Global Enabling Conditions Map",
        "Article 6 & Policy":"Article 6 & Policy Explorer",
        "Carbon Markets":"Carbon Markets Explorer",
        "Methodologies":"Blue Carbon Methodologies Explorer",
        "Projects":"Projects Explorer",
        "News & Intelligence":"News & Intelligence Explorer",
        "Marine Spatial Planning":"Marine Spatial Planning",
    }
    st.markdown(f"""
    <div class="card card-pad" style="margin-top:15px">
      <div style="font-size:1.45rem;color:{NAVY};font-weight:700">{titles[page]}</div>
      <div class="card-sub" style="margin-top:6px">
        This page keeps the agreed platform architecture. Its detailed visual design
        will follow the same Global Overview design system.
      </div>
    </div>
    """, unsafe_allow_html=True)

st.markdown(
    "<div class='footer'>Blue Carbon Intelligence · Professional concept prototype · "
    "Illustrative status data pending integration with verified source datasets.</div>",
    unsafe_allow_html=True,
)
