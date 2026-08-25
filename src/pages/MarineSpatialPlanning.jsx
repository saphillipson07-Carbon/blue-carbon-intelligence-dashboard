import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcehMap from '../components/AcehMap';
import { useApp } from '../AppContext';
import { projects } from '../data';

// Real, verified project cluster (see Projects Explorer for full source
// citations on each record) — used as a worked example for the MSP
// workflow rather than a fabricated scenario. Coordinates are regency
// (district)-level centroids for real, named administrative areas in Aceh
// where Yagasu operates — not exact project site coordinates, which aren't
// publicly available for these projects.
const CLUSTER_IDS = ['BC-101', 'BC-102', 'BC-103'];
const CLUSTER_LOCATIONS = {
  'BC-101': { lat: 5.4, lon: 95.4, regency: 'Aceh Besar' },
  'BC-102': { lat: 5.0, lon: 97.1, regency: 'Aceh Utara' },
  'BC-103': { lat: 4.6, lon: 97.6, regency: 'Aceh Timur' },
};

function parseHa(v) {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function MarineSpatialPlanning() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [reportMsg, setReportMsg] = useState(null);

  const cluster = CLUSTER_IDS.map((id) => projects.find((p) => p.project_id === id)).filter(Boolean);
  const totalHa = cluster.reduce((sum, p) => sum + parseHa(p.area_ha), 0);
  const hardBlockers = cluster.filter((p) => p.blocker_type === 'Hard blocker');
  const softBlockers = cluster.filter((p) => p.blocker_type === 'Soft blocker');
  const STANDARD_KEYWORDS = ['Verra', 'Gold Standard', 'Plan Vivo', 'JCM', 'ICVCM'];
  const standards = [...new Set(cluster.flatMap((p) => STANDARD_KEYWORDS.filter((k) => p.standard?.includes(k))))];

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

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
        markers={cluster.map((p) => ({ id: p.project_id, ...CLUSTER_LOCATIONS[p.project_id] }))}
        onSelect={(m) => navigate(`/projects/${m.id}`)}
      />
      <div className="sub" style={{ marginTop: 6 }}>
        Real coastline (Indonesia, MIT-licensed <a href="https://github.com/simonepri/geo-maps" target="_blank" rel="noreferrer">@geo-maps/countries-land-10km</a>, OSM/Natural Earth-derived)
        and 59 real protected areas for Aceh &amp; North Sumatra from the <a href="https://www.protectedplanet.net/country/IDN" target="_blank" rel="noreferrer">World Database on Protected Areas</a> (teal = marine, green = terrestrial/mixed — hover a shape for details).
        Markers are placed at regency (district)-level centroids — {cluster.map((p) => `${p.project_id} in ${CLUSTER_LOCATIONS[p.project_id].regency}`).join(', ')} —
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
  );
}
