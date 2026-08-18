import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { methodologies, projects } from '../data';

const ALL = 'All';
const ECOSYSTEMS = ['All', 'Mangrove', 'Seagrass', 'Salt Marsh'];

export default function Methodologies() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ecoFilter, setEcoFilter] = useState(ALL);
  const [a6Filter, setA6Filter] = useState(ALL);
  const [expanded, setExpanded] = useState(null);

  const view = useMemo(() => {
    return methodologies.filter((m) => {
      if (search && !Object.values(m).join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      if (ecoFilter !== ALL && !m.ecosystem.toLowerCase().includes(ecoFilter.toLowerCase())) return false;
      if (a6Filter !== ALL && m.article6_eligible !== a6Filter) return false;
      return true;
    });
  }, [search, ecoFilter, a6Filter]);

  const relatedFor = (m) => {
    const key = m.ecosystem.split(',')[0].trim().toLowerCase();
    return projects.filter((p) => p.ecosystem.toLowerCase().includes(key));
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Blue Carbon Methodologies Explorer</div>
      <div className="card pad">
        <div className="title">Blue Carbon Methodologies Explorer</div>
        <div className="sub">Search and filter standards and methodologies applicable to blue carbon projects. Applicability is evidence-based, never a score.</div>
      </div>

      <input
        className="search-input"
        style={{ width: '100%', marginTop: 10, marginBottom: 8 }}
        placeholder="Search methodologies — e.g. mangroves, VM0033, Gold Standard"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <select className="select-input" value={ecoFilter} onChange={(e) => setEcoFilter(e.target.value)}>
          {ECOSYSTEMS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <select className="select-input" value={a6Filter} onChange={(e) => setA6Filter(e.target.value)}>
          <option value={ALL}>Article 6 eligible: All</option>
          <option value="Yes">Article 6 eligible: Yes</option>
          <option value="No">Article 6 eligible: No</option>
        </select>
      </div>

      <div className="section">{view.length} methodologies matching current filters</div>
      {view.map((r) => {
        const related = relatedFor(r);
        const isOpen = expanded === r.name;
        return (
          <div key={r.name}>
            <div className="list-row">
              <div className="list-row-main">
                <div className="list-row-title">{r.name} · {r.standard}</div>
                <div className="list-row-sub">{r.ecosystem} · {r.activity} · Article 6: {r.article6_eligible} · CORSIA: {r.corsia_eligible}</div>
              </div>
              <div><Badge value={r.status} /></div>
            </div>
            {related.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <button
                  className="card-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'none' }}
                  onClick={() => setExpanded(isOpen ? null : r.name)}
                >
                  {isOpen ? '▾' : '▸'} Related projects ({related.length})
                </button>
                {isOpen && related.map((p) => (
                  <button
                    key={p.project_id}
                    className="project-row"
                    style={{ width: '100%', textAlign: 'left', display: 'block', marginTop: 6 }}
                    onClick={() => navigate(`/projects/${p.project_id}`)}
                  >
                    <span className="project-link">{p.project_id} · {p.country} · {p.ecosystem} →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
