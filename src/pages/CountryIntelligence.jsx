import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { countries, projectsForCountry } from '../data';

export default function CountryIntelligence() {
  const navigate = useNavigate();
  const { selectedCountry, setSelectedCountry } = useApp();
  const row = countries.find((c) => c.country === selectedCountry) || countries[0];
  const countryProjects = projectsForCountry(row.country);

  const vals = [
    ['Article 6 framework', row.article6_framework],
    ['DNA appointed', row.dna_appointed],
    ['Domestic carbon market', row.domestic_carbon_market],
    ['Bilateral agreements', row.bilateral_agreements],
    ['Blue carbon in NDCs', row.blue_carbon_ndc],
    ['Article 6 authorization', row.article6_authorization],
    ['ITMOs issued', row.itmos_issued],
    ['Active blue carbon projects', row.active_blue_carbon_projects],
  ];

  return (
    <>
      <div className="section">Country intelligence</div>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <select
        className="select-input"
        style={{ display: 'block', marginTop: 12, width: 260 }}
        value={row.country}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        {countries.map((c) => <option key={c.iso}>{c.country}</option>)}
      </select>

      <div className="card pad">
        <div style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--navy)' }}>{row.country}</div>
        <div style={{ marginTop: 6 }}><span className="badge dev">{row.market_role}</span></div>
      </div>

      <div className="section">Key enabling conditions</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {vals.map(([label, value]) => (
          <div className="card pad" key={label}>
            <div style={{ fontSize: '.55rem', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
            <div style={{ marginTop: 5 }}><Badge value={value} /></div>
          </div>
        ))}
      </div>

      <div className="section">Project activity</div>
      {countryProjects.length === 0 && (
        <div className="card pad sub">No project records for this country in the current sample.</div>
      )}
      {countryProjects.map((p) => (
        <button
          key={p.project_id}
          className="project-row"
          style={{ width: '100%', textAlign: 'left', display: 'block' }}
          onClick={() => navigate(`/projects/${p.project_id}`)}
        >
          <span className="project-link">{p.project_id} · {p.country} · {p.ecosystem}  →</span>
        </button>
      ))}
    </>
  );
}
