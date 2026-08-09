
import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

# ============================================================
# BLUE CARBON INTELLIGENCE — VISUAL MOCK-UP
# Streamlit prototype matching the agreed concept direction
# ============================================================

st.set_page_config(
    page_title="Blue Carbon Intelligence",
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------- DESIGN SYSTEM ----------
NAVY = "#123A5A"
NAVY_2 = "#0D2E48"
BLUE = "#2E78A7"
TEAL = "#159A9C"
GREEN = "#4B9A68"
PALE_GREEN = "#E8F4EC"
PALE_BLUE = "#EAF3F8"
PALE_TEAL = "#E6F5F4"
AMBER = "#D99036"
PALE_AMBER = "#FFF2DE"
RED = "#C65B5B"
PALE_RED = "#FBEAEA"
INK = "#243746"
MUTED = "#71808B"
BORDER = "#DDE6EB"
BG = "#F5F8FA"
WHITE = "#FFFFFF"

st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

html, body, [class*="css"] {{
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: {INK};
    background: {BG};
}}

.stApp {{ background: {BG}; }}

[data-testid="stSidebar"] {{
    background: linear-gradient(180deg, {NAVY_2} 0%, {NAVY} 100%);
    min-width: 245px;
    max-width: 245px;
}}

[data-testid="stSidebar"] * {{
    color: #F3F8FB !important;
}}

[data-testid="stSidebar"] .stRadio > div {{
    gap: 4px;
}}

[data-testid="stSidebar"] label {{
    border-radius: 8px;
    padding: 7px 10px !important;
}}

[data-testid="stSidebar"] label:hover {{
    background: rgba(255,255,255,.08);
}}

.block-container {{
    max-width: 1480px;
    padding-top: 1.2rem;
    padding-bottom: 2.5rem;
}}

h1, h2, h3 {{
    color: {NAVY};
    letter-spacing: -.02em;
}}

h1 {{
    font-size: 2rem !important;
    margin-bottom: .15rem !important;
}}

h2 {{
    font-size: 1.25rem !important;
}}

h3 {{
    font-size: 1rem !important;
}}

.topbar {{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 8px 0 18px 0;
}}

.brand {{
    font-size: 18px;
    font-weight: 700;
    color: white;
    letter-spacing: -.02em;
}}

.brand-sub {{
    font-size: 10px;
    color: #BFD3E0;
    margin-top: 2px;
}}

.page-sub {{
    color: {MUTED};
    font-size: .86rem;
    margin-bottom: 18px;
}}

.card {{
    background: {WHITE};
    border: 1px solid {BORDER};
    border-radius: 12px;
    padding: 16px 18px;
    box-shadow: 0 2px 8px rgba(20, 55, 75, .035);
}}

.card-tight {{
    background: {WHITE};
    border: 1px solid {BORDER};
    border-radius: 10px;
    padding: 12px 14px;
}}

.kpi {{
    background: {WHITE};
    border: 1px solid {BORDER};
    border-radius: 12px;
    padding: 13px 15px;
    min-height: 94px;
}}

.kpi-label {{
    color:{MUTED};
    font-size:.72rem;
    font-weight:500;
    text-transform:uppercase;
    letter-spacing:.04em;
}}

.kpi-value {{
    color:{NAVY};
    font-size:1.45rem;
    line-height:1.2;
    font-weight:700;
    margin-top:5px;
}}

.kpi-note {{
    color:{MUTED};
    font-size:.70rem;
    margin-top:4px;
}}

.section-label {{
    font-size:.72rem;
    text-transform:uppercase;
    letter-spacing:.08em;
    color:{MUTED};
    font-weight:700;
    margin-bottom:7px;
}}

.status {{
    display:inline-block;
    padding:4px 9px;
    border-radius:16px;
    font-size:.70rem;
    font-weight:600;
    margin:2px 3px 2px 0;
}}

.s-green {{ background:{PALE_GREEN}; color:#2F7749; }}
.s-blue {{ background:{PALE_BLUE}; color:#2A6289; }}
.s-teal {{ background:{PALE_TEAL}; color:#14797A; }}
.s-amber {{ background:{PALE_AMBER}; color:#95601E; }}
.s-red {{ background:{PALE_RED}; color:#A13F3F; }}

.info-line {{
    display:flex;
    justify-content:space-between;
    padding:8px 0;
    border-bottom:1px solid #EDF1F3;
    font-size:.78rem;
}}
.info-line:last-child {{ border-bottom:none; }}

.muted {{ color:{MUTED}; }}

.map-shell {{
    background:#DCECF2;
    border:1px solid {BORDER};
    border-radius:12px;
    overflow:hidden;
}}

.callout {{
    background:{PALE_BLUE};
    border-left:4px solid {BLUE};
    border-radius:7px;
    padding:10px 12px;
    font-size:.78rem;
}}

.blocker-row {{
    padding:9px 0;
    border-bottom:1px solid #EDF1F3;
    font-size:.78rem;
}}

.blocker-row:last-child {{ border-bottom:none; }}

.footer-note {{
    color:{MUTED};
    font-size:.68rem;
    text-align:center;
    padding-top:14px;
}}

[data-testid="stMetric"] {{
    background: {WHITE};
    border: 1px solid {BORDER};
    border-radius: 10px;
    padding: 12px;
}}

.stButton > button {{
    border-radius:8px;
    border:1px solid {BORDER};
    background:white;
    color:{NAVY};
    font-weight:600;
}}

.stButton > button:hover {{
    border-color:{TEAL};
    color:{TEAL};
}}

div[data-baseweb="select"] > div {{
    border-radius:8px;
    border-color:{BORDER};
}}

.stDataFrame {{
    border-radius:10px;
    overflow:hidden;
}}
</style>
""", unsafe_allow_html=True)

# ---------- DATA ----------
countries = pd.DataFrame([
    ["Indonesia","Operational","Yes","Operational","Yes","Yes","No","Project Host / Potential ITMO Supplier"],
    ["Viet Nam","Developing","Yes","Developing","Yes","Yes","No","Project Host / Potential Supplier"],
    ["Philippines","Developing","Yes","Developing","In development","Yes","No","Project Host"],
    ["Kenya","Developing","Yes","Developing","Yes","Yes","No","Project Host / Potential Supplier"],
    ["Republic of Korea","Operational","Yes","Operational","Yes","No","Yes","Carbon Buyer / Article 6 Partner"],
    ["Japan","Operational","Yes","Operational","Yes","No","Yes","Carbon Buyer / Article 6 Partner"],
], columns=["Country","Article 6","DNA","Domestic Market","Bilateral Agreements","Blue Carbon NDC","ITMOs Issued","Market Role"])

projects = pd.DataFrame([
    ["Kaimana Mangrove Restoration","Indonesia","Mangrove","Validation","VM0033","Potential","Seeking Finance","Hard + Soft blockers","Korea / Japan"],
    ["Cenderawasih Seagrass Initiative","Indonesia","Seagrass","Feasibility","Emerging","Potential","Early Stage","Soft blockers","TBC"],
    ["North Sulawesi Mangrove Recovery","Indonesia","Mangrove","Registered","VM0033","Yes","Operational","None identified","Korea / Japan"],
    ["Mekong Delta Restoration","Viet Nam","Mangrove","Development","VM0033","Potential","Seeking Finance","Hard blocker","TBC"],
    ["Palawan Coastal Restoration","Philippines","Mangrove","Feasibility","Emerging","Potential","Early Stage","Soft blockers","TBC"],
    ["Mombasa Blue Carbon","Kenya","Mangrove","Validation","VM0033","Potential","Seeking Finance","Hard + Soft blockers","TBC"],
], columns=["Project","Country","Ecosystem","Stage","Methodology","Article 6","Investment Status","Diagnostic","Potential Buyers"])

methodologies = pd.DataFrame([
    ["VM0033","Verra","Tidal Wetland / Seagrass","Restoration","Potential","Potential","Multiple countries"],
    ["VM0047","Verra","Mangrove / Coastal","Conservation / restoration","Potential","Potential","Multiple countries"],
    ["JCM Blue Carbon","JCM","Mangrove / Seagrass","Project activity","Bilateral dependent","Potential","JCM partner countries"],
    ["National methodology","Indonesia","Blue carbon","Domestic","National pathway","No / domestic","Indonesia"],
], columns=["Methodology","Standard","Ecosystem","Activity","Article 6","CORSIA","Country Applicability"])

news = [
    ("Policy","Indonesia","Article 6 / authorization guidance update"),
    ("Project","Indonesia","Mangrove project moving toward validation"),
    ("Market","Republic of Korea","New blue carbon demand-side development"),
    ("Methodology","Global","Blue carbon methodology development"),
    ("Agreement","Indonesia–Japan","Bilateral cooperation implementation update"),
]

# ---------- HELPERS ----------
def header(title, subtitle):
    st.markdown(f"# {title}")
    st.markdown(f"<div class='page-sub'>{subtitle}</div>", unsafe_allow_html=True)

def kpi(label, value, note):
    st.markdown(f"""
    <div class="kpi">
      <div class="kpi-label">{label}</div>
      <div class="kpi-value">{value}</div>
      <div class="kpi-note">{note}</div>
    </div>
    """, unsafe_allow_html=True)

def badge(text, kind="green"):
    return f"<span class='status s-{kind}'>{text}</span>"

def country_panel(country):
    row = countries[countries.Country == country].iloc[0]
    st.markdown("### Country Intelligence")
    st.markdown(f"## {country}")
    st.markdown(badge(row["Article 6"], "green" if row["Article 6"]=="Operational" else "amber"),
                unsafe_allow_html=True)
    st.markdown(badge(row["Market Role"], "blue"), unsafe_allow_html=True)
    st.divider()
    for label, value in [
        ("DNA appointed",row["DNA"]),
        ("Domestic carbon market",row["Domestic Market"]),
        ("Bilateral agreements",row["Bilateral Agreements"]),
        ("Blue carbon in NDC",row["Blue Carbon NDC"]),
        ("ITMOs issued",row["ITMOs Issued"]),
    ]:
        st.markdown(f"<div class='info-line'><span class='muted'>{label}</span><b>{value}</b></div>", unsafe_allow_html=True)
    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("View Country Profile →", use_container_width=True):
        st.session_state.page = "Country Intelligence"

def project_detail(name):
    r = projects[projects.Project == name].iloc[0]
    st.markdown("### Project Intelligence")
    st.markdown(f"## {r.Project}")
    st.markdown(f"<span class='muted'>{r.Country} · {r.Ecosystem}</span>", unsafe_allow_html=True)
    st.markdown(
        badge(r.Stage,"blue") +
        badge(r["Article 6"],"teal") +
        badge(r["Investment Status"],"amber"),
        unsafe_allow_html=True
    )
    st.divider()
    for label,value in [
        ("Methodology",r.Methodology),
        ("Potential buyers",r["Potential Buyers"]),
        ("Current diagnostic",r.Diagnostic),
    ]:
        st.markdown(f"<div class='info-line'><span class='muted'>{label}</span><b>{value}</b></div>", unsafe_allow_html=True)

    st.markdown("#### Transaction pathway")
    stages = ["Feasibility","Land / tenure","Methodology","PDD","Validation","Registration","Authorization","ITMO issuance"]
    completed = {"North Sulawesi Mangrove Recovery":7, "Kaimana Mangrove Restoration":4}.get(r.Project,2)
    for i,stage in enumerate(stages):
        icon = "✓" if i < completed else ("◐" if i == completed else "○")
        color = GREEN if i < completed else (AMBER if i == completed else MUTED)
        st.markdown(f"<div style='padding:4px 0;color:{color}'><b>{icon}</b> {stage}</div>", unsafe_allow_html=True)

    st.markdown("#### Current bottlenecks")
    if "Hard" in r.Diagnostic:
        st.markdown(f"<div class='blocker-row'>{badge('Hard blocker','red')} Authorization / carbon-rights clarification</div>", unsafe_allow_html=True)
    if "Soft" in r.Diagnostic:
        st.markdown(f"<div class='blocker-row'>{badge('Soft blocker','amber')} Consultation / finance / documentation</div>", unsafe_allow_html=True)
    if r.Diagnostic == "None identified":
        st.markdown(f"{badge('No blocker identified','green')}", unsafe_allow_html=True)

# ---------- SIDEBAR ----------
with st.sidebar:
    st.markdown("""
    <div style="padding:4px 0 14px 0">
      <div class="brand">🌊 Blue Carbon</div>
      <div class="brand-sub">INTELLIGENCE PLATFORM</div>
    </div>
    """, unsafe_allow_html=True)
    st.divider()

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
    current = st.session_state.get("page","Global Overview")
    page = st.radio("Navigation", pages, index=pages.index(current) if current in pages else 0)
    st.session_state.page = page

    st.divider()
    st.markdown("**🔎 Global search**")
    st.text_input("", placeholder="Countries, projects, methods...", label_visibility="collapsed")
    st.markdown("<br>", unsafe_allow_html=True)
    st.caption("Concept prototype")
    st.caption("Facts over scores")
    st.caption("Status over ranking")

# ---------- PAGES ----------
page = st.session_state.page

if page == "Global Overview":
    header("Global Overview","A global view of blue carbon policy, markets, methodologies, projects and current developments.")
    cs = st.columns(5)
    vals = [
        ("Countries tracked","127","Current database"),
        ("Article 6 frameworks","53","Identified"),
        ("Blue carbon NDCs","36","Current submissions"),
        ("Active projects","186","Illustrative database"),
        ("Bilateral partnerships","48","Identified"),
    ]
    for c,v in zip(cs,vals):
        with c: kpi(*v)

    st.markdown("###")
    left,right = st.columns([1.65,1])

    with left:
        st.markdown("<div class='section-label'>Global enabling conditions</div>",unsafe_allow_html=True)
        mapdf = pd.DataFrame({
            "country":["Indonesia","Viet Nam","Philippines","Kenya","Korea","Japan"],
            "conditions":[7,5,5,5,7,7]
        })
        fig = go.Figure(go.Bar(
            x=mapdf.country, y=mapdf.conditions,
            marker_color=[TEAL,BLUE,BLUE,GREEN,NAVY,NAVY],
            hovertemplate="%{x}<extra></extra>"
        ))
        fig.update_layout(height=285, margin=dict(l=5,r=5,t=5,b=35),
                          paper_bgcolor=WHITE, plot_bgcolor=WHITE,
                          yaxis=dict(showgrid=True,gridcolor="#EDF1F3",title=""),
                          xaxis=dict(title=""))
        st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
        st.caption("Production version: interactive world map with country-level status indicators.")

    with right:
        st.markdown("<div class='section-label'>Latest intelligence</div>",unsafe_allow_html=True)
        for cat,country,text in news[:4]:
            st.markdown(f"<div class='card-tight'><b>{cat} · {country}</b><br><span class='small'>{text}</span></div><div style='height:6px'></div>",unsafe_allow_html=True)

    st.markdown("###")
    cards = [
        ("📜","Article 6 & Policy","Frameworks, NDCs, agreements and authorization pathways"),
        ("💰","Carbon Markets","Market status, registries and market activity"),
        ("🌿","Methodologies","Search and explore blue carbon methodologies"),
        ("📂","Projects","Status, blockers, pathways and investment context"),
    ]
    cs = st.columns(4)
    for c,(icon,title,desc) in zip(cs,cards):
        with c:
            st.markdown(f"<div class='card'><div style='font-size:22px'>{icon}</div><h3>{title}</h3><div class='small'>{desc}</div></div>",unsafe_allow_html=True)

elif page == "Global Enabling Conditions Map":
    header("Global Enabling Conditions Map","Explore what is currently present or in development across countries. No composite readiness score.")
    left,main,right = st.columns([.75,2.0,.9])
    with left:
        st.markdown("<div class='section-label'>Filters</div>",unsafe_allow_html=True)
        for x in ["DNA appointed","Article 6 framework","Domestic carbon market","Bilateral agreement","Blue carbon in NDC","ITMOs issued","Active projects"]:
            st.checkbox(x)
        st.selectbox("Market role",["All","Project Host","Potential ITMO Supplier","Carbon Buyer","Article 6 Partner"])
    with main:
        mapdf = pd.DataFrame({
            "iso":["IDN","VNM","PHL","KEN","KOR","JPN"],
            "Country":["Indonesia","Viet Nam","Philippines","Kenya","Republic of Korea","Japan"],
            "status":[7,5,5,5,7,7]
        })
        fig = px.choropleth(mapdf,locations="iso",color="status",hover_name="Country",
                            color_continuous_scale=[PALE_BLUE,TEAL,GREEN])
        fig.update_layout(height=520,margin=dict(l=0,r=0,t=0,b=0),coloraxis_showscale=False,
                          paper_bgcolor=BG)
        st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
    with right:
        country_panel("Indonesia")

elif page == "Country Intelligence":
    header("Country Intelligence","The central country profile. Accessible from the map, search and country references across the platform.")
    country = st.selectbox("Country",countries.Country.tolist())
    r = countries[countries.Country==country].iloc[0]
    cs=st.columns(5)
    for c,(l,v,n) in zip(cs,[
        ("Article 6",r["Article 6"],"Current status"),
        ("DNA",r["DNA"],"Current status"),
        ("Domestic market",r["Domestic Market"],"Current status"),
        ("Bilateral agreements",r["Bilateral Agreements"],"Current status"),
        ("ITMOs issued",r["ITMOs Issued"],"Current status"),
    ]):
        with c:kpi(l,v,n)
    a,b=st.columns([1.45,1])
    with a:
        st.markdown("<div class='section-label'>Country timeline</div>",unsafe_allow_html=True)
        timeline=pd.DataFrame({
            "Year":[2021,2023,2025,2026],
            "Development":["Carbon policy foundation","Institutional development","Article 6 framework update","Project / market implementation"]
        })
        st.dataframe(timeline,use_container_width=True,hide_index=True)
        st.markdown("<div class='section-label'>Blue carbon context</div>",unsafe_allow_html=True)
        st.markdown("<div class='card'>Mangroves · Seagrass · Salt marsh<br><br><span class='small'>Blue carbon commitments, policy, ecosystem data and project pipeline can be expanded here.</span></div>",unsafe_allow_html=True)
    with b: country_panel(country)

elif page == "Article 6 & Policy":
    header("Article 6 & Policy Explorer","National frameworks, NDC commitments, bilateral cooperation and authorization conditions.")
    cs=st.columns(5)
    for c,v in zip(cs,[("Frameworks","53","Identified"),("DNAs","127","Countries tracked"),("Bilateral agreements","48","Identified"),("Blue carbon NDCs","36","Countries"),("ITMOs issued","8","Illustrative")]):
        with c:kpi(*v)
    st.markdown("###")
    st.dataframe(countries[["Country","Article 6","DNA","Domestic Market","Bilateral Agreements","Blue Carbon NDC","ITMOs Issued"]],use_container_width=True,hide_index=True)
    st.markdown(f"<div class='callout'><b>Design principle:</b> status indicators show what is currently present or in development. They do not rank countries or calculate readiness scores.</div>",unsafe_allow_html=True)

elif page == "Carbon Markets":
    header("Carbon Markets Explorer","A neutral market-information view covering domestic markets, Article 6 activity, registries and trading infrastructure.")
    cs=st.columns(5)
    for c,v in zip(cs,[("Operational markets","41","Illustrative"),("Developing markets","22","Illustrative"),("Registries tracked","58","Database"),("Article 6 markets","31","Identified"),("Blue carbon activity","19","Projects / markets")]):
        with c:kpi(*v)
    st.markdown("### Market directory")
    st.dataframe(countries[["Country","Domestic Market","Article 6","Bilateral Agreements","Market Role"]],use_container_width=True,hide_index=True)
    st.markdown("### Recent market developments")
    for cat,country,text in news:
        if cat in ["Market","Agreement"]:
            st.markdown(f"<div class='card-tight'><b>{country}</b><br>{text}</div><br>",unsafe_allow_html=True)

elif page == "Methodologies":
    header("Blue Carbon Methodologies Explorer","A searchable explorer organised around the questions users actually ask.")
    a,b,c,d=st.columns(4)
    ecosystem=a.selectbox("Ecosystem",["All","Mangrove","Seagrass","Salt marsh"])
    standard=b.selectbox("Standard",["All","Verra","JCM","National"])
    article6=c.selectbox("Article 6 eligible",["All","Potential","No"])
    corsia=d.selectbox("CORSIA eligible",["All","Potential","No"])
    search=st.text_input("Search methodology",placeholder="Search by name, ecosystem or activity…")
    df=methodologies.copy()
    if ecosystem!="All":df=df[df.Ecosystem.str.contains(ecosystem,case=False,na=False)]
    if standard!="All":df=df[df.Standard==standard]
    if search:df=df[df.apply(lambda x: search.lower() in " ".join(x.astype(str)).lower(),axis=1)]
    st.dataframe(df,use_container_width=True,hide_index=True)
    selected=st.selectbox("Open methodology",methodologies.Methodology.tolist())
    r=methodologies[methodologies.Methodology==selected].iloc[0]
    st.markdown(f"<div class='card'><h3>{r.Methodology}</h3><span class='muted'>{r.Standard} · {r.Ecosystem}</span><hr><b>Activity:</b> {r.Activity}<br><b>Article 6:</b> {r['Article 6']}<br><b>CORSIA:</b> {r.CORSIA}<br><b>Country applicability:</b> {r['Country Applicability']}</div>",unsafe_allow_html=True)

elif page == "Projects":
    header("Projects Explorer","Real project activity, current status, transaction pathways, hard blockers and soft blockers.")
    cs=st.columns(5)
    for c,v in zip(cs,[("Projects tracked","186","Illustrative"),("In validation","38","Pipeline"),("Seeking finance","52","Identified"),("Hard blockers","17","Diagnostic flags"),("Near issuance","12","Illustrative")]):
        with c:kpi(*v)
    f1,f2,f3,f4=st.columns(4)
    country=f1.selectbox("Country",["All"]+sorted(projects.Country.unique()))
    eco=f2.selectbox("Ecosystem",["All"]+sorted(projects.Ecosystem.unique()))
    stage=f3.selectbox("Project stage",["All"]+sorted(projects.Stage.unique()))
    art=f4.selectbox("Article 6",["All","Potential","Yes"])
    df=projects.copy()
    if country!="All":df=df[df.Country==country]
    if eco!="All":df=df[df.Ecosystem==eco]
    if stage!="All":df=df[df.Stage==stage]
    if art!="All":df=df[df["Article 6"]==art]
    st.dataframe(df,use_container_width=True,hide_index=True)
    selected=st.selectbox("Open project",projects.Project.tolist())
    a,b=st.columns([1.25,.9])
    with a:
        st.markdown("<div class='card'><h3>Project status</h3><div class='small'>CAAS-inspired diagnostic approach — no composite score.</div><br>Hard blockers and soft blockers are surfaced explicitly, alongside the transaction pathway and next actions.</div>",unsafe_allow_html=True)
    with b: project_detail(selected)

elif page == "News & Intelligence":
    header("News & Intelligence Explorer","Monitor developments and understand what has changed across policy, markets, projects, methodologies and bilateral activity.")
    cat=st.selectbox("Category",["All","Policy","Project","Market","Methodology","Agreement"])
    items=news if cat=="All" else [x for x in news if x[0]==cat]
    for ctry_cat,country,text in items:
        st.markdown(f"<div class='card-tight'><b>{ctry_cat} · {country}</b><br>{text}<br><span class='small'>Latest intelligence · source verification required</span></div><div style='height:7px'></div>",unsafe_allow_html=True)
    st.markdown("### AI-assisted processing")
    st.markdown(f"<div class='callout'>AI could help identify new information, extract structured fields, summarise what changed, link updates to countries and projects, and flag records that require human verification.</div>",unsafe_allow_html=True)

elif page == "Marine Spatial Planning":
    header("Marine Spatial Planning","Explore coastal and marine conditions and assess whether a selected area may support a blue carbon project.")
    st.markdown("""
    <div class="card-tight">
      <b>Assessment workflow</b>&nbsp;&nbsp;
      <span class="status s-blue">1. Select area</span>
      <span class="status s-blue">2. Assess area</span>
      <span class="status s-teal">3. Review results</span>
      <span class="status s-green">4. Generate report</span>
    </div>
    <br>
    """,unsafe_allow_html=True)

    left,main,right=st.columns([.72,2.0,.95])
    with left:
        st.markdown("<div class='section-label'>Map layers</div>",unsafe_allow_html=True)
        for layer in ["Mangroves","Seagrass","Salt marsh","Existing projects","Protected areas","MSP zones","Restoration opportunity","Infrastructure"]:
            st.checkbox(layer,value=layer in ["Mangroves","Existing projects","MSP zones"])
        st.markdown("<div class='section-label'>Tools</div>",unsafe_allow_html=True)
        st.button("＋ Draw area",use_container_width=True)
        st.button("⇧ Upload boundary",use_container_width=True)

    with main:
        # Stylised coastal map with ecosystem areas + 3 active project footprints.
        fig=go.Figure()

        # Illustrative mangrove/coastal polygons
        polygons=[
            ([135.0,135.5,136.0,135.8,135.2],[ -2.0,-2.2,-2.5,-2.8,-2.4],"Mangrove opportunity"),
            ([136.1,136.5,136.8,136.4],[ -1.7,-1.9,-2.2,-2.5],"Seagrass"),
        ]
        for lon,lat,name in polygons:
            fig.add_trace(go.Scattermap(
                lon=lon+[lon[0]],lat=lat+[lat[0]],mode="lines",
                fill="toself",name=name,
                line=dict(width=1,color=GREEN if "Mangrove" in name else TEAL),
                fillcolor="rgba(75,154,104,.28)" if "Mangrove" in name else "rgba(21,154,156,.22)"
            ))

        # Selected assessment area
        sel_lon=[135.25,136.10,136.35,135.65,135.25]
        sel_lat=[-2.15,-2.25,-2.75,-2.95,-2.15]
        fig.add_trace(go.Scattermap(
            lon=sel_lon,lat=sel_lat,mode="lines",fill="toself",name="Selected assessment area",
            line=dict(width=3,color=BLUE),fillcolor="rgba(46,120,167,.13)"
        ))

        # Three active projects with approximate footprints
        project_centres=[(135.45,-2.35,"Project A","1,250 ha"),(135.95,-2.52,"Project B","680 ha"),(136.25,-2.10,"Project C","410 ha")]
        for lon,lat,name,area in project_centres:
            fig.add_trace(go.Scattermap(
                lon=[lon],lat=[lat],mode="markers+text",text=[name],textposition="top center",
                marker=dict(size=13,color=AMBER),name=f"{name} ({area})",
                hovertext=f"{name}<br>Active project footprint: {area}",hoverinfo="text"
            ))

        fig.update_layout(
            map=dict(style="open-street-map",center=dict(lat=-2.35,lon=135.8),zoom=5.2),
            height=575,margin=dict(l=0,r=0,t=0,b=0),
            legend=dict(orientation="h",y=1.02,x=0)
        )
        st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":True})
        st.caption("Illustrative concept. Production should use authoritative MSP, ecosystem, project and planning datasets.")

    with right:
        st.markdown("### Selected area")
        kpi("Area","14,250 ha","Illustrative selection")
        st.markdown("<div class='section-label'>Opportunities</div>",unsafe_allow_html=True)
        st.markdown(badge("Ecosystem present","green"),unsafe_allow_html=True)
        st.markdown(badge("Methodology available","green"),unsafe_allow_html=True)
        st.markdown(badge("Article 6 pathway possible","blue"),unsafe_allow_html=True)
        st.markdown("<div class='section-label'>Constraints</div>",unsafe_allow_html=True)
        st.markdown(badge("Protected-area overlap","red"),unsafe_allow_html=True)
        st.markdown(badge("Tenure verification","amber"),unsafe_allow_html=True)
        st.markdown("<div class='section-label'>Active projects</div>",unsafe_allow_html=True)
        for name,area in [("Project A","1,250 ha"),("Project B","680 ha"),("Project C","410 ha")]:
            st.markdown(f"<div class='info-line'><span>{name}</span><b>{area}</b></div>",unsafe_allow_html=True)
        st.markdown("<div class='section-label'>Next steps</div>",unsafe_allow_html=True)
        st.write("Verify tenure and MSP compatibility; confirm community requirements; assess methodology and Article 6 pathway.")
        st.button("Save area",use_container_width=True)
        st.button("Generate assessment report",use_container_width=True)

st.markdown("<div class='footer-note'>Blue Carbon Intelligence · Concept prototype · Illustrative data only · Replace with verified source data before production use.</div>",unsafe_allow_html=True)
