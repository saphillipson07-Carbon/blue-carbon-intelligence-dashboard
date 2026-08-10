
import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(
    page_title="Blue Carbon Intelligence",
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================================================
# BLUE CARBON INTELLIGENCE — V5
# Milestone 1:
# Global Overview -> Map -> Country Intelligence -> Projects
# ============================================================

NAVY="#0B3150"; BLUE="#2478A6"; TEAL="#12999B"; GREEN="#3F9162"
AMBER="#D28A2E"; RED="#B95353"; BG="#F4F7F8"; LINE="#DCE5E9"
INK="#1F3545"; MUTED="#6E7F8A"

DATA = Path(__file__).parent / "data"
countries = pd.read_csv(DATA / "countries.csv")
bilateral = pd.read_csv(DATA / "bilateral_agreements.csv")
projects = pd.read_csv(DATA / "projects.csv")
news = pd.read_csv(DATA / "news.csv")

status_cols = {
    "DNA appointed":"dna_appointed",
    "Article 6 framework":"article6_framework",
    "Domestic carbon market":"domestic_carbon_market",
    "Bilateral agreements":"bilateral_agreements",
    "Blue carbon in NDCs":"blue_carbon_ndc",
    "Article 6 authorizations":"article6_authorization",
    "ITMOs issued":"itmos_issued",
    "Active blue carbon projects":"active_blue_carbon_projects",
}
status_order = ["Implemented","In Development","Planned","Not Available","No Data"]

# ---------- CSS ----------
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@500;600&display=swap');
html,body,[class*="css"]{{font-family:'DM Sans',Arial,sans-serif;color:{INK};}}
.stApp{{background:{BG};}}
.block-container{{max-width:1540px;padding:0 1.15rem 2rem;}}
[data-testid="stSidebar"]{{background:#082A45;min-width:236px;max-width:236px;}}
[data-testid="stSidebar"] *{{color:#F2F7FA!important;}}
[data-testid="stSidebar"] label{{font-size:.78rem;}}
.topbar{{height:68px;margin:0 -1.15rem 1.05rem;padding:0 1.35rem;background:{NAVY};color:white;display:flex;align-items:center;gap:18px;}}
.brand{{font-weight:700;font-size:17px;letter-spacing:-.03em;}}
.brand-sub{{font-size:8px;letter-spacing:.16em;color:#A9C6D6;}}
.product{{font-size:1.28rem;font-weight:600;flex:1;}}
.product small{{display:block;font-size:.64rem;color:#BCD0DB;font-weight:400;margin-top:2px;}}
.top-control{{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);border-radius:7px;padding:8px 11px;font-size:.67rem;white-space:nowrap;}}
.top-accent{{background:#138C9D;border-color:#138C9D;font-weight:700;}}
.hero{{background:linear-gradient(115deg,#082A45,#0B3150 60%,#12516B);border-radius:13px;color:white;padding:27px 30px;min-height:218px;}}
.kicker{{color:#A5D9D7;font-size:.63rem;letter-spacing:.13em;text-transform:uppercase;font-weight:700;}}
.hero h1{{font-family:'Playfair Display',Georgia,serif;font-size:2.45rem;line-height:1.03;margin:9px 0;font-weight:500;}}
.hero h1 em{{color:#8FD1AA;}}
.hero p{{color:#D0E0E8;font-size:.78rem;line-height:1.6;max-width:600px;}}
.btn{{display:inline-block;margin-top:15px;padding:9px 13px;border-radius:7px;background:{GREEN};color:white;font-size:.68rem;font-weight:700;}}
.hero-grid{{display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(255,255,255,.13);border-radius:10px;overflow:hidden;}}
.stat{{padding:14px;background:rgba(255,255,255,.055);min-height:91px;border-right:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);}}
.stat:nth-child(2n){{border-right:0;}} .stat:nth-child(3),.stat:nth-child(4){{border-bottom:0;}}
.num{{font-family:'Playfair Display';font-size:1.55rem;}}
.lab{{font-size:.56rem;text-transform:uppercase;letter-spacing:.06em;color:#C1D5DF;}}
.note{{font-size:.59rem;color:#8FAEBD;margin-top:4px;}}
.live{{background:#0C3A57;color:#D9E7ED;border-radius:7px;padding:7px 12px;margin-top:9px;font-size:.62rem;}}
.live b{{color:#8FD1AA;letter-spacing:.08em;}}
.section{{margin:18px 0 7px;font-size:.62rem;color:{MUTED};text-transform:uppercase;letter-spacing:.12em;font-weight:700;}}
.card{{background:white;border:1px solid {LINE};border-radius:11px;box-shadow:0 2px 9px rgba(18,54,73,.025);}}
.pad{{padding:14px 16px;}}
.title{{font-size:.88rem;color:{NAVY};font-weight:700;}}
.sub{{font-size:.65rem;color:{MUTED};line-height:1.45;margin-top:3px;}}
.layer{{background:white;border:1px solid {LINE};border-radius:8px;padding:10px 11px;}}
.layer-title{{font-size:.59rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:{NAVY};}}
.layer-row{{font-size:.60rem;padding:5px 0;display:flex;justify-content:space-between;border-bottom:1px solid #EEF2F4;}}
.layer-row:last-child{{border-bottom:0;}}
.news-item{{padding:10px 14px;border-bottom:1px solid #EDF1F3;}}
.tag{{font-size:.54rem;padding:3px 6px;border-radius:4px;background:#EAF4F8;color:{BLUE};font-weight:700;}}
.date{{font-size:.54rem;color:{MUTED};margin-left:6px;}}
.headline{{font-size:.68rem;font-weight:600;line-height:1.4;margin-top:5px;}}
.badge{{padding:3px 6px;border-radius:10px;font-size:.54rem;font-weight:700;display:inline-block;}}
.good{{background:#E5F2E9;color:#2D7045;}} .dev{{background:#E7F5F5;color:#137477;}}
.plan{{background:#FFF1DC;color:#8D5D1E;}} .bad{{background:#F9E8E8;color:#9A4141;}}
.na{{background:#EEF2F4;color:#63727B;}}
.country-head{{background:white;border:1px solid {LINE};border-radius:11px;padding:18px;}}
.country-name{{font-size:1.55rem;font-weight:700;color:{NAVY};}}
.role{{font-size:.61rem;padding:4px 7px;border-radius:12px;background:#EAF4F8;color:{BLUE};font-weight:700;}}
.mini{{padding:10px;background:#F8FAFB;border:1px solid #E7EEF1;border-radius:7px;min-height:67px;}}
.mini-label{{font-size:.55rem;text-transform:uppercase;letter-spacing:.06em;color:{MUTED};}}
.mini-value{{font-size:.72rem;font-weight:700;color:{NAVY};margin-top:4px;}}
.path{{display:flex;align-items:center;gap:5px;margin-top:12px;}}
.step{{flex:1;text-align:center;font-size:.55rem;padding:8px 4px;border-radius:6px;background:#EEF2F4;color:#697A84;}}
.step.done{{background:#E5F2E9;color:#2D7045;font-weight:700;}}
.step.current{{background:#E7F5F5;color:#137477;font-weight:700;}}
.blocker{{padding:10px 12px;border-left:4px solid {RED};background:#FDF5F5;border-radius:6px;margin-top:7px;}}
.footer{{text-align:center;color:#7A8992;font-size:.55rem;margin-top:16px;}}
</style>
""", unsafe_allow_html=True)

def badge(value):
    cls = {
        "Implemented":"good","In Development":"dev","Planned":"plan",
        "Not Available":"na","No Data":"na","Active":"good"
    }.get(value,"na")
    return f"<span class='badge {cls}'>{value}</span>"

# ---------- HEADER ----------
st.markdown("""
<div class="topbar">
  <div><div class="brand">BLUE CARBON</div><div class="brand-sub">INTELLIGENCE</div></div>
  <div class="product">Global Market Intelligence
    <small>Real-time intelligence for Article 6 and blue carbon markets</small>
  </div>
  <div class="top-control">⌕ &nbsp; Search countries, projects, news...</div>
  <div class="top-control">◎ &nbsp; EN ▾</div>
  <div class="top-control top-accent">COUNTRY VIEW →</div>
</div>
""", unsafe_allow_html=True)

# ---------- SIDEBAR ----------
with st.sidebar:
    st.markdown("<div style='font-size:16px;font-weight:700'>BLUE CARBON</div><div style='font-size:8px;letter-spacing:.16em;color:#A9C5D5'>INTELLIGENCE PLATFORM</div>",unsafe_allow_html=True)
    st.divider()
    st.markdown("<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>GLOBAL INTELLIGENCE</div>",unsafe_allow_html=True)
    pages = ["Global Overview","Global Enabling Conditions Map","Article 6 & Policy","Carbon Markets","Methodologies","Projects","News & Intelligence","Marine Spatial Planning"]
    current = st.session_state.get("page","Global Overview")

    # Country Intelligence is an internal destination reached from the map/profile
    # and is intentionally NOT a new sidebar tab. The sidebar keeps the agreed
    # navigation names while allowing the internal country route to render.
    if "nav" not in st.session_state:
        st.session_state.nav = current if current in pages else "Global Overview"

    def _nav_changed():
        st.session_state.page = st.session_state.nav

    st.radio(
        "Navigation",
        pages,
        key="nav",
        on_change=_nav_changed,
    )
    st.divider()
    st.markdown("<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>RESOURCES</div>",unsafe_allow_html=True)
    for item in ["Documents Library","Data & Reports","Glossary"]:
        st.caption(item)

page = st.session_state.page
country_options = countries["country"].tolist()
selected_country = st.session_state.get("selected_country","Indonesia")

# ============================================================
# GLOBAL OVERVIEW
# ============================================================
if page == "Global Overview":

    a,b = st.columns([1.04,.96],gap="large")
    with a:
        st.markdown("""
        <div class="hero">
          <div class="kicker">ARTICLE 6 · ITMO · BLUE CARBON MARKETS</div>
          <h1>Blue carbon<br><em>market intelligence</em></h1>
          <p>A single view of the policy, market, project and ecosystem conditions shaping blue carbon transactions under Article 6.</p>
          <span class="btn">Explore the map →</span>
          <span class="btn" style="background:transparent;border:1px solid rgba(255,255,255,.23);margin-left:6px">Country intelligence →</span>
        </div>
        """,unsafe_allow_html=True)
    with b:
        st.markdown("""
        <div class="hero" style="padding:16px">
          <div class="hero-grid">
            <div class="stat"><div class="num">127</div><div class="lab">Countries with DNA appointed</div><div class="note">of 193 UNFCCC Parties tracked</div></div>
            <div class="stat"><div class="num">53</div><div class="lab">Article 6 frameworks</div><div class="note">Operational / adopted</div></div>
            <div class="stat"><div class="num">28</div><div class="lab">Bilateral agreements</div><div class="note">Signed cooperation arrangements</div></div>
            <div class="stat"><div class="num">36</div><div class="lab">Blue carbon in NDCs</div><div class="note">Current submissions tracked</div></div>
          </div>
        </div>
        """,unsafe_allow_html=True)

    st.markdown("<div class='live'><b>● LIVE INTELLIGENCE</b> &nbsp;&nbsp; Latest policy · market · project · regulatory · agreement updates</div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Global enabling conditions</div>",unsafe_allow_html=True)
    m,n = st.columns([1.72,.82],gap="medium")

    with m:
        st.markdown("<div class='card pad'><div class='title'>Global Enabling Conditions Map</div><div class='sub'>Choose an indicator, then click a country on the map to open its Country Intelligence profile.</div></div>",unsafe_allow_html=True)

        layer_name = st.selectbox("Map indicator",list(status_cols.keys()),label_visibility="collapsed")
        layer_col = status_cols[layer_name]

        mapdf = countries[["iso","country",layer_col]].copy()
        mapdf["status_code"] = mapdf[layer_col].map({s:i for i,s in enumerate(status_order)}).fillna(4)

        # Highlight currently selected country using a dedicated code.
        mapdf.loc[mapdf["country"]==selected_country,"status_code"] = -1

        fig = px.choropleth(
            mapdf,
            locations="iso",
            color="status_code",
            hover_name="country",
            custom_data=[mapdf[layer_col]],
            color_continuous_scale=[
                [0.00,"#2E8B62"],[0.20,"#2E8B62"],
                [0.21,"#159A9C"],[0.40,"#159A9C"],
                [0.41,"#D28A2E"],[0.60,"#D28A2E"],
                [0.61,"#AEB9BE"],[0.80,"#AEB9BE"],
                [0.81,"#E5EAED"],[1.00,"#E5EAED"]
            ],
            range_color=[-1,4],
        )
        fig.update_traces(
            hovertemplate="<b>%{hovertext}</b><br>"+layer_name+": %{customdata[0]}<extra></extra>",
            marker_line_width=.35,
            marker_line_color="#D7E2E6",
        )
        fig.update_geos(
            showframe=False,showcoastlines=True,coastlinecolor="#D6E1E5",
            bgcolor="#EAF4F8",landcolor="#F5F8F9",
            projection_type="natural earth"
        )
        fig.update_layout(
            height=390,margin=dict(l=0,r=0,t=0,b=0),
            coloraxis_showscale=False,paper_bgcolor="white",plot_bgcolor="#EAF4F8",
        )

        # Streamlit chart selection makes the map interactive without adding a
        # heavy third-party click-event dependency.
        event = st.plotly_chart(
            fig,
            use_container_width=True,
            config={"displayModeBar":False},
            on_select="rerun",
            selection_mode="points",
            key="global_map",
        )

        try:
            point_indices = event.selection.point_indices
            if point_indices:
                idx = int(point_indices[0])
                clicked = mapdf.iloc[idx]["country"]
                st.session_state.selected_country = clicked
                st.session_state.page = "Country Intelligence"
                st.rerun()
        except Exception:
            # Older Streamlit versions may not expose chart selection events.
            # The country selector below remains the reliable fallback.
            pass

        c1,c2 = st.columns([1,.72])
        with c1:
            chosen = st.selectbox(
                "Country fallback selector",
                country_options,
                index=country_options.index(selected_country),
                label_visibility="collapsed",
            )
            st.session_state.selected_country = chosen
        with c2:
            if st.button("Open Country Profile →",use_container_width=True):
                st.session_state.page="Country Intelligence"
                st.rerun()

        st.markdown("""
        <div style="font-size:.56rem;color:#6E7F8A;text-align:center;padding:4px">
        ● Implemented &nbsp; ● In Development &nbsp; ● Planned &nbsp; ● Not Available &nbsp; ● No Data
        <br>Geography: real country boundaries. Status records: illustrative until verified data integration.
        </div>
        """,unsafe_allow_html=True)

    with n:
        st.markdown("<div class='card' style='overflow:hidden'><div class='pad'><div class='title'>Latest Intelligence</div><div class='sub'>Policy, regulation, projects, markets and agreements.</div></div>",unsafe_allow_html=True)
        for _,r in news.iterrows():
            st.markdown(f"<div class='news-item'><span class='tag'>{r.type}</span><span class='date'>{r.date}</span><div class='headline'>{r.headline}<span style='float:right;color:{BLUE}'>→</span></div></div>",unsafe_allow_html=True)
        st.markdown("</div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Explore the intelligence</div>",unsafe_allow_html=True)
    windows=[
        ("📜","Article 6 & Policy","Frameworks, NDCs, bilateral agreements and authorization pathways.","Article 6 & Policy"),
        ("🌿","Blue Carbon Methodologies","Recognized methods, ecosystem coverage and Article 6 / CORSIA applicability.","Methodologies"),
        ("📂","Projects","Real project activity, transaction stage, blockers and next actions.","Projects"),
        ("💰","Carbon Markets","Domestic markets, Article 6 activity and market infrastructure.","Carbon Markets"),
    ]
    cols=st.columns(4)
    for col,(icon,title,desc,target) in zip(cols,windows):
        with col:
            st.markdown(f"<div class='card' style='padding:14px;min-height:135px'><div style='font-size:18px'>{icon}</div><div class='title' style='margin-top:7px'>{title}</div><div class='sub'>{desc}</div><div style='margin-top:12px;color:{BLUE};font-size:.60rem;font-weight:600'>Open explorer →</div></div>",unsafe_allow_html=True)
            if st.button("Open",key=f"open_{target}",use_container_width=True):
                st.session_state.page=target
                st.session_state.nav=target
                st.rerun()

    st.markdown("<div class='section'>Current blue carbon market signals</div>",unsafe_allow_html=True)
    cards=[
        ("Blue carbon in NDCs","36","countries identified","24 unconditional","good"),
        ("Article 6 cooperation","28","signed arrangements","17 buyer countries","dev"),
        ("ITMOs issued","3","countries to date","Track transaction activity","good"),
    ]
    cols=st.columns(3)
    for col,(title,num,label,btext,klass) in zip(cols,cards):
        with col:
            st.markdown(f"<div class='card pad'><div class='title'>{title}</div><div class='sub'>Current platform signal</div><div style='font-size:1.55rem;color:{NAVY};font-weight:700;margin-top:10px'>{num}</div><div class='sub'>{label}</div><span class='badge {klass}'>{btext}</span></div>",unsafe_allow_html=True)

# ============================================================
# COUNTRY INTELLIGENCE
# ============================================================
elif page == "Country Intelligence":

    if st.button("← Back to Global Overview", key="back_to_global"):
        st.session_state.page = "Global Overview"
        st.session_state.nav = "Global Overview"
        st.rerun()

    country = st.selectbox(
        "Country profile",
        country_options,
        index=country_options.index(selected_country),
    )
    st.session_state.selected_country = country
    row = countries[countries.country==country].iloc[0]

    st.markdown(f"""
    <div class="country-head">
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div>
          <div class="country-name">{row.country}</div>
          <div style="margin-top:6px"><span class="role">{row.market_role}</span></div>
        </div>
        <div style="font-size:.58rem;color:{MUTED};text-align:right">
          COUNTRY INTELLIGENCE<br>
          <b style="color:{NAVY}">Shared country record</b>
        </div>
      </div>
    </div>
    """,unsafe_allow_html=True)

    vals=[
        ("Article 6 framework",row.article6_framework),
        ("DNA appointed",row.dna_appointed),
        ("Domestic carbon market",row.domestic_carbon_market),
        ("Bilateral agreements",row.bilateral_agreements),
        ("Blue carbon in NDCs",row.blue_carbon_ndc),
        ("Article 6 authorization",row.article6_authorization),
        ("ITMOs issued",row.itmos_issued),
        ("Active blue carbon projects",row.active_blue_carbon_projects),
    ]
    st.markdown("<div class='section'>Key enabling conditions</div>",unsafe_allow_html=True)
    cols=st.columns(4)
    for i,(label,value) in enumerate(vals):
        with cols[i%4]:
            st.markdown(f"<div class='mini'><div class='mini-label'>{label}</div><div class='mini-value'>{badge(value)}</div></div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Article 6 transaction context</div>",unsafe_allow_html=True)
    st.markdown("""
    <div class="card pad">
      <div class="title">Indicative transaction pathway</div>
      <div class="sub">The pathway shows what the platform needs to verify before an Article 6 blue carbon transaction can progress. It is not a readiness score.</div>
      <div class="path">
        <div class="step done">Project<br>Concept</div>
        <div class="step done">Methodology</div>
        <div class="step current">Host Country<br>Process</div>
        <div class="step">Authorization</div>
        <div class="step">Issuance</div>
        <div class="step">ITMO</div>
      </div>
    </div>
    """,unsafe_allow_html=True)

    st.markdown("<div class='section'>Active project intelligence</div>",unsafe_allow_html=True)
    p=projects[projects.country==country]
    if len(p):
        for _,r in p.iterrows():
            st.markdown(f"""
            <div class="card pad" style="margin-bottom:7px">
              <div style="display:flex;justify-content:space-between">
                <div><div class="title">{r.project_id} · {r.ecosystem}</div>
                <div class="sub">{r.stage} · {r.assessment_stage}</div></div>
                <div>{badge(r.blocker_type)}</div>
              </div>
              <div class="blocker"><b style="font-size:.61rem;color:{RED}">{r.blocker_type}</b>
              <div style="font-size:.62rem;margin-top:3px">{r.primary_blocker}</div>
              <div style="font-size:.58rem;color:{MUTED};margin-top:3px">{r.transaction_note}</div></div>
            </div>
            """,unsafe_allow_html=True)
    else:
        st.info("No project records in the illustrative dataset.")

    st.markdown("<div class='section'>Bilateral cooperation</div>",unsafe_allow_html=True)
    b=bilateral[(bilateral.country_a==country)|(bilateral.country_b==country)]
    if len(b):
        st.dataframe(b,hide_index=True,use_container_width=True)
    else:
        st.info("No bilateral records in the illustrative dataset.")

# ============================================================
# PROJECTS — first functional view of the project intelligence
# ============================================================
elif page == "Projects":
    st.markdown("<div class='section'>Project intelligence</div>",unsafe_allow_html=True)
    st.markdown("""
    <div class="card pad">
      <div class="title">Project Explorer</div>
      <div class="sub">A market overview of project activity, transaction stage and blockers. No readiness score is assigned.</div>
    </div>
    """,unsafe_allow_html=True)

    f1,f2,f3=st.columns(3)
    with f1:
        country_filter=st.selectbox("Country",["All"]+country_options)
    with f2:
        stage_filter=st.selectbox("Stage",["All"]+sorted(projects.stage.unique().tolist()))
    with f3:
        blocker_filter=st.selectbox("Blocker",["All"]+sorted(projects.blocker_type.unique().tolist()))

    view=projects.copy()
    if country_filter!="All": view=view[view.country==country_filter]
    if stage_filter!="All": view=view[view.stage==stage_filter]
    if blocker_filter!="All": view=view[view.blocker_type==blocker_filter]

    st.markdown("<div class='section'>Current activity</div>",unsafe_allow_html=True)
    for _,r in view.iterrows():
        st.markdown(f"""
        <div class="card pad" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div class="title">{r.project_id} · {r.country}</div>
              <div class="sub">{r.ecosystem} · {r.stage} · {r.assessment_stage}</div>
            </div>
            <div>{badge(r.blocker_type)}</div>
          </div>
          <div class="blocker"><b style="font-size:.60rem">Primary blocker / issue</b>
          <div style="font-size:.62rem;margin-top:2px">{r.primary_blocker}</div>
          <div style="font-size:.57rem;color:{MUTED};margin-top:3px">{r.transaction_note}</div></div>
        </div>
        """,unsafe_allow_html=True)

# ============================================================
# OTHER AGREED TABS — architecture preserved
# ============================================================
else:
    titles={
        "Global Enabling Conditions Map":"Global Enabling Conditions Map",
        "Article 6 & Policy":"Article 6 & Policy Explorer",
        "Carbon Markets":"Carbon Markets Explorer",
        "Methodologies":"Blue Carbon Methodologies Explorer",
        "News & Intelligence":"News & Intelligence Explorer",
        "Marine Spatial Planning":"Marine Spatial Planning",
    }
    st.markdown(f"<div class='card pad'><div style='font-size:1.45rem;font-weight:700;color:{NAVY}'>{titles[page]}</div><div class='sub'>This page keeps the agreed navigation architecture. Its detailed interface will use the same shared data model and visual system.</div></div>",unsafe_allow_html=True)

st.markdown("<div class='footer'>Blue Carbon Intelligence · V5 functional concept · Illustrative data pending verified source integration</div>",unsafe_allow_html=True)
