import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(page_title="Blue Carbon Intelligence", page_icon="🌊", layout="wide")

# ---------- VISUAL SYSTEM ----------
NAVY="#0D3150"; NAVY_DARK="#08263F"; BLUE="#2E79A8"; TEAL="#159A9C"
GREEN="#4B9A68"; AMBER="#D99036"; RED="#C65B5B"; BG="#F3F7F9"
WHITE="#FFFFFF"; BORDER="#D9E4E9"; INK="#203746"; MUTED="#6D7D88"

st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
html,body,[class*="css"]{{font-family:'DM Sans',Arial,sans-serif;color:{INK};}}
.stApp{{background:{BG};}}
.block-container{{max-width:1540px;padding:0 1.4rem 2rem;}}
[data-testid="stSidebar"]{{background:{NAVY_DARK};min-width:245px;max-width:245px;}}
[data-testid="stSidebar"] *{{color:#F4F8FB!important;}}
[data-testid="stSidebar"] label{{padding:7px 9px!important;border-radius:7px;font-size:.82rem;}}
.top{{height:64px;margin:0 -1.4rem 1.1rem;padding:0 1.5rem;background:white;border-bottom:1px solid {BORDER};display:flex;align-items:center;justify-content:space-between;}}
.logo{{display:flex;align-items:center;gap:10px;}}
.mark{{width:34px;height:34px;border-radius:50%;background:{NAVY};color:white;display:flex;align-items:center;justify-content:center;}}
.brand{{font-weight:700;font-size:17px;color:{NAVY};}}
.subbrand{{font-size:9px;letter-spacing:.14em;color:{MUTED};text-transform:uppercase;}}
.search,.pill{{border:1px solid {BORDER};border-radius:8px;padding:8px 12px;color:{MUTED};font-size:.72rem;display:inline-block;margin-left:7px;}}
.pill{{background:#EAF4F8;color:{NAVY};font-weight:600;}}
.hero{{background:linear-gradient(110deg,{NAVY_DARK},{NAVY} 65%,#164D70);border-radius:14px;padding:28px 31px;color:white;min-height:205px;}}
.kicker{{color:#A9D9D5;text-transform:uppercase;letter-spacing:.13em;font-size:.67rem;font-weight:600;}}
.hero-title{{font-family:'Playfair Display',Georgia,serif;font-size:2.25rem;line-height:1.08;margin:9px 0;}}
.hero-title em{{color:#8FD0B0;}}
.hero-copy{{color:#D1E0E8;font-size:.82rem;line-height:1.55;max-width:600px;}}
.hero-btn{{display:inline-block;background:{GREEN};padding:9px 14px;border-radius:7px;font-size:.74rem;font-weight:700;margin-top:14px;}}
.stats{{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.12);border-radius:10px;overflow:hidden;}}
.stat{{padding:17px;background:rgba(255,255,255,.055);min-height:90px;}}
.num{{font-family:'Playfair Display';font-size:1.65rem;}}
.lab{{font-size:.61rem;text-transform:uppercase;letter-spacing:.07em;color:#BFD2DE;}}
.note{{font-size:.63rem;color:#91B0BF;margin-top:4px;}}
.live{{margin-top:11px;background:#0F3856;color:#D5E6EE;border-radius:7px;padding:7px 12px;font-size:.66rem;}}
.section{{text-transform:uppercase;letter-spacing:.1em;color:{MUTED};font-size:.66rem;font-weight:700;margin:19px 0 7px;}}
.card{{background:white;border:1px solid {BORDER};border-radius:11px;padding:15px 17px;box-shadow:0 2px 8px rgba(20,50,70,.025);}}
.title{{color:{NAVY};font-weight:700;font-size:.93rem;}}
.cardsub{{color:{MUTED};font-size:.71rem;margin-top:3px;line-height:1.45;}}
.news{{padding:10px 0;border-bottom:1px solid #EDF1F3;}}
.tag{{display:inline-block;font-size:.58rem;padding:3px 6px;border-radius:5px;background:#EAF4F8;color:{BLUE};font-weight:700;}}
.date{{color:{MUTED};font-size:.60rem;margin-left:6px;}}
.headline{{font-size:.73rem;font-weight:600;line-height:1.4;margin-top:5px;}}
.signal{{font-size:1.7rem;color:{NAVY};font-weight:700;margin-top:11px;}}
.badge{{display:inline-block;padding:4px 7px;border-radius:13px;font-size:.59rem;font-weight:700;margin:5px 3px 0 0;}}
.g{{background:#E0F0E5;color:#2D7546}} .b{{background:#EAF4F8;color:#285F84}}
.t{{background:#E7F5F5;color:#167779}} .a{{background:#FFF1DD;color:#95601E}}
.r{{background:#FBEAEA;color:#A13F3F}}
.quick{{background:white;border:1px solid {BORDER};border-radius:10px;padding:12px;text-align:center;}}
.qicon{{font-size:18px}} .qtitle{{font-size:.68rem;font-weight:700;color:{NAVY};margin-top:4px}} .qsub{{font-size:.59rem;color:{MUTED}}}
.stButton>button{{border:1px solid {BORDER};border-radius:7px;background:white;color:{NAVY};font-weight:600;}}
</style>
""", unsafe_allow_html=True)

# ---------- DATA ----------
countries = pd.DataFrame({
"iso":["IDN","VNM","PHL","KEN","KOR","JPN","AUS","BRA","MEX","CRI","CHL"],
"Country":["Indonesia","Viet Nam","Philippines","Kenya","Republic of Korea","Japan","Australia","Brazil","Mexico","Costa Rica","Chile"],
"Status":[7,5,5,5,7,7,5,4,4,4,4]})
news=[
("POLICY","14 NOV 2025","Indonesia submits Second NDC with new blue carbon targets"),
("REGULATION","12 NOV 2025","Article 6 authorization framework update"),
("AGREEMENT","10 NOV 2025","Indonesia–Japan cooperation implementation update"),
("MARKET","07 NOV 2025","Voluntary carbon market shows signs of stabilization")]

# ---------- HEADER ----------
st.markdown("""
<div class="top">
 <div class="logo"><div class="mark">≈</div><div><div class="brand">BLUE CARBON</div><div class="subbrand">Intelligence</div></div></div>
 <div><span class="search">⌕ &nbsp; Search countries, projects, news...</span><span class="pill">GLOBAL ▾</span><span class="pill">COUNTRY VIEW →</span></div>
</div>
""",unsafe_allow_html=True)

# ---------- SIDEBAR ----------
with st.sidebar:
    st.markdown("<div style='font-size:17px;font-weight:700'>BLUE CARBON</div><div style='font-size:9px;letter-spacing:.13em;color:#AFC8D6'>INTELLIGENCE PLATFORM</div>",unsafe_allow_html=True)
    st.divider()
    st.markdown("<div style='font-size:.63rem;letter-spacing:.1em;color:#9EB9C8'>GLOBAL INTELLIGENCE</div>",unsafe_allow_html=True)
    pages=["Global Overview","Global Enabling Conditions Map","Article 6 & Policy","Carbon Markets","Methodologies","Projects","News & Intelligence","Marine Spatial Planning"]
    current=st.session_state.get("page","Global Overview")
    st.session_state.page=st.radio("Navigation",pages,index=pages.index(current))
    st.divider()
    st.markdown("<div style='font-size:.63rem;letter-spacing:.1em;color:#9EB9C8'>RESOURCES</div>",unsafe_allow_html=True)
    for x in ["Documents Library","Data & Reports","Glossary","About the Platform"]: st.caption(x)

page=st.session_state.page

# ---------- GLOBAL OVERVIEW ----------
if page=="Global Overview":
    L,R=st.columns([1.05,.95],gap="large")
    with L:
        st.markdown("""<div class="hero">
        <div class="kicker">ARTICLE 6 · ITMO · BLUE CARBON MARKETS</div>
        <div class="hero-title">Blue carbon<br><em>market intelligence</em></div>
        <div class="hero-copy">A single platform bringing together Article 6 enabling conditions, blue carbon commitments, methodologies, market activity and project intelligence.</div>
        <span class="hero-btn">Explore the map →</span>
        </div>""",unsafe_allow_html=True)
    with R:
        st.markdown("""<div class="hero" style="padding:17px"><div class="stats">
        <div class="stat"><div class="num">127</div><div class="lab">Countries tracked</div><div class="note">Article 6 universe</div></div>
        <div class="stat"><div class="num">36</div><div class="lab">Blue carbon in NDCs</div><div class="note">Current submissions</div></div>
        <div class="stat"><div class="num">53</div><div class="lab">Article 6 frameworks</div><div class="note">Operational / adopted</div></div>
        <div class="stat"><div class="num">186</div><div class="lab">Projects tracked</div><div class="note">Illustrative database</div></div>
        </div></div>""",unsafe_allow_html=True)

    st.markdown("<div class='live'><b style='color:#8FD0B0'>● LIVE INTELLIGENCE</b> &nbsp; Indonesia–Japan Article 6 cooperation · Blue carbon NDC developments · Project pipeline updates · Methodology developments</div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Global market intelligence</div>",unsafe_allow_html=True)
    M,N=st.columns([1.7,.82],gap="medium")
    with M:
        st.markdown("<div class='card'><div class='title'>Global enabling conditions</div><div class='cardsub'>Explore the status of key Article 6 and blue carbon conditions across countries.</div></div>",unsafe_allow_html=True)
        fig=px.choropleth(countries,locations="iso",color="Status",hover_name="Country",color_continuous_scale=["#E7EEF2","#C8E5D3","#5DA977","#167A52"])
        fig.update_layout(height=360,margin=dict(l=0,r=0,t=0,b=0),coloraxis_showscale=False,
                          geo=dict(showframe=False,showcoastlines=False,bgcolor="#EAF4F8",projection_type="natural earth"))
        st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
        st.markdown("<div style='text-align:center;font-size:.62rem;color:#697B86'>● Implemented &nbsp;&nbsp; <span style='color:#159A9C'>● In development</span> &nbsp;&nbsp; <span style='color:#D99036'>● Planned</span> &nbsp;&nbsp; ● Not available</div>",unsafe_allow_html=True)
    with N:
        st.markdown("<div class='card'><div class='title'>Latest Intelligence <span style='float:right;color:#2E79A8;font-size:.66rem'>View all →</span></div><div class='cardsub'>Policy, regulation, projects, markets and agreements.</div>",unsafe_allow_html=True)
        for tag,date,headline in news:
            st.markdown(f"<div class='news'><span class='tag'>{tag}</span><span class='date'>{date}</span><div class='headline'>{headline} <span style='float:right;color:{BLUE}'>→</span></div></div>",unsafe_allow_html=True)
        st.markdown("</div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Explore the intelligence</div>",unsafe_allow_html=True)
    cards=[("📜","Article 6 & Policy","Frameworks, NDCs, bilateral agreements and authorization pathways.","Article 6 & Policy"),
           ("💰","Carbon Markets","Domestic markets, Article 6 activity, registries and market infrastructure.","Carbon Markets"),
           ("🌿","Blue Carbon Methodologies","Recognized methods, ecosystem coverage and market applicability.","Methodologies"),
           ("📂","Projects","Project stage, transaction pathway, blockers and next actions.","Projects")]
    cols=st.columns(4)
    for c,(icon,title,desc,target) in zip(cols,cards):
        with c:
            st.markdown(f"<div class='card' style='min-height:140px'><div style='font-size:20px'>{icon}</div><div class='title' style='margin-top:7px'>{title}</div><div class='cardsub'>{desc}</div></div>",unsafe_allow_html=True)
            if st.button("Open →",key=target,use_container_width=True):
                st.session_state.page=target; st.rerun()

    st.markdown("<div class='section'>Key market signals</div>",unsafe_allow_html=True)
    signals=[("Blue carbon in NDCs","36","24 unconditional","36 conditional / mixed","g","b"),
             ("Article 6 cooperation","48","17 buyer countries","28 signed","t","g"),
             ("Project pipeline","186","52 seeking finance","17 hard blockers","a","r")]
    cols=st.columns(3)
    for c,(title,num,b1,b2,k1,k2) in zip(cols,signals):
        with c:
            st.markdown(f"<div class='card'><div class='title'>{title}</div><div class='cardsub'>Current platform signal</div><div class='signal'>{num}</div><div class='cardsub'>countries / records identified</div><span class='badge {k1}'>{b1}</span><span class='badge {k2}'>{b2}</span></div>",unsafe_allow_html=True)

    st.markdown("<div class='section'>Quick access</div>",unsafe_allow_html=True)
    q=[("🌍","Country Profiles","Country context"),("📂","Project Pipeline","Find projects"),("📜","Policy & Frameworks","Laws & policies"),("🌊","Spatial Explorer","MSP & ecosystems"),("📄","Documents Library","Reports & data"),("↓","Data Download","Access datasets")]
    cols=st.columns(6)
    for c,(ic,t,s) in zip(cols,q):
        with c: st.markdown(f"<div class='quick'><div class='qicon'>{ic}</div><div class='qtitle'>{t}</div><div class='qsub'>{s}</div></div>",unsafe_allow_html=True)

else:
    titles={"Global Enabling Conditions Map":"Global Enabling Conditions Map","Article 6 & Policy":"Article 6 & Policy Explorer","Carbon Markets":"Carbon Markets Explorer","Methodologies":"Blue Carbon Methodologies Explorer","Projects":"Projects Explorer","News & Intelligence":"News & Intelligence Explorer","Marine Spatial Planning":"Marine Spatial Planning"}
    st.title(titles[page])
    st.markdown("<div class='card'><div class='title'>Visual refinement in progress</div><div class='cardsub'>This section remains part of the agreed platform architecture. We will carry the same visual system from the Global Overview into each page one at a time.</div></div>",unsafe_allow_html=True)

st.markdown("<div style='text-align:center;color:#71808B;font-size:.65rem;padding-top:16px'>Blue Carbon Intelligence · Visual concept prototype · Illustrative data only</div>",unsafe_allow_html=True)
