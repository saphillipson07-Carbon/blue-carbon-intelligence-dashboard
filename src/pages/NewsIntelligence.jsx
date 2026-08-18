import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { news } from '../data';

const ALL = 'All';

export default function NewsIntelligence() {
  const navigate = useNavigate();
  const { selectedCountry, setSelectedCountry } = useApp();
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [countryFilter, setCountryFilter] = useState(ALL);

  const sorted = useMemo(() => news.slice().sort((a, b) => (a.date < b.date ? 1 : -1)), []);
  const types = useMemo(() => [...new Set(sorted.map((n) => n.type))].sort(), [sorted]);
  const countryOptions = useMemo(() => [...new Set(sorted.map((n) => n.country))].sort(), [sorted]);

  const view = sorted
    .filter((n) => typeFilter === ALL || n.type === typeFilter)
    .filter((n) => countryFilter === ALL || n.country === countryFilter);

  const spotlight = sorted.filter((n) => n.country === selectedCountry);

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">News & Intelligence Explorer</div>
      <div className="card pad">
        <div className="title">News & Intelligence Explorer</div>
        <div className="sub">Timely developments in policy, markets, projects, methodologies and financing that could affect a decision.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, marginTop: 10 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <select className="select-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value={ALL}>All categories</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="select-input" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
              <option value={ALL}>All countries</option>
              {countryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="section">{view.length} updates matching current filters</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {view.length === 0 && <div className="pad sub">No intelligence items match these filters.</div>}
            {view.map((r, i) => (
              <div className="news-item" key={i}>
                <span className="tag">{r.type}</span>
                <span className="date">{r.date}</span>
                <span className="date">· {r.country}</span>
                <div className="headline">{r.headline}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card pad">
            <div className="title">Country spotlight</div>
            <div className="sub">{selectedCountry} · {spotlight.length} tagged updates</div>
          </div>
          <select
            className="select-input"
            style={{ marginTop: 8, width: '100%' }}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countryOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/country')}>
            View Country Intelligence → {selectedCountry}
          </button>
          <div className="sub" style={{ marginTop: 8 }}>Every intelligence item should ultimately link to its underlying source record.</div>
        </div>
      </div>
    </>
  );
}
