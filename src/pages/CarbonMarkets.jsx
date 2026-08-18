import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { markets } from '../data';

const ALL = 'All';

export default function CarbonMarkets() {
  const navigate = useNavigate();
  const { setSelectedCountry } = useApp();
  const [typeFilter, setTypeFilter] = useState(ALL);

  const opMarkets = markets.filter((m) => m.status === 'Operational').length;
  const a6Markets = markets.filter((m) => m.article6_integration === 'Implemented').length;
  const countryCount = new Set(markets.map((m) => m.country)).size;
  const types = useMemo(() => [...new Set(markets.map((m) => m.market_type))].sort(), []);

  const view = typeFilter === ALL ? markets : markets.filter((m) => m.market_type === typeFilter);

  const goCountry = (name) => {
    setSelectedCountry(name);
    navigate('/country');
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Carbon Markets Explorer</div>
      <div className="card pad">
        <div className="title">Carbon Markets Explorer</div>
        <div className="sub">Domestic, voluntary and Article 6 carbon market intelligence — a market directory, not a country ranking.</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{markets.length}</div>
          <div className="snapshot-label">Markets tracked</div>
          <div className="snapshot-note">Domestic and voluntary</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{opMarkets}</div>
          <div className="snapshot-label">Operational</div>
          <div className="snapshot-note">Active market infrastructure</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{a6Markets}</div>
          <div className="snapshot-label">Article 6 integrated</div>
          <div className="snapshot-note">Linked to Article 6 activity</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{countryCount}</div>
          <div className="snapshot-label">Countries</div>
          <div className="snapshot-note">With market records</div>
        </div>
      </div>

      <select className="select-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value={ALL}>All market types</option>
        {types.map((t) => <option key={t}>{t}</option>)}
      </select>

      <div className="section">Carbon market directory</div>
      {view.map((r, i) => (
        <button
          key={i}
          className="list-row"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => goCountry(r.country)}
        >
          <div className="list-row-main">
            <div className="list-row-title">{r.country} · {r.market_name}</div>
            <div className="list-row-sub">{r.market_type} · Registry: {r.registry} · Platform: {r.platform} · Updated {r.last_updated}</div>
          </div>
          <div><Badge value={r.status} /></div>
        </button>
      ))}
      <div className="sub">Prices, where shown, would always carry date, unit and source context. No prices are shown in this illustrative prototype.</div>
    </>
  );
}
