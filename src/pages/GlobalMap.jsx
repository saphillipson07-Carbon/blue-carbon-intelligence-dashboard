import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import WorldMap from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, STATUS_COLS } from '../data';

export default function GlobalMap() {
  const navigate = useNavigate();
  const { setSelectedCountry } = useApp();
  const [layerName, setLayerName] = useState('DNA appointed');
  const [roleFilter, setRoleFilter] = useState('All');
  const layerCol = STATUS_COLS[layerName];

  const roles = useMemo(() => [...new Set(countries.map((c) => c.market_role))].sort(), []);
  const view = useMemo(
    () => (roleFilter === 'All' ? countries : countries.filter((c) => c.market_role === roleFilter)),
    [roleFilter]
  );

  const goCountry = (name) => {
    setSelectedCountry(name);
    navigate('/country');
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Global enabling conditions</div>
      <div className="card pad">
        <div className="title">Global Enabling Conditions Map</div>
        <div className="sub">Where the factual foundations for Article 6 and blue carbon transactions exist. Status only — not a readiness score or country ranking.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10, marginTop: 10 }}>
        <select className="select-input" value={layerName} onChange={(e) => setLayerName(e.target.value)}>
          {Object.keys(STATUS_COLS).map((k) => <option key={k}>{k}</option>)}
        </select>
        <select className="select-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option>All</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <WorldMap countries={view} statusField={layerCol} onSelect={goCountry} />
      <div className="sub" style={{ marginTop: 6 }}>
        Geography: real country boundaries. Status records: illustrative until verified data integration.
      </div>

      <div className="section">{layerName} — by country</div>
      {view
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country))
        .map((r) => (
          <button
            key={r.iso}
            className="list-row"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => goCountry(r.country)}
          >
            <div className="list-row-main">
              <div className="list-row-title">{r.country}</div>
              <div className="list-row-sub">{r.market_role}</div>
            </div>
            <div><Badge value={r[layerCol]} /></div>
          </button>
        ))}
    </>
  );
}
