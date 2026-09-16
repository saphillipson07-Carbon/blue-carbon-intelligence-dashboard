import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { projects } from '../data';

const ALL = 'All';

function uniqueSorted(arr, key) {
  return [...new Set(arr.map((r) => r[key]).filter(Boolean))].sort();
}

export default function Projects() {
  const navigate = useNavigate();
  const { t } = useApp();
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
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('projects.section')}</div>
      <div className="card pad">
        <div className="title">{t('projects.title')}</div>
        <div className="sub">{t('projects.sub')}</div>
        <div className="sub" style={{ marginTop: 4 }}>
          <a href="#/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>← {t('projectExplorer.title')}</a>
        </div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{totalProjects}</div>
          <div className="snapshot-label">{t('projects.statTracked')}</div>
          <div className="snapshot-note">{t('projects.statTrackedNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{countryCount}</div>
          <div className="snapshot-label">{t('projects.statCountries')}</div>
          <div className="snapshot-note">{t('projects.statCountriesNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{progressing}</div>
          <div className="snapshot-label">{t('projects.statProgressing')}</div>
          <div className="snapshot-note">{t('projects.statProgressingNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{hardBlockers}</div>
          <div className="snapshot-label">{t('projects.statBlockers')}</div>
          <div className="snapshot-note">{t('projects.statBlockersNote')}</div>
        </div>
      </div>

      <div className="project-toolbar">
        <div className="project-toolbar-title">{t('projects.toolbarTitle')}</div>
        <div className="project-toolbar-note">{t('projects.toolbarNote')}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
        <select className="select-input" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value={ALL}>{t('projects.allCountries')}</option>
          {uniqueSorted(projects, 'country').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={ecosystemFilter} onChange={(e) => setEcosystemFilter(e.target.value)}>
          <option value={ALL}>{t('projects.allEcosystems')}</option>
          {uniqueSorted(projects, 'ecosystem').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
          <option value={ALL}>{t('projects.allStages')}</option>
          {uniqueSorted(projects, 'stage').map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={blockerFilter} onChange={(e) => setBlockerFilter(e.target.value)}>
          <option value={ALL}>{t('projects.allBlockers')}</option>
          {uniqueSorted(projects, 'blocker_type').map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="section">{t('projects.matchingSection', { n: view.length })}</div>

      {view.length === 0 && (
        <div className="card pad">
          <div className="title">{t('projects.noneTitle')}</div>
          <div className="sub">{t('projects.noneSub')}</div>
        </div>
      )}

      {view.map((r) => {
        const blocker = r.blocker_type || 'No Data';
        const blockerCls = blocker.toLowerCase() === 'hard blocker' ? 'bad' : blocker.toLowerCase() === 'soft blocker' ? 'plan' : 'na';
        const note = r.transaction_note || t('projects.noTransactionNote');
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
                  <div className="result-label">{t('projects.cellMarketStatus')}</div>
                  <div className="result-value">{r.stage}</div>
                </div>
                <div className="result-cell">
                  <div className="result-label">{t('projects.cellCaas')}</div>
                  <div className="result-value">{r.assessment_stage}</div>
                </div>
                <div className="result-cell">
                  <div className="result-label">{t('projects.cellBlocker')}</div>
                  <div className="result-value"><span className={`badge ${blockerCls}`}>{t(`status.${blocker}`)}</span></div>
                </div>
                <div className="result-cell">
                  <div className="result-label">{t('projects.cellPrimaryIssue')}</div>
                  <div className="result-value">{r.primary_blocker}</div>
                </div>
              </div>
            </div>
            <div className="project-result-foot">
              <div className="project-note">
                {r.verified ? <span style={{ color: 'var(--green, #2D7045)' }}>✓ {t('common.verified')}{r.last_verified ? ` (${r.last_verified})` : ''}</span> : <b>{t('projects.article6Label')}</b>}
                {!r.verified && <> {note}</>}
              </div>
              <div className="project-action">{t('projects.openProject')}</div>
            </div>
          </button>
        );
      })}
    </>
  );
}
