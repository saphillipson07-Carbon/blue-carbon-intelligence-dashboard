import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Badge from '../components/Badge';
import { StdIcon, MktIcon } from '../components/Icons';
import Donut from '../components/Donut';
import WorldMap from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, bilateral, projects, news, markets, methodologies, STATUS_COLS } from '../data';

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

  const STAT_CELLS = [
    ['👤', t('globalOverview.statDna'), '127', t('globalOverview.statDnaNote')],
    ['📜', t('globalOverview.statA6'), '53', t('globalOverview.statA6Note')],
    ['🤝', t('globalOverview.statBilateral'), '28', t('globalOverview.statBilateralNote')],
    ['🏛', t('globalOverview.statMarket'), '41', t('globalOverview.statMarketNote')],
    ['🌿', t('globalOverview.statNdc'), '36', t('globalOverview.statNdcNote')],
    ['🧾', t('globalOverview.statItmo'), '3', t('globalOverview.statItmoNote')],
    ['🌊', t('globalOverview.statProjects'), '19', t('globalOverview.statProjectsNote', { n: countries.length })],
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
    ['📜', t('globalOverview.qaPolicyTitle'), t('globalOverview.qaPolicySub'), '/policy'],
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
        {STAT_CELLS.map(([icon, label, num, noteText]) => (
          <div className="ov-stat" key={label}>
            <div className="ov-stat-icon">{icon}</div>
            <div className="ov-stat-label">{label}</div>
            <div className="ov-stat-num">{num}</div>
            <div className="ov-stat-note">{noteText}</div>
          </div>
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
            <div className="title">{t('globalOverview.latestIntelligence')}</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
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
            <div className="title">{t('globalOverview.ndcTitle')}<span className="card-link" onClick={() => navigate('/policy')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.ndcSub')}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <div>
                <div className="donut-label">{t('globalOverview.conditionalTargets')}</div>
                <div className="donut-value">42.1 <small>MtCO2e</small></div>
                <Donut pct={65} centerNum="36" centerLabel={t('globalOverview.countriesLabel')} color="#2478A6" />
                <div className="donut-note">{t('globalOverview.conditionalNote')}</div>
              </div>
              <div>
                <div className="donut-label">{t('globalOverview.unconditionalTargets')}</div>
                <div className="donut-value">19.3 <small>MtCO2e</small></div>
                <Donut pct={43} centerNum="24" centerLabel={t('globalOverview.countriesLabel')} color="#12999B" />
                <div className="donut-note">{t('globalOverview.unconditionalNote')}</div>
              </div>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/policy')}>
            {t('globalOverview.exploreArticle6')}
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">{t('globalOverview.bilateralTitle')}<span className="card-link" onClick={() => navigate('/policy')}>{t('globalOverview.viewAll')}</span></div>
            <div className="sub">{t('globalOverview.bilateralSub')}</div>
            <table className="mini-table">
              <thead>
                <tr><th>{t('globalOverview.colCountryA')}</th><th>{t('globalOverview.colCountryB')}</th><th>{t('globalOverview.colSigned')}</th><th>{t('globalOverview.colStatus')}</th></tr>
              </thead>
              <tbody>
                {bilateral.map((r, i) => (
                  <tr key={i}>
                    <td>{r.country_a}</td>
                    <td>{r.country_b}</td>
                    <td>{r.signed}</td>
                    <td><Badge value={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/policy')}>
            {t('globalOverview.seeAllAgreements')}
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
