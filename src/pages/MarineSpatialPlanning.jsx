import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcehMap from '../components/AcehMap';
import { useApp } from '../AppContext';
import { projects } from '../data';
import { PROJECT_COORDS } from '../data/projectCoords';
import { STANDARD_KEYWORDS } from '../data/standards';

const ALL = 'All';

// Real, verified project cluster (see Projects Explorer for full source
// citations on each record) — used as a worked example for the MSP
// workflow rather than a fabricated scenario. Coordinates are regency
// (district)-level centroids for real, named administrative areas in Aceh
// where Yagasu operates — not exact project site coordinates, which aren't
// publicly available for these projects.
const CLUSTER_IDS = ['BC-101', 'BC-102', 'BC-103'];
const CLUSTER_REGENCY = { 'BC-101': 'Aceh Besar', 'BC-102': 'Aceh Utara', 'BC-103': 'Aceh Timur' };

// Real protected-area boundaries from the World Database on Protected Areas
// (WDPA), UNEP-WCMC & IUCN, August 2026 release, clipped to Aceh & North
// Sumatra — the same source AcehMap renders on its polygon layer. This page
// reads the plain (unprojected) properties for the filterable MPA directory;
// AcehMap independently fetches the pre-projected pixel version to draw the
// shapes. See AcehMap.jsx for why those are two separate files.
const mpaDataUrl = '/geo/aceh-mpas.json';

