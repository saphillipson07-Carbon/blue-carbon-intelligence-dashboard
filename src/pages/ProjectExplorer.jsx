import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import WorldMap from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, projects, findCountry } from '../data';
import { PROJECT_COORDS } from '../data/projectCoords';
import { STANDARD_KEYWORDS, standardBucket } from '../data/standards';

const ALL = 'All';

function uniqueSorted(arr) {
  return [...new Set(arr)].filter(Boolean).sort();
}

export default function ProjectExplorer() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [countryFilter, setCountryFilter] = useState(ALL);
  const [ecosystemFilter, setEcosystemFilter] = useState(ALL);
  const [standardFilter, setStandardFilter] = useState(ALL);
  const [stageFilter, setStageFilter] = useState(ALL);
  const [a6Filter, setA6Filter] = useState(ALL);
  const [previewId, setPreviewId] = useState(null);

  const countryOptions = useMemo(() => uniqueSorted(projects.map((p) => p.country)), []);
  const ecosystemOptions = useMemo(() => uniqueSorted(projects.map((p) => p.ecosystem)), []);
  const standardOptions = STANDARD_KEYWORDS;
  const stageOptions = useMemo(() => uniqueSorted(projects.map((p) => p.stage)), []);
  const a6Options = useMemo(
    () => uniqueSorted(projects.map((p) => findCountry(p.country)?.article6_framework)),
    []
  );

  const view = useMemo(
    () =>
      projects.filter((p) => {
        if (countryFilter !== ALL && p.country !== countryFilter) return false;
        if (ecosystemFilter !== ALL && p.ecosystem !== ecosystemFilter) return false;
        if (standardFilter !== ALL && standardBucket(p.standard) !== standardFilter) return false;
        if (stageFilter !== ALL && p.stage !== stageFilter) return false;
        if (a6Filter !== ALL && findCountry(p.country)?.article6_framework !== a6Filter) return false;
        return true;
      }),
    [countryFilter, ecosystemFilter, standardFilter, stageFilter, a6Filter]
  );

  const markers = useMemo(
    () =>
      view
        .filter((p) => PROJECT_COORDS[p.project_id])
        .map((p) => ({ id: p.project_id, ...PROJECT_COORDS[p.project_id] })),
    [view]
  );

  const mapCountries = useMemo(() => {
    const present = new Set(view.map((p) => p.country));
    return countries.map((c) => ({ ...c, project_presence: present.has(c.country) ? 'Has projects' : null }));
  }, [view]);

  const previewProject = projects.find((p) => p.project_id === previewId) || null;

  const onMarkerSelect = (m) => setPreviewId(m.id);
  const onCountrySelect = (countryName) => {
    setCountryFilter(countryName);
    setPreviewId(null);
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('projectExplorer.section')}</div>
      <div className="card pad">
        <div className="title">{t('projectExplorer.title')}</div>
        <div className="sub">{t('projectExplorer.sub')}</div>
      </div>

      <div className="gm-filters gm-filters-5">
        <div>
          <div className="gm-filter-label">{t('projectExplorer.filterCountry')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value={ALL}>{t('common.allCountries')}</option>
            {countryOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('projectExplorer.filterEcosystem')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={ecosystemFilter} onChange={(e) => setEcosystemFilter(e.target.value)}>
            <option value={ALL}>{t('projects.allEcosystems')}</option>
            {ecosystemOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('projectExplorer.filterStandard')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={standardFilter} onChange={(e) => setStandardFilter(e.target.value)}>
            <option value={ALL}>{t('common.allStatuses')}</option>
            {standardOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('projectExplorer.filterStage')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value={ALL}>{t('projects.allStages')}</option>
            {stageOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('projectExplorer.filterA6')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={a6Filter} onChange={(e) => setA6Filter(e.target.value)}>
            <option value={ALL}>{t('common.allStatuses')}</option>
            {a6Options.map((v) => <option key={v} value={v}>{t(`status.${v}`)}</option>)}
          </select>
        </div>
        <button
          className="gm-reset"
          onClick={() => { setCountryFilter(ALL); setEcosystemFilter(ALL); setStandardFilter(ALL); setStageFilter(ALL); setA6Filter(ALL); }}
        >
          {t('globalMap.resetFilters')}
        </button>
      </div>

      <div className="gm-layout gm-layout-2col">
        <div>
          <WorldMap
            countries={mapCountries}
            statusField="project_presence"
            colorMap={{ 'Has projects': '#12999B' }}
            markers={markers}
            onSelect={onCountrySelect}
            onMarkerSelect={onMarkerSelect}
            selectedMarkerId={previewId}
          />
          <div className="gm-legend">
            <span><span className="gm-legend-dot" style={{ background: '#12999B', borderRadius: '50%' }} />{t('projectExplorer.legendMarker')}</span>
            <span><span className="gm-legend-dot" style={{ background: '#12999B', opacity: .35 }} />{t('projectExplorer.legendCountry')}</span>
          </div>
          <div className="sub" style={{ marginTop: 6 }}>
            {t('projectExplorer.mapCaption')}
          </div>
        </div>

        <div className="gm-panel">
          {!previewProject ? (
            <div className="gm-panel-empty">{t('projectExplorer.panelEmpty')}</div>
          ) : (
            <>
              <button className="gm-panel-close" onClick={() => setPreviewId(null)}>×</button>
              <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--navy)' }}>{previewProject.project_id}</div>
              <div className="sub" style={{ marginTop: 2 }}>{previewProject.country} · {previewProject.ecosystem}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge value={previewProject.stage} />
                {previewProject.verified && <span className="badge good">{t('common.verified')} · {previewProject.last_verified}</span>}
              </div>
              <div className="gm-indicator-grid" style={{ marginTop: 10 }}>
                <div className="gm-indicator-cell">
                  <div className="gm-indicator-label">{t('projects.cellCaas')}</div>
                  <div style={{ marginTop: 4 }}><Badge value={previewProject.assessment_stage} /></div>
                </div>
                <div className="gm-indicator-cell">
                  <div className="gm-indicator-label">{t('projects.cellBlocker')}</div>
                  <div style={{ marginTop: 4 }}><Badge value={previewProject.blocker_type} /></div>
                </div>
              </div>
              {previewProject.standard && (
                <div className="sub" style={{ marginTop: 8 }}><b>{t('projectDetail.labelStandard')}:</b> {previewProject.standard}</div>
              )}
              <button className="btn" style={{ width: '100%', textAlign: 'center', marginTop: 12 }} onClick={() => navigate(`/projects/${previewProject.project_id}`)}>
                {t('projectExplorer.viewFullRecord')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="section">{t('projectExplorer.matchingSection', { n: view.length, total: projects.length })}</div>
      {view.map((p) => (
        <button
          key={p.project_id}
          className="list-row"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => setPreviewId(p.project_id)}
        >
          <div className="list-row-main">
            <div className="list-row-title">
              {p.project_id} · {p.country}
              {p.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>{t('common.verified')}</span>}
            </div>
            <div className="list-row-sub">{p.ecosystem}{p.standard ? ` · ${p.standard}` : ''}</div>
          </div>
          <div><Badge value={p.stage} /></div>
        </button>
      ))}

      <div className="sub" style={{ marginTop: 10 }}>
        {t('projectExplorer.tableLinkNote')} <a href="#/projects/table" onClick={(e) => { e.preventDefault(); navigate('/projects/table'); }}>{t('projectExplorer.tableLink')}</a>
      </div>
    </>
  );
}
