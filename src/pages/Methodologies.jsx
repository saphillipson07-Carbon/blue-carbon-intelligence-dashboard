import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { methodologies, projects } from '../data';

const ALL = 'All';

export default function Methodologies() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [search, setSearch] = useState('');
  const [ecoFilter, setEcoFilter] = useState(ALL);
  const [a6Filter, setA6Filter] = useState(ALL);
  const [expanded, setExpanded] = useState(null);

  const ECOSYSTEMS = [
    { value: 'All', label: t('methodologies.ecoAll') },
    { value: 'Mangrove', label: t('methodologies.ecoMangrove') },
    { value: 'Seagrass', label: t('methodologies.ecoSeagrass') },
    { value: 'Salt Marsh', label: t('methodologies.ecoSaltMarsh') },
  ];

  const view = useMemo(() => {
    return methodologies.filter((m) => {
      if (search && !Object.values(m).join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      if (ecoFilter !== ALL && !m.ecosystem.toLowerCase().includes(ecoFilter.toLowerCase())) return false;
      if (a6Filter !== ALL && m.article6_eligible !== a6Filter) return false;
      return true;
    });
  }, [search, ecoFilter, a6Filter]);

  const relatedFor = (m) => {
    const ecoKey = m.ecosystem.split(',')[0].trim().toLowerCase();
    return projects.filter((p) => {
      if (!p.ecosystem.toLowerCase().includes(ecoKey)) return false;
      // Projects with a known standard only relate to the methodology that
      // actually applies to them — otherwise every methodology would claim
      // every project sharing an ecosystem, regardless of which standard it uses.
      if (p.standard) return p.standard.toLowerCase().includes(m.standard.toLowerCase());
      return true;
    });
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('methodologies.section')}</div>
      <div className="card pad">
        <div className="title">{t('methodologies.title')}</div>
        <div className="sub">{t('methodologies.sub')}</div>
      </div>

      <input
        className="search-input"
        style={{ width: '100%', marginTop: 10, marginBottom: 8 }}
        placeholder={t('methodologies.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <select className="select-input" value={ecoFilter} onChange={(e) => setEcoFilter(e.target.value)}>
          {ECOSYSTEMS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
        <select className="select-input" value={a6Filter} onChange={(e) => setA6Filter(e.target.value)}>
          <option value={ALL}>{t('methodologies.a6All')}</option>
          <option value="Yes">{t('methodologies.a6Yes')}</option>
          <option value="No">{t('methodologies.a6No')}</option>
        </select>
      </div>

      <div className="section">{t('methodologies.matchingSection', { n: view.length })}</div>
      {view.map((r) => {
        const related = relatedFor(r);
        const isOpen = expanded === r.name;
        return (
          <div key={r.name}>
            <div className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', width: '100%' }}>
                <div className="list-row-main">
                  <div className="list-row-title">
                    {r.name} · {r.standard}
                    {r.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>{t('common.verified')}</span>}
                  </div>
                  <div className="list-row-sub">{r.ecosystem} · {r.activity} · {t('methodologies.article6Label')}: {r.article6_eligible} · CORSIA: {r.corsia_eligible}</div>
                </div>
                <div><Badge value={r.status} /></div>
              </div>
              {r.note && (
                <div className="sub" style={{ marginTop: 6 }}>
                  {r.note} {r.source && <a href={r.source} target="_blank" rel="noreferrer">({r.source_label || t('common.source')})</a>}
                </div>
              )}
            </div>
            {related.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <button
                  className="card-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'none' }}
                  onClick={() => setExpanded(isOpen ? null : r.name)}
                >
                  {isOpen ? '▾' : '▸'} {t('methodologies.relatedProjects', { n: related.length })}
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
