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

      <div className="card pad" style={{ borderLeft: '3px solid var(--blue)' }}>
        <div className="title">Market intelligence — carbon prices & blue carbon trades</div>
        <div className="sub" style={{ marginTop: 6 }}>
          General nature-based voluntary carbon market credits traded in a €7–24/tCO2e ($7–24) range through 2026; high-integrity (A–AAA-rated)
          credits averaged ~$14.80/t versus ~$3.50/t for low-quality (CCC–B) credits. Mangrove-specific credits have commanded a premium in some
          Asian markets, reported around $26–34/tCO2e. Indonesia's domestic compliance market (IDXCarbon) has traded far lower, averaging
          ~US$4/tCO2e in 2025 — a different market segment, not a blue carbon voluntary-credit price.
        </div>
        <div className="sub" style={{ marginTop: 6, fontStyle: 'italic' }}>
          Blue carbon-specific transaction prices for Indonesia or Viet Nam individually are <b>not publicly available</b> — no registry or
          exchange currently publishes mangrove/seagrass-credit-specific pricing broken out by country.
        </div>
        <div className="sub" style={{ marginTop: 6 }}>
          Sources: <a href="https://www.regreener.earth/blog/carbon-credit-prices-today-trends-and-forecasts-for-2026" target="_blank" rel="noreferrer">Regreener — Carbon Credit Prices 2026</a>
          {' · '}<a href="https://www.idxcarbon.co.id/document/share/161/caf49365-34e4-4582-8cd3-bb660ebb126c" target="_blank" rel="noreferrer">IDXCarbon Monthly Report, Feb 2026</a>
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
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }}
          onClick={() => goCountry(r.country)}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="list-row-main">
              <div className="list-row-title">
                {r.country} · {r.market_name}
                {r.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>Verified</span>}
              </div>
              <div className="list-row-sub">{r.market_type} · Registry: {r.registry} · Platform: {r.platform} · Updated {r.last_updated}</div>
            </div>
            <div><Badge value={r.status} /></div>
          </div>
          {r.price_note && <div className="sub" style={{ marginTop: 6 }}>{r.price_note}</div>}
        </button>
      ))}
      <div className="sub">Entries marked "Verified" are sourced and dated as of this update; other records are illustrative pending integration with verified sources.</div>
    </>
  );
}
