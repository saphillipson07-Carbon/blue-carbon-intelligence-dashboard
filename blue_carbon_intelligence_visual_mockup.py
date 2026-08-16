
import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="Blue Carbon Intelligence", page_icon="🌊", layout="wide")

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

def badge(value):
    cls = {
        "Implemented":"good","In Development":"dev","Planned":"plan",
        "Not Available":"na","No Data":"na","Active":"good",
        "Hard blocker":"bad","Soft blocker":"plan"
    }.get(str(value), "na")
    return f"<span class='badge {cls}'>{value}</span>"

# ---------------- CSS ----------------
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@500;600&display=swap');
html,body,[class*="css"] {{font-family:'DM Sans',Arial,sans-serif;color:{INK};}}
.stApp {{background:{BG};}}
.block-container {{max-width:1540px;padding:0 1.15rem 2rem;}}
[data-testid="stSidebar"] {{background:#082A45;min-width:236px;max-width:236px;}}
[data-testid="stSidebar"] * {{color:#F2F7FA!important;}}
[data-testid="stSidebar"] label {{font-size:.78rem;}}
.topbar {{height:68px;margin:0 -1.15rem 1.05rem;padding:0 1.35rem;background:{NAVY};color:white;display:flex;align-items:center;gap:18px;}}
.brand {{font-weight:700;font-size:17px;letter-spacing:-.03em;}}
.brand-sub {{font-size:8px;letter-spacing:.16em;color:#A9C6D6;}}
.product {{font-size:1.28rem;font-weight:600;flex:1;}}
.product small {{display:block;font-size:.64rem;color:#BCD0DB;font-weight:400;margin-top:2px;}}
.top-control {{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);border-radius:7px;padding:8px 11px;font-size:.67rem;white-space:nowrap;}}
.top-accent {{background:#138C9D;border-color:#138C9D;font-weight:700;}}
.hero {{background:linear-gradient(115deg,#082A45,#0B3150 60%,#12516B);border-radius:13px;color:white;padding:27px 30px;min-height:218px;}}
.kicker {{color:#A5D9D7;font-size:.63rem;letter-spacing:.13em;text-transform:uppercase;font-weight:700;}}
.hero h1 {{font-family:'Playfair Display',Georgia,serif;font-size:2.45rem;line-height:1.03;margin:9px 0;font-weight:500;}}
.hero h1 em {{color:#8FD1AA;}}
.hero p {{color:#D0E0E8;font-size:.78rem;line-height:1.6;max-width:600px;}}
.btn {{display:inline-block;margin-top:15px;padding:9px 13px;border-radius:7px;background:{GREEN};color:white;font-size:.68rem;font-weight:700;}}
.hero-grid {{display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(255,255,255,.13);border-radius:10px;overflow:hidden;}}
.stat {{padding:14px;background:rgba(255,255,255,.055);min-height:91px;border-right:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);}}
.stat:nth-child(2n) {{border-right:0;}} .stat:nth-child(3),.stat:nth-child(4) {{border-bottom:0;}}
.num {{font-family:'Playfair Display';font-size:1.55rem;}}
.lab {{font-size:.56rem;text-transform:uppercase;letter-spacing:.06em;color:#C1D5DF;}}
.note {{font-size:.59rem;color:#8FAEBD;margin-top:4px;}}
.live {{background:#0C3A57;color:#D9E7ED;border-radius:7px;padding:7px 12px;margin-top:9px;font-size:.62rem;}}
.live b {{color:#8FD1AA;letter-spacing:.08em;}}
.section {{margin:18px 0 7px;font-size:.62rem;color:{MUTED};text-transform:uppercase;letter-spacing:.12em;font-weight:700;}}
.card {{background:white;border:1px solid {LINE};border-radius:11px;box-shadow:0 2px 9px rgba(18,54,73,.025);}}
.pad {{padding:14px 16px;}}
.title {{font-size:.88rem;color:{NAVY};font-weight:700;}}
.sub {{font-size:.65rem;color:{MUTED};line-height:1.45;margin-top:3px;}}
.news-item {{padding:10px 14px;border-bottom:1px solid #EDF1F3;}}
.tag {{font-size:.54rem;padding:3px 6px;border-radius:4px;background:#EAF4F8;color:{BLUE};font-weight:700;}}
.date {{font-size:.54rem;color:{MUTED};margin-left:6px;}}
.headline {{font-size:.68rem;font-weight:600;line-height:1.4;margin-top:5px;}}
.badge {{padding:3px 6px;border-radius:10px;font-size:.54rem;font-weight:700;display:inline-block;}}
.good {{background:#E5F2E9;color:#2D7045;}} .dev {{background:#E7F5F5;color:#137477;}}
.plan {{background:#FFF1DC;color:#8D5D1E;}} .bad {{background:#F9E8E8;color:#9A4141;}}
.na {{background:#EEF2F4;color:#63727B;}}
.project-row {{background:white;border:1px solid {LINE};border-radius:11px;padding:14px 16px;margin-bottom:8px;}}
.project-link {{font-size:.86rem;font-weight:700;color:{NAVY};}}
.project-meta {{font-size:.61rem;color:{MUTED};margin-top:3px;}}
.project-grid {{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:11px;}}
.project-cell {{background:#F8FAFB;border:1px solid #E7EEF1;border-radius:7px;padding:8px;}}
.cell-label {{font-size:.52rem;text-transform:uppercase;letter-spacing:.06em;color:{MUTED};}}
.cell-value {{font-size:.62rem;font-weight:700;color:{NAVY};margin-top:3px;}}
.detail-head {{background:linear-gradient(115deg,#082A45,#0B3150 60%,#12516B);border-radius:12px;padding:20px;color:white;}}
.detail-title {{font-family:'Playfair Display';font-size:1.85rem;}}
.detail-sub {{font-size:.67rem;color:#C8DCE5;margin-top:4px;}}
.path {{display:flex;gap:5px;margin-top:13px;}}
.step {{flex:1;text-align:center;font-size:.53rem;padding:8px 3px;border-radius:6px;background:#EEF2F4;color:#697A84;}}
.step.done {{background:#DDEFE3;color:#2D7045;font-weight:700;}}
.step.current {{background:#D9F1F1;color:#137477;font-weight:700;}}
.blocker {{padding:10px 12px;border-left:4px solid {RED};background:#FDF5F5;border-radius:6px;margin-top:7px;}}
.footer {{text-align:center;color:#7A8992;font-size:.55rem;margin-top:16px;}}

.project-toolbar {{background:white;border:1px solid #DCE5E9;border-radius:11px;padding:14px 16px;margin-top:10px;}}
.project-toolbar-title {{font-size:.68rem;font-weight:700;color:#0B3150;text-transform:uppercase;letter-spacing:.08em;}}
.project-toolbar-note {{font-size:.60rem;color:#6E7F8A;margin-top:3px;}}
.project-snapshot {{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:12px 0;}}
.snapshot-card {{background:white;border:1px solid #DCE5E9;border-radius:10px;padding:12px 14px;}}
.snapshot-number {{font-family:'Playfair Display';font-size:1.45rem;color:#0B3150;}}
.snapshot-label {{font-size:.53rem;color:#6E7F8A;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}}
.snapshot-note {{font-size:.55rem;color:#84939B;margin-top:4px;}}
.project-result {{background:white;border:1px solid #DCE5E9;border-radius:11px;margin:8px 0;padding:0;overflow:hidden;}}
.project-result-head {{padding:13px 15px 10px;border-bottom:1px solid #E9EFF2;}}
.project-result-id {{font-size:.84rem;font-weight:700;color:#0B3150;}}
.project-result-meta {{font-size:.59rem;color:#6E7F8A;margin-top:3px;}}
.project-result-body {{padding:11px 15px;}}
.project-result-grid {{display:grid;grid-template-columns:1.1fr 1.1fr 1.4fr 1.2fr;gap:8px;}}
.result-cell {{background:#F7FAFB;border:1px solid #E7EEF1;border-radius:7px;padding:8px 9px;min-height:55px;}}
.result-label {{font-size:.49rem;text-transform:uppercase;letter-spacing:.06em;color:#7A8992;}}
.result-value {{font-size:.60rem;font-weight:700;color:#0B3150;margin-top:4px;line-height:1.3;}}
.project-result-foot {{display:flex;align-items:center;justify-content:space-between;padding:9px 15px;background:#FBFCFC;border-top:1px solid #E9EFF2;}}
.project-note {{font-size:.56rem;color:#6E7F8A;}}
.project-action {{font-size:.59rem;font-weight:700;color:#167F8A;}}


</style>
""", unsafe_allow_html=True)

# ---------------- Clean navigation state ----------------
PERMANENT_PAGES = [
    "Global Overview",
    "Global Enabling Conditions Map",
    "Article 6 & Policy",
    "Carbon Markets",
    "Methodologies",
    "Projects",
    "News & Intelligence",
    "Marine Spatial Planning",
]

if "active_page" not in st.session_state:
    st.session_state.active_page = "Global Overview"
if "selected_country" not in st.session_state:
    st.session_state.selected_country = "Indonesia"
if "project_detail_id" not in st.session_state:
    st.session_state.project_detail_id = None

def navigate_to(page):
    st.session_state.active_page = page
    if page != "Project Detail":
        st.session_state.project_detail_id = None

def select_sidebar_page():
    st.session_state.active_page = st.session_state.main_navigation
    st.session_state.project_detail_id = None

with st.sidebar:
    st.markdown(
        "<div style='font-size:16px;font-weight:700'>BLUE CARBON</div>"
        "<div style='font-size:8px;letter-spacing:.16em;color:#A9C5D5'>INTELLIGENCE PLATFORM</div>",
        unsafe_allow_html=True,
    )
    st.divider()
    st.markdown(
        "<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>GLOBAL INTELLIGENCE</div>",
        unsafe_allow_html=True,
    )

    st.radio(
        "Navigation",
        PERMANENT_PAGES,
        key="main_navigation",
        on_change=select_sidebar_page,
    )

    st.divider()
    st.markdown(
        "<div style='font-size:.60rem;letter-spacing:.11em;color:#9EB8C8'>RESOURCES</div>",
        unsafe_allow_html=True,
    )
    for item in ["Documents Library", "Data & Reports", "Glossary"]:
        st.caption(item)

country_options = countries["country"].tolist()

def go_country(country):
    st.session_state.selected_country = country
    st.session_state.project_detail_id = None
    st.session_state.active_page = "Country Intelligence"

def go_project(project_id):
    st.session_state.project_detail_id = project_id
    st.session_state.active_page = "Project Detail"

# ============================================================
# GLOBAL OVERVIEW
# ============================================================
if st.session_state.active_page == "Global Overview":
    a,b = st.columns([1.04,.96],gap="large")
    with a:
        st.markdown("""
        <div class="hero">
          <div class="kicker">ARTICLE 6 · ITMO · BLUE CARBON MARKETS</div>
          <h1>Blue carbon<br><em>market intelligence</em></h1>
          <p>A single view of the policy, market, project and ecosystem conditions shaping blue carbon transactions under Article 6.</p>
          <span class="btn">Explore the map →</span>
        </div>
        """, unsafe_allow_html=True)
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
        """, unsafe_allow_html=True)
    st.markdown("<div class='live'><b>● LIVE INTELLIGENCE</b> &nbsp;&nbsp; Latest policy · market · project · regulatory · agreement updates</div>", unsafe_allow_html=True)

    st.markdown("<div class='section'>Global enabling conditions</div>", unsafe_allow_html=True)
    m,n = st.columns([1.72,.82],gap="medium")
    with m:
        st.markdown("<div class='card pad'><div class='title'>Global Enabling Conditions Map</div><div class='sub'>Choose an indicator and use the country selector to open Country Intelligence.</div></div>", unsafe_allow_html=True)
        layer_name = st.selectbox("Map indicator", list(status_cols.keys()), label_visibility="collapsed")
        layer_col = status_cols[layer_name]
        order = {"Implemented":0,"In Development":1,"Planned":2,"Not Available":3,"No Data":4}
        mapdf = countries[["iso","country",layer_col]].copy()
        mapdf["code"] = mapdf[layer_col].map(order).fillna(4)
        fig = px.choropleth(mapdf, locations="iso", color="code", hover_name="country",
                            custom_data=[mapdf[layer_col]],
                            color_continuous_scale=["#2E8B62","#159A9C","#D28A2E","#AEB9BE","#E5EAED"],
                            range_color=[0,4])
        fig.update_traces(hovertemplate="<b>%{hovertext}</b><br>"+layer_name+": %{customdata[0]}<extra></extra>")
        fig.update_geos(showframe=False,showcoastlines=True,coastlinecolor="#D6E1E5",
                        bgcolor="#EAF4F8",landcolor="#F5F8F9",projection_type="natural earth")
        fig.update_layout(height=390,margin=dict(l=0,r=0,t=0,b=0),coloraxis_showscale=False,
                          paper_bgcolor="white",plot_bgcolor="#EAF4F8")
        st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
        c1,c2=st.columns([1,.72])
        with c1:
            chosen=st.selectbox("Country",country_options,index=country_options.index(st.session_state.selected_country))
            st.session_state.selected_country=chosen
        with c2:
            if st.button("Open Country Profile →",use_container_width=True):
                go_country(chosen)
                st.rerun()
        st.caption("Geography: real country boundaries. Status records: illustrative until verified data integration.")

    with n:
        st.markdown("<div class='card' style='overflow:hidden'><div class='pad'><div class='title'>Latest Intelligence</div><div class='sub'>Policy, regulation, projects, markets and agreements.</div></div>",unsafe_allow_html=True)
        for _,r in news.iterrows():
            st.markdown(f"<div class='news-item'><span class='tag'>{r.type}</span><span class='date'>{r.date}</span><div class='headline'>{r.headline}</div></div>",unsafe_allow_html=True)
        st.markdown("</div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Explore the intelligence</div>",unsafe_allow_html=True)
    cols=st.columns(4)
    windows=[("📜","Article 6 & Policy","Frameworks, NDCs, bilateral agreements.","Article 6 & Policy"),
             ("🌿","Blue Carbon Methodologies","Methods and applicability.","Methodologies"),
             ("📂","Projects","Project activity, blockers and next actions.","Projects"),
             ("💰","Carbon Markets","Markets and infrastructure.","Carbon Markets")]
    for col,(icon,title,desc,target) in zip(cols,windows):
        with col:
            st.markdown(f"<div class='card pad' style='min-height:125px'><div style='font-size:18px'>{icon}</div><div class='title'>{title}</div><div class='sub'>{desc}</div></div>",unsafe_allow_html=True)
            if st.button("Open",key="global_"+target,use_container_width=True):
                st.session_state.active_page=target
                st.rerun()

# ============================================================
# COUNTRY INTELLIGENCE
# ============================================================
elif st.session_state.active_page == "Country Intelligence":
    st.markdown("<div class='section'>Country intelligence</div>",unsafe_allow_html=True)
    if st.button("← Back to Global Overview", key="country_back"):
        navigate_to("Global Overview")
        st.rerun()

    country=st.selectbox("Country profile",country_options,index=country_options.index(st.session_state.selected_country))
    st.session_state.selected_country=country
    row=countries[countries.country==country].iloc[0]
    st.markdown(f"""
    <div class="card pad">
      <div style="font-size:1.55rem;font-weight:700;color:{NAVY}">{row.country}</div>
      <div style="margin-top:6px"><span class="badge dev">{row.market_role}</span></div>
    </div>
    """,unsafe_allow_html=True)

    vals=[("Article 6 framework",row.article6_framework),("DNA appointed",row.dna_appointed),
          ("Domestic carbon market",row.domestic_carbon_market),("Bilateral agreements",row.bilateral_agreements),
          ("Blue carbon in NDCs",row.blue_carbon_ndc),("Article 6 authorization",row.article6_authorization),
          ("ITMOs issued",row.itmos_issued),("Active blue carbon projects",row.active_blue_carbon_projects)]
    st.markdown("<div class='section'>Key enabling conditions</div>",unsafe_allow_html=True)
    cols=st.columns(4)
    for i,(label,value) in enumerate(vals):
        with cols[i%4]:
            st.markdown(f"<div class='card pad'><div style='font-size:.55rem;text-transform:uppercase;color:{MUTED}'>{label}</div><div style='margin-top:5px'>{badge(value)}</div></div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Project activity</div>",unsafe_allow_html=True)
    p=projects[projects.country==country]
    for _,r in p.iterrows():
        if st.button(f"{r.project_id} · {r.country} · {r.ecosystem}  →", key=f"country_project_{r.project_id}", use_container_width=True):
            go_project(r.project_id)
            st.rerun()

# ============================================================
# PROJECT EXPLORER
# ============================================================
elif st.session_state.active_page == "Projects":
    back_col, _ = st.columns([1.6, 6])
    with back_col:
        if st.button("← Back to Global Overview", key="projects_back_global", use_container_width=True):
            navigate_to("Global Overview")
            st.rerun()

    st.markdown("<div class='section'>Project intelligence</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class="card pad">
      <div class="title">Project Explorer</div>
      <div class="sub">Track real project activity, Article 6 progress and the issues that can move or delay a transaction. No readiness score is applied.</div>
    </div>
    """, unsafe_allow_html=True)

    total_projects = len(projects)
    country_count = projects["country"].nunique()
    hard_blockers = int((projects["blocker_type"].astype(str).str.lower() == "hard blocker").sum())
    progressing = int(projects["stage"].astype(str).str.lower().isin(["development", "validation"]).sum())

    st.markdown(f"""
    <div class="project-snapshot">
      <div class="snapshot-card"><div class="snapshot-number">{total_projects}</div><div class="snapshot-label">Projects tracked</div><div class="snapshot-note">Current project records</div></div>
      <div class="snapshot-card"><div class="snapshot-number">{country_count}</div><div class="snapshot-label">Countries</div><div class="snapshot-note">With project activity</div></div>
      <div class="snapshot-card"><div class="snapshot-number">{progressing}</div><div class="snapshot-label">Progressing</div><div class="snapshot-note">Development or validation</div></div>
      <div class="snapshot-card"><div class="snapshot-number">{hard_blockers}</div><div class="snapshot-label">Hard blockers</div><div class="snapshot-note">Issues requiring resolution</div></div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="project-toolbar">
      <div class="project-toolbar-title">Filter project activity</div>
      <div class="project-toolbar-note">Use the filters to narrow the project view. Status is shown as market information, not a numerical assessment.</div>
    </div>
    """, unsafe_allow_html=True)

    f1, f2, f3, f4 = st.columns(4)
    with f1:
        country_filter = st.selectbox("Country", ["All"] + sorted(projects["country"].dropna().unique().tolist()), key="project_country_filter_v72")
    with f2:
        ecosystem_filter = st.selectbox("Ecosystem", ["All"] + sorted(projects["ecosystem"].dropna().unique().tolist()), key="project_ecosystem_filter_v72")
    with f3:
        stage_filter = st.selectbox("Project stage", ["All"] + sorted(projects["stage"].dropna().unique().tolist()), key="project_stage_filter_v72")
    with f4:
        blocker_filter = st.selectbox("Blocker", ["All"] + sorted(projects["blocker_type"].dropna().unique().tolist()), key="project_blocker_filter_v72")

    view = projects.copy()
    if country_filter != "All":
        view = view[view["country"] == country_filter]
    if ecosystem_filter != "All":
        view = view[view["ecosystem"] == ecosystem_filter]
    if stage_filter != "All":
        view = view[view["stage"] == stage_filter]
    if blocker_filter != "All":
        view = view[view["blocker_type"] == blocker_filter]

    st.markdown(f"<div class='section'>{len(view)} project records matching current filters</div>", unsafe_allow_html=True)

    if view.empty:
        st.markdown(
            "<div class='card pad'><div class='title'>No project records match these filters.</div>"
            "<div class='sub'>Clear one or more filters to return to the wider project market view.</div></div>",
            unsafe_allow_html=True
        )
    else:
        for _, r in view.iterrows():
            blocker = str(r.get("blocker_type", "No Data"))
            blocker_cls = "bad" if blocker.lower() == "hard blocker" else "plan" if blocker.lower() == "soft blocker" else "na"
            article_note = str(r.get("transaction_note", "No transaction note recorded"))

            st.markdown(f"""
            <div class="project-result">
              <div class="project-result-head">
                <div class="project-result-id">{r.project_id} · {r.country} · {r.ecosystem}</div>
                <div class="project-result-meta">{r.stage} · {r.assessment_stage}</div>
              </div>
              <div class="project-result-body">
                <div class="project-result-grid">
                  <div class="result-cell"><div class="result-label">Market status</div><div class="result-value">{r.stage}</div></div>
                  <div class="result-cell"><div class="result-label">CAAS assessment</div><div class="result-value">{r.assessment_stage}</div></div>
                  <div class="result-cell"><div class="result-label">Blocker</div><div class="result-value"><span class="badge {blocker_cls}">{blocker}</span></div></div>
                  <div class="result-cell"><div class="result-label">Primary issue</div><div class="result-value">{r.primary_blocker}</div></div>
                </div>
              </div>
              <div class="project-result-foot">
                <div class="project-note"><b>Article 6:</b> {article_note}</div>
                <div class="project-action">Open project →</div>
              </div>
            </div>
            """, unsafe_allow_html=True)

            if st.button(f"Open {r.project_id} · {r.country} →", key=f"project_open_v72_{r.project_id}", use_container_width=True):
                go_project(r.project_id)
                st.rerun()

# ============================================================
# PROJECT DETAIL
# ============================================================
elif st.session_state.active_page == "Project Detail":
    project_id=st.session_state.get("project_detail_id")
    record=projects[projects.project_id==project_id]
    if record.empty:
        st.error("Project record not found.")
        if st.button("← Back to Projects"):
            navigate_to("Projects")
            st.rerun()
    else:
        r=record.iloc[0]
        if st.button("← Back to Project Explorer", key="project_detail_back"):
            st.session_state.project_detail_id=None
            navigate_to("Projects")
            st.rerun()

        st.markdown(f"""
        <div class="detail-head">
          <div class="kicker">PROJECT INTELLIGENCE · {r.project_id}</div>
          <div class="detail-title">{r.country} · {r.ecosystem}</div>
          <div class="detail-sub">{r.stage} · {r.assessment_stage} · No readiness score assigned</div>
          <div class="path">
            <div class="step done">Concept</div>
            <div class="step done">Methodology</div>
            <div class="step current">Development</div>
            <div class="step">Host Country</div>
            <div class="step">Authorization</div>
            <div class="step">Issuance / ITMO</div>
          </div>
        </div>
        """,unsafe_allow_html=True)

        st.markdown("<div class='section'>Project record</div>",unsafe_allow_html=True)
        c1,c2,c3,c4=st.columns(4)
        details=[("Project ID",r.project_id),("Country",r.country),("Ecosystem",r.ecosystem),("Stage",r.stage)]
        for col,(label,value) in zip([c1,c2,c3,c4],details):
            with col:
                st.markdown(f"<div class='card pad'><div style='font-size:.55rem;color:{MUTED};text-transform:uppercase'>{label}</div><div style='font-size:.72rem;font-weight:700;color:{NAVY};margin-top:4px'>{value}</div></div>",unsafe_allow_html=True)

        st.markdown("<div class='section'>CAAS / transaction assessment</div>",unsafe_allow_html=True)
        a,b=st.columns([1,1])
        with a:
            st.markdown(f"<div class='card pad'><div class='title'>Current assessment</div><div class='sub'>CAAS assessment stage</div><div style='margin-top:8px'>{badge(r.assessment_stage)}</div></div>",unsafe_allow_html=True)
        with b:
            st.markdown(f"<div class='card pad'><div class='title'>Blocker status</div><div class='sub'>Issue preventing or slowing transaction progress</div><div style='margin-top:8px'>{badge(r.blocker_type)}</div><div class='sub' style='margin-top:7px'><b>{r.primary_blocker}</b></div></div>",unsafe_allow_html=True)

        st.markdown("<div class='section'>What needs to happen next</div>",unsafe_allow_html=True)
        st.markdown(f"<div class='blocker'><b style='font-size:.65rem;color:{RED}'>Priority action</b><div style='font-size:.65rem;margin-top:4px'>Confirm and document the {r.primary_blocker.lower()} and its implications for the host-country Article 6 pathway.</div><div style='font-size:.58rem;color:{MUTED};margin-top:5px'>{r.transaction_note}</div></div>",unsafe_allow_html=True)

# ============================================================
# OTHER AGREED TABS
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
    st.markdown(f"<div class='card pad'><div style='font-size:1.45rem;font-weight:700;color:{NAVY}'>{titles[st.session_state.active_page]}</div><div class='sub'>This page keeps the agreed navigation architecture and will use the shared platform data model.</div></div>",unsafe_allow_html=True)

st.markdown("<div class='footer'>Blue Carbon Intelligence · V6.3 functional concept · Illustrative data pending verified source integration</div>",unsafe_allow_html=True)