function parseHa(v) {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmtKm2(n) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} km²`;
}

export default function MarineSpatialPlanning() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [mode, setMode] = useState('msp');

  // MSP (siting workflow) state
  const [reportMsg, setReportMsg] = useState(null);

  // MPA (protected areas directory) state
  const [areas, setAreas] = useState([]);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [designationFilter, setDesignationFilter] = useState(ALL);
  const [iucnFilter, setIucnFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(mpaDataUrl)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAreas((d.features || []).map((f) => f.properties)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const cluster = CLUSTER_IDS.map((id) => projects.find((p) => p.project_id === id)).filter(Boolean);
  const totalHa = cluster.reduce((sum, p) => sum + parseHa(p.area_ha), 0);
  const hardBlockers = cluster.filter((p) => p.blocker_type === 'Hard blocker');
  const softBlockers = cluster.filter((p) => p.blocker_type === 'Soft blocker');
  const standards = [...new Set(cluster.flatMap((p) => STANDARD_KEYWORDS.filter((k) => p.standard?.includes(k))))];

  const designationOptions = useMemo(() => [...new Set(areas.map((a) => a.designation))].sort(), [areas]);
  const iucnOptions = useMemo(() => [...new Set(areas.map((a) => a.iucn_category))].sort(), [areas]);

  const view = useMemo(() => {
    const q = search.trim().toLowerCase();
    return areas
      .filter((a) => {
        if (typeFilter === 'Marine' && !a.marine) return false;
        if (typeFilter === 'Terrestrial' && a.marine) return false;
        if (designationFilter !== ALL && a.designation !== designationFilter) return false;
        if (iucnFilter !== ALL && a.iucn_category !== iucnFilter) return false;
        if (q && !a.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [areas, typeFilter, designationFilter, iucnFilter, search]);

  const marineCount = useMemo(() => areas.filter((a) => a.marine).length, [areas]);
  const totalAreaKm2 = useMemo(() => areas.reduce((sum, a) => sum + (a.area_km2 || 0), 0), [areas]);

  const resetFilters = () => {
    setTypeFilter(ALL);
    setDesignationFilter(ALL);
    setIucnFilter(ALL);
    setSearch('');
  };

  const selectArea = (props) => setSelectedId((cur) => (cur === props.wdpa_site_id ? null : props.wdpa_site_id));

  const isMsp = mode === 'msp';

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="mode-toggle">
        <button className={`mode-toggle-btn${isMsp ? ' active' : ''}`} onClick={() => setMode('msp')}>{t('msp.modeMsp')}</button>
        <button className={`mode-toggle-btn${!isMsp ? ' active' : ''}`} onClick={() => setMode('mpa')}>{t('msp.modeMpa')}</button>
      </div>

      {isMsp ? (
        <>
          <div className="section">{t('msp.section')}</div>
          <div className="detail-head">
            <div className="kicker">{t('msp.kicker')}</div>
            <div className="detail-title">{t('msp.title')}</div>
            <div className="detail-sub">{t('msp.sub')}</div>
            <div className="path">
              <div className="step done">{t('msp.step1')}</div>
              <div className="step current">{t('msp.step2')}</div>
              <div className="step">{t('msp.step3')}</div>
              <div className="step">{t('msp.step4')}</div>
            </div>
          </div>

          <div className="section">{t('msp.selectedAreaSection')}</div>
          <AcehMap
            markers={cluster.map((p) => ({ id: p.project_id, ...PROJECT_COORDS[p.project_id] }))}
            onSelect={(m) => navigate(`/projects/${m.id}`)}
          />
          <div className="sub" style={{ marginTop: 6 }}>
            Real coastline (Indonesia, MIT-licensed <a href="https://github.com/simonepri/geo-maps" target="_blank" rel="noreferrer">@geo-maps/countries-land-10km</a>, OSM/Natural Earth-derived),
            place labels for Banda Aceh &amp; Medan and the tracked regencies, and 59 real protected areas for Aceh &amp; North Sumatra from the <a href="https://www.protectedplanet.net/country/IDN" target="_blank" rel="noreferrer">World Database on Protected Areas</a> (teal = marine, green = terrestrial/mixed — hover a shape for details, or switch to the {t('msp.modeMpa')} tab above to browse them all).
            Markers are placed at regency (district)-level centroids — {cluster.map((p) => `${p.project_id} in ${CLUSTER_REGENCY[p.project_id]}`).join(', ')} —
            not exact project site coordinates, which aren't publicly available; treat apparent proximity to a protected area as a screening cue to verify
            in the field, not a confirmed overlap. Click a marker to open that project's record.
          </div>
          <div className="sub" style={{ marginTop: 2, fontSize: '.52rem' }}>
            Citation: UNEP-WCMC and IUCN (2026), Protected Planet: The World Database on Protected Areas (WDPA) [On-line], August 2026, Cambridge, UK.
            Available at: <a href="https://www.protectedplanet.net" target="_blank" rel="noreferrer">www.protectedplanet.net</a>.
            Geometry simplified for web display (~200m tolerance); full source citations for the project cluster are on <a href="#/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>Projects Explorer</a>.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <div className="card pad">
              <div className="title">{t('msp.opportunitiesTitle')}</div>
              <div className="sub">{t('msp.opportunitiesEco')}</div>
              <div className="sub">{t('msp.methodologiesAvailable', { list: standards.join(', ') || t('countryIntelligence.mangroveAreaSrcFallback') })}</div>
              <div className="sub">{t('msp.a6Operational')}</div>
              <div className="sub">{hardBlockers.length === 0 ? t('msp.noHardBlockers', { n: cluster.length }) : t('msp.hardBlockersFound', { n: hardBlockers.length })}</div>
            </div>
            <div className="blocker" style={{ marginTop: 0, borderLeftColor: '#D28A2E', background: '#FFF8EE' }}>
              <b style={{ fontSize: '.65rem', color: '#D28A2E' }}>{t('msp.considerationsTitle')}</b>
              <div style={{ fontSize: '.62rem', marginTop: 5 }}>
                {cluster.map((p) => `${p.project_id}: ${p.primary_blocker}`).join(' · ')}
              </div>
            </div>
          </div>

          <div className="section">{t('msp.summarySection')}</div>
          <div className="project-snapshot">
            <div className="snapshot-card">
              <div className="snapshot-number">{totalHa.toLocaleString()}</div>
              <div className="snapshot-label">{t('msp.snapshotArea')}</div>
              <div className="snapshot-note">{t('msp.snapshotAreaNote', { n: cluster.length })}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{cluster.length}</div>
              <div className="snapshot-label">{t('msp.snapshotProjects')}</div>
              <div className="snapshot-note">{cluster.map((p) => p.project_id).join(', ')}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{hardBlockers.length}</div>
              <div className="snapshot-label">{t('msp.snapshotHard')}</div>
              <div className="snapshot-note">{hardBlockers.length === 0 ? t('msp.snapshotHardNone') : hardBlockers.map((p) => p.project_id).join(', ')}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{softBlockers.length}</div>
              <div className="snapshot-label">{t('msp.snapshotSoft')}</div>
              <div className="snapshot-note">{t('msp.snapshotSoftNote')}</div>
            </div>
          </div>
          <div className="sub">
            {t('msp.footerNote', { n: cluster.length })}
          </div>

          <button className="btn" style={{ marginTop: 10 }} onClick={() => setReportMsg(t('msp.reportMsg'))}>
            {t('msp.generateReport')}
          </button>
          {reportMsg && (
            <div className="card pad" style={{ marginTop: 8, borderLeft: '4px solid #3F9162' }}>
              {reportMsg}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="section">{t('protectedAreas.section')}</div>
          <div className="card pad">
            <div className="title">{t('protectedAreas.title')}</div>
            <div className="sub">{t('protectedAreas.sub')}</div>
          </div>

          <div className="project-snapshot">
            <div className="snapshot-card">
              <div className="snapshot-number">{areas.length}</div>
              <div className="snapshot-label">{t('protectedAreas.statTotal')}</div>
              <div className="snapshot-note">{t('protectedAreas.statTotalNote')}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{marineCount}</div>
              <div className="snapshot-label">{t('protectedAreas.statMarine')}</div>
              <div className="snapshot-note">{t('protectedAreas.statMarineNote')}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{areas.length - marineCount}</div>
              <div className="snapshot-label">{t('protectedAreas.statTerrestrial')}</div>
              <div className="snapshot-note">{t('protectedAreas.statTerrestrialNote')}</div>
            </div>
            <div className="snapshot-card">
              <div className="snapshot-number">{totalAreaKm2 >= 1000 ? `${(totalAreaKm2 / 1000).toFixed(1)}k` : totalAreaKm2.toFixed(0)}</div>
              <div className="snapshot-label">{t('protectedAreas.statArea')}</div>
              <div className="snapshot-note">{t('protectedAreas.statAreaNote')}</div>
            </div>
          </div>

          <div className="search-row">
            <input
              className="search-input"
              placeholder={t('protectedAreas.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="gm-filters gm-filters-4">
            <div>
              <div className="gm-filter-label">{t('protectedAreas.filterType')}</div>
              <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value={ALL}>{t('protectedAreas.typeAll')}</option>
                <option value="Marine">{t('protectedAreas.typeMarine')}</option>
                <option value="Terrestrial">{t('protectedAreas.typeTerrestrial')}</option>
              </select>
            </div>
            <div>
              <div className="gm-filter-label">{t('protectedAreas.filterDesignation')}</div>
              <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
                <option value={ALL}>{t('common.allStatuses')}</option>
                {designationOptions.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <div className="gm-filter-label">{t('protectedAreas.filterIucn')}</div>
              <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={iucnFilter} onChange={(e) => setIucnFilter(e.target.value)}>
                <option value={ALL}>{t('common.allStatuses')}</option>
                {iucnOptions.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div />
            <button className="gm-reset" onClick={resetFilters}>{t('globalMap.resetFilters')}</button>
          </div>

          <AcehMap markers={[]} highlightId={selectedId} onAreaSelect={selectArea} />
          <div className="gm-legend">
            <span><span className="gm-legend-dot" style={{ background: 'rgba(18,153,155,.55)', border: '1px solid #12999B' }} />{t('protectedAreas.legendMarine')}</span>
            <span><span className="gm-legend-dot" style={{ background: 'rgba(63,145,98,.5)', border: '1px solid #3F9162' }} />{t('protectedAreas.legendTerrestrial')}</span>
          </div>
          <div className="sub" style={{ marginTop: 6 }}>{t('protectedAreas.mapCaption')}</div>
          <div className="sub" style={{ marginTop: 2, fontSize: '.52rem' }}>{t('protectedAreas.sourceCitation')}</div>

          <div className="section">{t('protectedAreas.matchingSection', { n: view.length, total: areas.length })}</div>

          {view.length === 0 ? (
            <div className="card pad">
              <div className="title">{t('protectedAreas.noneTitle')}</div>
              <div className="sub">{t('protectedAreas.noneSub')}</div>
            </div>
          ) : (
            view.map((a) => (
              <button
                key={a.wdpa_site_id}
                className="list-row"
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  borderColor: selectedId === a.wdpa_site_id ? 'var(--navy)' : undefined,
                  borderWidth: selectedId === a.wdpa_site_id ? 2 : 1,
                }}
                onClick={() => selectArea(a)}
              >
                <div className="list-row-main">
                  <div className="list-row-title">
                    {a.name}
                    <span className="tag" style={{ marginLeft: 6 }}>{a.marine ? t('protectedAreas.legendMarine') : t('protectedAreas.legendTerrestrial')}</span>
                  </div>
                  <div className="list-row-sub">
                    {a.designation} · {t('protectedAreas.cellIucn')}: {a.iucn_category} · {t('protectedAreas.cellArea')}: {fmtKm2(a.area_km2)}
                    {a.marine_area_km2 > 0 ? ` (${t('protectedAreas.cellMarineArea')}: ${fmtKm2(a.marine_area_km2)})` : ''}
                    {' · '}{a.status_year ? `${t('protectedAreas.cellStatusYear')} ${a.status_year}` : t('protectedAreas.statusYearUnknown')}
                  </div>
                </div>
              </button>
            ))
          )}

          <div className="sub" style={{ marginTop: 10 }}>{t('protectedAreas.otherCountriesNote')}</div>
        </>
      )}
    </>
  );
}
