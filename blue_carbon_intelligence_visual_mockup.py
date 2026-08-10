
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
# Milestone 2:
# Global Overview -> Map -> Country Intelligence -> Project Explorer -> Project Detail
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

.project-hero{background:linear-gradient(110deg,#082A45,#0D405A);border-radius:12px;color:white;padding:20px 22px;margin-bottom:12px;}
.project-hero h2{font-family:'Playfair Display',Georgia,serif;font-size:1.65rem;font-weight:500;margin:4px 0 5px;}
.project-hero p{font-size:.67rem;color:#C9DCE5;max-width:760px;line-height:1.5;margin:0;}
.filterbar{background:white;border:1px solid #DCE5E9;border-radius:10px;padding:11px 12px;margin-bottom:12px;}
.project-row{background:white;border:1px solid #DCE5E9;border-radius:10px;padding:13px 15px;margin-bottom:7px;transition:.15s;}
.project-row:hover{border-color:#B7CDD6;box-shadow:0 2px 10px rgba(18,54,73,.06);}
.project-id{font-size:.55rem;color:#6E7F8A;letter-spacing:.08em;text-transform:uppercase;font-weight:700;}
.project-name{font-size:.78rem;color:#0B3150;font-weight:700;margin-top:3px;}
.project-meta{font-size:.58rem;color:#6E7F8A;margin-top:4px;line-height:1.45;}
.project-action{font-size:.60rem;color:#2478A6;font-weight:700;}
.state-active{background:#E5F2E9;color:#2D7045;}
.state-progress{background:#E7F5F5;color:#137477;}
.state-early{background:#FFF1DC;color:#8D5D1E;}
.state-blocked{background:#F9E8E8;color:#9A4141;}
.metric-card{background:white;border:1px solid #DCE5E9;border-radius:10px;padding:12px 14px;min-height:82px;}
.metric-num{font-size:1.35rem;color:#0B3150;font-weight:700;}
.metric-label{font-size:.55rem;color:#6E7F8A;text-transform:uppercase;letter-spacing:.07em;}
.detail-banner{background:white;border:1px solid #DCE5E9;border-radius:11px;padding:17px;margin-bottom:10px;}
.detail-title{font-size:1.35rem;color:#0B3150;font-weight:700;}
.detail-sub{font-size:.64rem;color:#6E7F8A;margin-top:4px;}
.detail-section{font-size:.61rem;color:#6E7F8A;text-transform:uppercase;letter-spacing:.12em;font-weight:700;margin:16px 0 7px;}
.info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;}
.info-box{background:#F8FAFB;border:1px solid #E7EEF1;border-radius:7px;padding:9px;}
.info-label{font-size:.52rem;color:#6E7F8A;text-transform:uppercase;letter-spacing:.05em;}
.info-value{font-size:.65rem;color:#0B3150;font-weight:700;margin-top:3px;}
.blocker-hard{border-left:4px solid #B95353;background:#FDF5F5;border-radius:6px;padding:10px 12px;}
.blocker-soft{border-left:4px solid #D28A2E;background:#FFFBF3;border-radius:6px;padding:10px 12px;}
.next-action{border-left:4px solid #2478A6;background:#F3F8FB;border-radius:6px;padding:10px 12px;}
.path2{display:flex;gap:4px;margin-top:8px;}
.path2 .pstep{flex:1;background:#EEF2F4;color:#687983;border-radius:5px;padding:8px 4px;text-align:center;font-size:.52rem;}
.path2 .pdone{background:#E5F2E9;color:#2D7045;font-weight:700;}
.path2 .pcurrent{background:#E7F5F5;color:#137477;font-weight:700;}
</style>
""", unsafe_allow_html=True)

def badge(value):
    cls = {
        "Implemented":"good","In Development":"dev","Planned":"plan",
        "Not Available":"na","No Data":"na","Active":"good"
    }.get(value,"na")
    return f"<span class='badge {cls}'>{value}</span>"

def project_market_state(row):
    """Descriptive market state — not a readiness score."""
    stage = str(row["stage"])
    blocker = str(row["blocker_type"])
    if blocker == "Hard blocker":
        return "Blocked", "state-blocked"
    if stage in ("Development", "Validation"):
        return "Progressing", "state-progress"
    return "Early Stage", "state-early"

def project_next_action(row):
    issue = str(row["primary_blocker"])
    if issue == "Carbon rights / tenure pathway":
        return "Confirm carbon rights, tenure and host-country pathway before progressing the transaction."
    if issue == "Community consultation":
        return "Complete community consultation and document stakeholder outcomes."
    if issue == "Project boundary confirmation":
        return "Confirm project boundary and eligibility before moving into formal development."
    if issue == "Authorization pathway":
        return "Clarify the host-country authorization process and required submission documents."
    if issue == "Land / tenure verification":
        return "Complete land and tenure verification before project development."
    return "Verify the outstanding requirement and update the project transaction record."

def project_pathway(row):
    stage = str(row["stage"])
    if stage == "Validation":
        current = 2
    elif stage == "Development":
        current = 3
    else:
        current = 1
    steps = ["Concept","Methodology","Project development","Host-country process","Authorization","Issuance / ITMO"]
    html = "<div class='path2'>"
    for i,s in enumerate(steps):
        cls = "pdone" if i < current else ("pcurrent" if i == current else "")
        html += f"<div class='pstep {cls}'>{s}</div>"
    html += "</div>"
    return html

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

    # Country Intelligence is an internal destination and is intentionally NOT
    # a permanent sidebar tab. The sidebar widget keeps its own state.
    # IMPORTANT: never assign to the radio widget's session-state key after
    # the widget has been created; Streamlit raises StreamlitAPIException.
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

# ---------- NAVIGATION CALLBACKS ----------
def go_global():
    # Do not mutate the sidebar radio's state here. It is already a Streamlit
    # widget and changing its key during the same run can raise an API error.
    st.session_state.page = "Global Overview"

def go_country():
    # Country Intelligence is an internal view, not a permanent sidebar tab.
    st.session_state.page = "Country Intelligence"

def go_page(target):
    st.session_state.page = target

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
            st.button(
                "Open Country Profile →",
                use_container_width=True,
                on_click=go_country,
            )

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
            st.button(
                "Open",
                key=f"open_{target}",
                use_container_width=True,
                on_click=go_page,
                args=(target,),
            )

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

    st.button(
        "← Back to Global Overview",
        key="back_to_global",
        on_click=go_global,
    )

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
    # Internal project detail view: Projects remains the permanent sidebar tab.
    detail_id = st.session_state.get("project_detail_id")

    if detail_id:
        match = projects[projects.project_id == detail_id]
        if len(match) == 0:
            st.session_state.project_detail_id = None
            st.rerun()

        r = match.iloc[0]
        state, state_cls = project_market_state(r)

        if st.button("← Back to Project Explorer", key="back_project_explorer"):
            st.session_state.project_detail_id = None
            st.rerun()

        st.markdown("<div class='detail-section'>Project intelligence · Project detail</div>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="detail-banner">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:15px">
            <div>
              <div class="project-id">{r.project_id}</div>
              <div class="detail-title">{r.country} · {r.ecosystem}</div>
              <div class="detail-sub">{r.stage} · CAAS assessment: {r.assessment_stage}</div>
            </div>
            <div style="text-align:right">
              <span class="badge {state_cls}">{state}</span>
              <div style="font-size:.52rem;color:#6E7F8A;margin-top:5px">Market state · descriptive, not scored</div>
            </div>
          </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div class='detail-section'>Project record</div>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="card pad">
          <div class="info-grid">
            <div class="info-box"><div class="info-label">Country</div><div class="info-value">{r.country}</div></div>
            <div class="info-box"><div class="info-label">Ecosystem</div><div class="info-value">{r.ecosystem}</div></div>
            <div class="info-box"><div class="info-label">Project stage</div><div class="info-value">{r.stage}</div></div>
            <div class="info-box"><div class="info-label">CAAS assessment</div><div class="info-value">{r.assessment_stage}</div></div>
            <div class="info-box"><div class="info-label">Blocker type</div><div class="info-value">{r.blocker_type}</div></div>
            <div class="info-box"><div class="info-label">Article 6 note</div><div class="info-value">{r.transaction_note}</div></div>
            <div class="info-box"><div class="info-label">Current market state</div><div class="info-value">{state}</div></div>
            <div class="info-box"><div class="info-label">Project ID</div><div class="info-value">{r.project_id}</div></div>
          </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div class='detail-section'>Transaction pathway</div>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="card pad">
          <div class="title">Where the project sits in the transaction process</div>
          <div class="sub">This is a process view, not a readiness score. The current position is based on the project stage in the underlying record.</div>
          {project_pathway(r)}
        </div>
        """, unsafe_allow_html=True)

        left, right = st.columns(2, gap="medium")
        with left:
            st.markdown("<div class='detail-section'>Key blocker</div>", unsafe_allow_html=True)
            if r.blocker_type == "Hard blocker":
                st.markdown(f"""
                <div class="blocker-hard">
                  <div style="font-size:.60rem;font-weight:700;color:#9A4141">HARD BLOCKER</div>
                  <div style="font-size:.68rem;font-weight:700;margin-top:3px">{r.primary_blocker}</div>
                  <div style="font-size:.58rem;color:#6E7F8A;margin-top:4px">This issue may prevent the project from progressing through the transaction pathway until resolved.</div>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="blocker-soft">
                  <div style="font-size:.60rem;font-weight:700;color:#8D5D1E">SOFT BLOCKER</div>
                  <div style="font-size:.68rem;font-weight:700;margin-top:3px">{r.primary_blocker}</div>
                  <div style="font-size:.58rem;color:#6E7F8A;margin-top:4px">An outstanding issue that should be addressed but does not necessarily prevent continued development.</div>
                </div>
                """, unsafe_allow_html=True)

        with right:
            st.markdown("<div class='detail-section'>Next action</div>", unsafe_allow_html=True)
            st.markdown(f"""
            <div class="next-action">
              <div style="font-size:.60rem;font-weight:700;color:#2478A6">RECOMMENDED NEXT ACTION</div>
              <div style="font-size:.67rem;font-weight:600;margin-top:3px">{project_next_action(r)}</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("<div class='detail-section'>Transaction note</div>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="card pad">
          <div class="title">Current pathway note</div>
          <div class="sub" style="font-size:.68rem;color:#1F3545">{r.transaction_note}</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div style="font-size:.54rem;color:#7A8992;margin-top:12px">
        Prototype note: project records are illustrative and should be replaced with verified project, developer, methodology, authorization and transaction-source data before production use.
        </div>
        """, unsafe_allow_html=True)

    else:
        st.markdown("""
        <div class="project-hero">
          <div class="kicker">PROJECT PIPELINE · ARTICLE 6 · BLUE CARBON</div>
          <h2>Project Explorer</h2>
          <p>See what is actually happening across the project pipeline, where projects sit in the transaction process, and what is preventing them from moving forward. No readiness score is assigned.</p>
        </div>
        """, unsafe_allow_html=True)

        # Descriptive market signals.
        blocked = int((projects.blocker_type == "Hard blocker").sum())
        soft = int((projects.blocker_type == "Soft blocker").sum())
        progressing = int(projects.stage.isin(["Development","Validation"]).sum())
        countries_tracked = projects.country.nunique()

        m1,m2,m3,m4 = st.columns(4)
        metrics = [
            ("Projects tracked", len(projects)),
            ("Countries with activity", countries_tracked),
            ("Progressing", progressing),
            ("Hard blockers", blocked),
        ]
        for col,(label,num) in zip([m1,m2,m3,m4],metrics):
            with col:
                st.markdown(f"<div class='metric-card'><div class='metric-num'>{num}</div><div class='metric-label'>{label}</div></div>",unsafe_allow_html=True)

        st.markdown("<div class='section'>Filter project activity</div>",unsafe_allow_html=True)
        st.markdown("<div class='filterbar'>",unsafe_allow_html=True)
        f1,f2,f3,f4 = st.columns(4)
        with f1:
            country_filter = st.selectbox("Country", ["All"] + sorted(projects.country.unique().tolist()), key="project_country_filter")
        with f2:
            ecosystem_filter = st.selectbox("Ecosystem", ["All"] + sorted(projects.ecosystem.unique().tolist()), key="project_ecosystem_filter")
        with f3:
            stage_filter = st.selectbox("Project stage", ["All"] + sorted(projects.stage.unique().tolist()), key="project_stage_filter")
        with f4:
            blocker_filter = st.selectbox("Blocker", ["All"] + sorted(projects.blocker_type.unique().tolist()), key="project_blocker_filter")
        st.markdown("</div>",unsafe_allow_html=True)

        view = projects.copy()
        if country_filter != "All":
            view = view[view.country == country_filter]
        if ecosystem_filter != "All":
            view = view[view.ecosystem == ecosystem_filter]
        if stage_filter != "All":
            view = view[view.stage == stage_filter]
        if blocker_filter != "All":
            view = view[view.blocker_type == blocker_filter]

        st.markdown(f"<div class='section'>Current project activity · {len(view)} records</div>",unsafe_allow_html=True)

        if len(view) == 0:
            st.info("No projects match the selected filters.")
        else:
            for _,r in view.iterrows():
                state, state_cls = project_market_state(r)
                st.markdown(f"""
                <div class="project-row">
                  <div style="display:grid;grid-template-columns:1.45fr .72fr .72fr .9fr .85fr auto;gap:10px;align-items:center">
                    <div>
                      <div class="project-id">{r.project_id}</div>
                      <div class="project-name">{r.country} · {r.ecosystem}</div>
                      <div class="project-meta">{r.stage} · CAAS: {r.assessment_stage}</div>
                    </div>
                    <div><div class="project-id">Market state</div><span class="badge {state_cls}">{state}</span></div>
                    <div><div class="project-id">Blocker</div>{badge(r.blocker_type)}</div>
                    <div><div class="project-id">Issue</div><div class="project-meta">{r.primary_blocker}</div></div>
                    <div><div class="project-id">Pathway</div><div class="project-meta">{r.transaction_note}</div></div>
                    <div class="project-action">Open →</div>
                  </div>
                </div>
                """,unsafe_allow_html=True)
                if st.button(f"View {r.project_id}", key=f"view_project_{r.project_id}", use_container_width=False):
                    st.session_state.project_detail_id = r.project_id
                    st.rerun()

        st.markdown("""
        <div style="font-size:.55rem;color:#7A8992;margin-top:10px">
        Hard blocker = an issue that may prevent progression. Soft blocker = an issue that should be addressed but does not necessarily stop development. These are descriptive market classifications, not scores.
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

st.markdown("<div class='footer'>Blue Carbon Intelligence · V6 Project Explorer concept · Illustrative data pending verified source integration</div>",unsafe_allow_html=True)
