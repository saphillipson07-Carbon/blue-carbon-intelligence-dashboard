import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data';

const ALL = 'All';

function uniqueSorted(arr, key) {
  return [...new Set(arr.map((r) => r[key]).filter(Boolean))].sort();
}

export default function Projects() {
  const navigate = useNavigate();
  const [countryFilter, setCountryFilter] = useState(ALL);
  const [ecosystemFilter, setEcosystemFilter] = useState(ALL);
  const [stageFilter, setStageFilter] = useState(ALL);
  const [blockerFilter, setBlockerFilter] = useState(ALL);

  const totalProjects = projects.length;
  const countryCount = new Set(projects.map((p) => p.country)).size;
  const hardBlockers = projects.filter((p) => (p.blocker_type || '').toLowerCase() === 'hard blocker').length;
  const progressing = projects.filter((p) =>
    ['development', 'validation'].includes((p.stage || '').toLowerCase())
  ).length;

  const view = useMemo(() => {
    return projects.filter((p) =>
      (countryFilter === ALL || p.country === countryFilter) &&
      (ecosystemFilter === ALL || p.ecosystem === ecosystemFilter) &&
      (stageFilter === ALL || p.stage === stageFilter) &&
      (blockerFilter === ALL || p.blocker_type === blockerFilter)
    );
  }, [countryFilter, ecosystemFilter, stageFilter, blockerFilter]);

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Project intelligence</div>
      <div className="card pad">
        <div className="title">Project Explorer</div>
        <div className="sub">Track real project activity, Article 6 progress and the issues that can move or delay a transaction. No readiness score is applied.</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{totalProjects}</div>
          <div className="snapshot-label">Projects tracked</div>
          <div className="snapshot-note">Current project records</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{countryCount}</div>
          <div className="snapshot-label">Countries</div>
          <div className="snapshot-note">With project activity</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{progressing}</div>
          <div className="snapshot-label">Progressing</div>
          <div className="snapshot-note">Development or validation</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{hardBlockers}</div>
          <div className="snapshot-label">Hard blockers</div>
          <div className="snapshot-note">Issues requiring resolution</div>
        </div>
      </div>

      <div className="project-toolbar">
        <div className="project-toolbar-title">Filter project activity</div>
        <div className="project-toolbar-note">Use the filters to narrow the project view. Status is shown as market information, not a numerical assessment.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
        <select className="select-input" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value={ALL}>All countries</option>
          {uniqueSorted(projects, 'country').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={ecosystemFilter} onChange={(e) => setEcosystemFilter(e.target.value)}>
          <option value={ALL}>All ecosystems</option>
          {uniqueSorted(projects, 'ecosystem').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
          <option value={ALL}>All stages</option>
          {uniqueSorted(projects, 'stage').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={blockerFilter} onChange={(e) => setBlockerFilter(e.target.value)}>
          <option value={ALL}>All blockers</option>
          {uniqueSorted(projects, 'blocker_type').map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="section">{view.length} project records matching current filters</div>

      {view.length === 0 && (
        <div className="card pad">
          <div className="title">No project records match these filters.</div>
          <div className="sub">Clear one or more filters to return to the wider project market view.</div>
        </div>
      )}

      {view.map((r) => {
        const blocker = r.blocker_type || 'No Data';
        const blockerCls = blocker.toLowerCase() === 'hard blocker' ? 'bad' : blocker.toLowerCase() === 'soft blocker' ? 'plan' : 'na';
        const note = r.transaction_note || 'No transaction note recorded';
        return (
          <button
            key={r.project_id}
            className="project-result"
            style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)' }}
            onClick={() => navigate(`/projects/${r.project_id}`)}
          >
            <div className="project-result-head">
              <div className="project-result-id">{r.project_id} · {r.country} · {r.ecosystem}</div>
              <div className="project-result-meta">{r.stage} · {r.assessment_stage}</div>
            </div>
            <div className="project-result-body">
              <div className="project-result-grid">
                <div className="result-cell">
                  <div className="result-label">Market status</div>
                  <div className="result-value">{r.stage}</div>
                </div>
                <div className="result-cell">
                  <div className="result-label">CAAS assessment</div>
                  <div className="result-value">{r.assessment_stage}</div>
                </div>
                <div className="result-cell">
                  <div className="result-label">Blocker</div>
                  <div className="result-value"><span className={`badge ${blockerCls}`}>{blocker}</span></div>
                </div>
                <div className="result-cell">
                  <div className="result-label">Primary issue</div>
                  <div className="result-value">{r.primary_blocker}</div>
                </div>
              </div>
            </div>
            <div className="project-result-foot">
              <div className="project-note">
                {r.verified ? <span style={{ color: 'var(--green, #2D7045)' }}>✓ Verified record{r.last_verified ? ` (${r.last_verified})` : ''}</span> : <b>Article 6:</b>}
                {!r.verified && <> {note}</>}
              </div>
              <div className="project-action">Open project →</div>
            </div>
          </button>
        );
      })}
    </>
  );
}
