import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Badge from '../components/Badge';
import { StdIcon, MktIcon } from '../components/Icons';
import Donut from '../components/Donut';
import WorldMap from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, bilateral, projects, news, markets, methodologies, STATUS_COLS } from '../data';

const STAT_CELLS = [
  ['👤', 'Countries with DNA appointed', '127', 'of 193 UNFCCC Parties'],
  ['📜', 'Article 6 Framework', '53', 'Operational / adopted'],
  ['🤝', 'Bilateral Agreements Signed', '28', 'with 17 countries'],
  ['🏛', 'Domestic Carbon Market', '41', 'Operational or in development'],
  ['🌿', 'Blue Carbon in NDCs', '36', 'Countries included'],
  ['🧾', 'ITMOs Issued (Article 6)', '3', 'Countries to date'],
  ['🌊', 'Active Blue Carbon Projects', '19', `Across ${countries.length} countries`],
];

const NEWS_TAB_GROUPS = {
  'Latest News': null,
  'Regulatory Updates': ['POLICY', 'REGULATION'],
  'New Projects': ['PROJECT'],
  Agreements: ['AGREEMENT'],
};

const QUICK_ACCESS = [
  ['🌍', 'Country Profiles', 'Explore country context', '/country'],
  ['📂', 'Project Pipeline', 'Find blue carbon projects', '/projects'],
  ['📜', 'Policy & Frameworks', 'Laws, policies & regulations', '/policy'],
  ['🌊', 'Marine Spatial Planning', 'Maps & ecosystem data', '/msp'],
  ['📄', 'Documents Library', 'Guides, reports & data', null],
  ['↓', 'Data Download', 'Access datasets', null],
];

export default function GlobalOverview() {
  const navigate = useNavigate();
  const { selectedCountry, setSelectedCountry, newsTab, setNewsTab } = useApp();
  const [mapLayer, setMapLayer] = useState('DNA appointed');
  const layerField = STATUS_COLS[mapLayer];

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
          <option value="">🔍  Search a country...</option>
          {countries.map((c) => (
            <option key={c.iso} value={c.country}>{c.country}</option>
          ))}
        </select>
        <button className="search-btn" onClick={() => goCountry(selectedCountry)}>
          Country View →
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
        <button className="btn" onClick={() => navigate('/map')}>View all countries →</button>
      </div>

      <div className="live">
        <b>● LIVE INTELLIGENCE</b> &nbsp;&nbsp; Latest policy · market · project · regulatory · agreement updates
      </div>

      <div className="section">Global enabling conditions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.72fr .82fr', gap: 16 }}>
        <div>
          <div className="card pad">
            <div className="title">Global Enabling Conditions Map</div>
            <div className="sub">Choose an indicator and use the country selector to open Country Intelligence.</div>
          </div>
          <select
            className="select-input"
            style={{ marginTop: 8, width: '100%' }}
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value)}
          >
            {Object.keys(STATUS_COLS).map((k) => <option key={k}>{k}</option>)}
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
              Open Country Profile →
            </button>
          </div>
          <div className="sub" style={{ marginTop: 6 }}>
            Geography: real country boundaries. Status records: illustrative until verified data integration.
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="pad" style={{ paddingBottom: 0 }}>
            <div className="title">Latest Intelligence</div>
            <div className="sub">Policy, regulation, projects, markets and agreements.</div>
          </div>
          <div style={{ display: 'flex', gap: 4, padding: '10px 14px 0' }}>
            {Object.keys(NEWS_TAB_GROUPS).map((t) => (
              <button
                key={t}
                onClick={() => setNewsTab(t)}
                style={{
                  flex: 1,
                  fontSize: '.55rem',
                  padding: '6px 4px',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 700,
                  background: newsTab === t ? '#0B3150' : '#EEF2F4',
                  color: newsTab === t ? 'white' : '#6E7F8A',
                }}
              >
                {t}
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

      <div className="section">Blue carbon intelligence at a glance</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div>
          <div className="card pad">
            <div className="title">Blue Carbon Methodologies<span className="card-link">View all →</span></div>
            <div className="sub">Aligned with Article 6</div>
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
            See all methodologies →
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">NDC Targets – Blue Carbon<span className="card-link">View all →</span></div>
            <div className="sub">Coastal &amp; marine ecosystems</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <div>
                <div className="donut-label">Conditional targets</div>
                <div className="donut-value">42.1 <small>MtCO2e</small></div>
                <Donut pct={65} centerNum="36" centerLabel="Countries" color="#2478A6" />
                <div className="donut-note">From blue carbon ecosystems across 36 countries</div>
              </div>
              <div>
                <div className="donut-label">Unconditional targets</div>
                <div className="donut-value">19.3 <small>MtCO2e</small></div>
                <Donut pct={43} centerNum="24" centerLabel="Countries" color="#12999B" />
                <div className="donut-note">From blue carbon ecosystems across 24 countries</div>
              </div>
            </div>
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/policy')}>
            Explore Article 6 & Policy →
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">Article 6 Bilateral Agreements<span className="card-link">View all →</span></div>
            <div className="sub">Status of cooperation</div>
            <table className="mini-table">
              <thead>
                <tr><th>Country A</th><th>Country B</th><th>Signed</th><th>Status</th></tr>
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
            See all agreements →
          </button>
        </div>

        <div>
          <div className="card pad">
            <div className="title">Carbon Market Landscape<span className="card-link">View all →</span></div>
            <div className="sub">Operational status</div>
            {Object.entries(marketGroups).map(([mtype, grp]) => {
              const op = grp.filter((g) => g.status === 'Operational').length;
              const countriesN = new Set(grp.map((g) => g.country)).size;
              return (
                <div className="mini-row" key={mtype}>
                  <div className="mini-row-main">
                    <MktIcon marketType={mtype} />
                    <span className="mini-row-title">{mtype}</span>
                    <div className="mini-row-sub" style={{ marginLeft: 30 }}>{countriesN} countries</div>
                  </div>
                  <Badge value={op === grp.length ? 'Implemented' : 'In Development'} />
                </div>
              );
            })}
          </div>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/markets')}>
            Go to Market Dashboard →
          </button>
        </div>
      </div>

      <div className="section">Quick access</div>
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
                Open
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
