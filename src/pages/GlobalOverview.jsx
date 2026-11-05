import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Badge from '../components/Badge';
import { StdIcon, MktIcon } from '../components/Icons';
import Donut from '../components/Donut';
import WorldMap from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, projects, news, markets, methodologies, bilateral, STATUS_COLS } from '../data';

const NEWS_TABS = ['Latest News', 'Regulatory Updates', 'New Projects', 'Agreements'];
const NEWS_TAB_GROUPS = {
  'Latest News': null,
  'Regulatory Updates': ['POLICY', 'REGULATION'],
  'New Projects': ['PROJECT'],
  Agreements: ['AGREEMENT'],
};

export default function GlobalOverview() {
  const navigate = useNavigate();
  const { t, selectedCountry, setSelectedCountry, newsTab, setNewsTab } = useApp();
  const [mapLayer, setMapLayer] = useState('DNA appointed');
  const layerField = STATUS_COLS[mapLayer];

  // Every figure below is computed live from this sample's own sourced data
  // (10 tracked countries) rather than hardcoded — these cards used to show
  // illustrative "global" numbers (e.g. "127 of 193 UNFCCC Parties") that
  // had no source anywhere in the dataset. Scoping to the tracked sample
  // means every number here is as defensible as the Country Explorer data
  // it's drawn from; a true 193-country global tally would need a separate
  // research pass against primary sources like the UNFCCC DNA/Article 6
  // registries, not a quick recomputation (see data source inventory doc).
  const totalCountries = countries.length;
  const countDna = countries.filter((c) => c.dna_appointed === 'Implemented').length;
  const countA6 = countries.filter((c) => c.article6_framework === 'Implemented').length;
  const countBilateral = countries.filter((c) => c.bilateral_agreements === 'Implemented').length;
  const countMarket = countries.filter((c) => c.domestic_carbon_market === 'Implemented').length;
  const countNdc = countries.filter((c) => c.blue_carbon_ndc === 'Implemented').length;
  const countItmo = countries.filter((c) => c.itmos_issued === 'Transfer Completed').length;
  const projectCountries = new Set(projects.map((p) => p.country)).size;

  const STAT_CELLS = [
    ['👤', t('globalOverview.statDna'), `${countDna}/${totalCountries}`, t('globalOverview.statDnaNote'), '/map'],
    ['📜', t('globalOverview.statA6'), `${countA6}/${totalCountries}`, t('globalOverview.statA6Note'), '/markets'],
    ['🤝', t('globalOverview.statBilateral'), `${countBilateral}/${totalCountries}`, t('globalOverview.statBilateralNote', { n: bilateral.length }), '/markets'],
    ['🏛', t('globalOverview.statMarket'), `${countMarket}/${totalCountries}`, t('globalOverview.statMarketNote'), '/markets'],
    ['🌿', t('globalOverview.statNdc'), `${countNdc}/${totalCountries}`, t('globalOverview.statNdcNote'), '/markets'],
    ['🧾', t('globalOverview.statItmo'), `${countItmo}/${totalCountries}`, t('globalOverview.statItmoNote'), '/map?layer=itmos_issued'],
    ['🌊', t('globalOverview.statProjects'), `${projects.length}`, t('globalOverview.statProjectsNote', { n: projectCountries }), '/projects'],
  ];

  const NEWS_TAB_LABELS = {
    'Latest News': t('globalOverview.newsTabLatest'),
    'Regulatory Updates': t('globalOverview.newsTabRegulatory'),
    'New Projects': t('globalOverview.newsTabProjects'),
    Agreements: t('globalOverview.newsTabAgreements'),
  };

  const QUICK_ACCESS = [
    ['🌍', t('globalOverview.qaCountryTitle'), t('globalOverview.qaCountrySub'), '/country'],
    ['📂', t('globalOverview.qaProjectTitle'), t('globalOverview.qaProjectSub'), '/projects'],
    ['📜', t('globalOverview.qaPolicyTitle'), t('globalOverview.qaPolicySub'), '/markets'],
    ['🌊', t('globalOverview.qaMspTitle'), t('globalOverview.qaMspSub'), '/msp'],
    ['📄', t('globalOverview.qaDocsTitle'), t('globalOverview.qaDocsSub'), null],
    ['↓', t('globalOverview.qaDownloadTitle'), t('globalOverview.qaDownloadSub'), null],
  ];

  const goCountry = (name) => {
    setSelectedCountry(name);
    navigate('/country');
  };

  const marketGroups = {};
  markets.forEach((m) => {
    if (!marketGroups[m.market_type]) marketGroups[m.market_type] = [];
    marketGroups[m.market_type].push(m);
  });

  const activeNewsTypes = NEWS_TAB_GROUPS[newsTab];
  const shownNews = (activeNewsTypes ? news.filter((n) => activeNewsTypes.includes(n.type)) : news)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <>
      <Topbar />

      <div className="section">{t('globalOverview.backgroundSection')}</div>
      <div className="card pad">
        <div className="title">{t('globalOverview.backgroundTitle')}</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          Blue carbon markets have developed over roughly the past 15 years, as coastal carbon science matured
          and climate finance mechanisms expanded to recognize mangroves, seagrasses and tidal marshes alongside
          more established forest-carbon approaches. Early blue carbon methodologies — Verra's VM0033, approved
          in 2015, chief among them — opened the door to verified mangrove restoration and conservation projects,
          and momentum built further after the Paris Agreement's Article 6 (2015) created a framework for
          countries to cooperate internationally on emission reductions, including blue carbon, across borders.
        </div>
        <div className="sub" style={{ marginTop: 10, lineHeight: 1.6 }}>
          This platform tracks how that landscape is developing, country by country and project by project —
          domestic carbon markets and Article 6 authorization status, individual mangrove and seagrass projects,
          and the methodologies that underpin them.
        </div>
        <button className="btn" style={{ marginTop: 10 }} onClick={() => navigate('/documents')}>
          {t('globalOverview.backgroundLink')}
        </button>
      </div>

      <div className="search-row">
        <select
          className="select-input"
          style={{ flex: 3, marginBottom: 0 }}
          value=""
          onChange={(e) => e.target.value && goCountry(e.target.value)}
        >
          <option value="">{t('globalOverview.searchPlaceholder')}</option>
          {countries.map((c) => (
            <option key={c.iso} value={c.country}>{c.country}</option>
          ))}
        </select>
        <button className="search-btn" onClick={() => goCountry(selectedCountry)}>
          {t('globalOverview.countryView')}
        </button>
      </div>

      <div className="ov-stats">
        {STAT_CELLS.map(([icon, label, num, noteText, target]) => (
          <button className="ov-stat" key={label} onClick={() => navigate(target)}>
            <div className="ov-stat-icon">{icon}</div>
            <div className="ov-stat-label">{label}</div>
            <div className="ov-stat-num">{num}</div>
            <div className="ov-stat-note">{noteText}</div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button className="btn" onClick={() => navigate('/map')}>{t('globalOverview.viewAllCountries')}</button>
      </div>

      <div className="live">
        <b>{t('globalOverview.liveIntelligence')}</b> &nbsp;&nbsp; {t('globalOverview.liveIntelligenceSub')}
      </div>

      <div className="section">{t('globalOverview.sectionMap')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.72fr .82fr', gap: 16 }}>
        <div>
          <div className="card pad">
            <div className="title">{t('globalOverview.mapCardTitle')}</div>
            <div className="sub">{t('globalOverview.mapCardSub')}</div>
          </div>
          <select
            className="select-input"
            style={{ marginTop: 8, width: '100%' }}
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value)}
          >
            {Object.keys(STATUS_COLS).map((k) => <option key={k} value={k}>{t(`statusCols.${k}`)}</option>)}
          </select>
          <WorldMap
            countries={countries}
            statusField={layerField}
            onSelect={setSelectedCountry}
            selectedIso={countries.find((c) => c.country === selectedCountry)?.iso}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <select
              className="select-input"
              style={{ flex: 1, marginBottom: 0 }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((c) => <option key={c.iso}>{c.country}</option>)}
            </select>
            <button className="btn" style={{ marginTop: 0 }} onClick={() => goCountry(selectedCountry)}>
              {t('globalOverview.openCountryProfile')}
            </button>
          </div>
          <div className="sub" style={{ marginTop: 6 }}>
            {t('globalOverview.geographyNote')}
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="pad" style={{ paddingBottom: 0 }}>
            <div className="title">{t('globalOverview.latestIntelligence')}<span className="card-link" onClick={() => navigate('/news')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.latestIntelligenceSub')}</div>
          </div>
          <div style={{ display: 'flex', gap: 4, padding: '10px 14px 0' }}>
            {NEWS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setNewsTab(tab)}
                style={{
                  flex: 1,
                  fontSize: '.55rem',
                  padding: '6px 4px',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 700,
                  background: newsTab === tab ? '#0B3150' : '#EEF2F4',
                  color: newsTab === tab ? 'white' : '#6E7F8A',
                }}
              >
                {NEWS_TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            {shownNews.map((n, i) => (
              <div className="news-item" key={i}>
                <span className="tag">{n.type}</span>
                <span className="date">{n.date}</span>
                <div className="headline">{n.headline}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">{t('globalOverview.sectionGlance')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div>
          <div className="card pad">
            <div className="title">{t('globalOverview.methodologiesTitle')}<span className="card-link" onClick={() => navigate('/methodologies')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.methodologiesSub')}</div>
            {methodologies.slice(0, 5).map((m) => (
              <div className="mini-row" key={m.name}>
                <div className="mini-row-main">
                  <StdIcon standard={m.standard} />
                  <span className="mini-row-title">{m.name}</span>
                  <div className="mini-row-sub" style={{ marginLeft: 27 }}>{m.standard}</div>
                </div>
                <Badge value={m.status} />
              </div>
            ))}
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/methodologies')}>
            {t('globalOverview.seeAllMethodologies')}
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">{t('globalOverview.ndcTitle')}<span className="card-link" onClick={() => navigate('/markets')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.ndcSub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <div>
                <div className="donut-label">{t('globalOverview.ndcIncludedLabel')}</div>
                <Donut pct={Math.round((countNdc / totalCountries) * 100)} centerNum={`${countNdc}/${totalCountries}`} centerLabel={t('globalOverview.countriesLabel')} color="#2478A6" />
                <div className="donut-note">{t('globalOverview.ndcIncludedNote')}</div>
              </div>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/markets')}>
            {t('globalOverview.exploreArticle6')}
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">{t('globalOverview.marketTitle')}<span className="card-link" onClick={() => navigate('/markets')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.marketSub')}</div>
            {Object.entries(marketGroups).map(([mtype, grp]) => {
              const op = grp.filter((g) => g.status === 'Operational').length;
              const countriesN = new Set(grp.map((g) => g.country)).size;
              return (
                <div className="mini-row" key={mtype}>
                  <div className="mini-row-main">
                    <MktIcon marketType={mtype} />
                    <span className="mini-row-title">{mtype}</span>
                    <div className="mini-row-sub" style={{ marginLeft: 30 }}>{countriesN} {t('globalOverview.countriesLabel')}</div>
                  </div>
                  <Badge value={op === grp.length ? 'Implemented' : 'In Development'} />
                </div>
              );
            })}
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/markets')}>
            {t('globalOverview.goToMarketDashboard')}
          </button>
        </div>
      </div>

      <div className="section">{t('globalOverview.sectionQuickAccess')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {QUICK_ACCESS.map(([icon, title, sub, target]) => (
          <div key={title}>
            <div className="qa-card">
              <div className="qa-icon">{icon}</div>
              <div className="qa-title">{title}</div>
              <div className="qa-sub">{sub}</div>
            </div>
            {target && (
              <button
                className="btn"
                style={{ width: '100%', textAlign: 'center', marginTop: 6 }}
                onClick={() => (target === '/country' ? goCountry(selectedCountry) : navigate(target))}
              >
                {t('globalOverview.open')}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
