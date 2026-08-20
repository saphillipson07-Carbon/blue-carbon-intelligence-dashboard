import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcehMap from '../components/AcehMap';
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
  const [reportMsg, setReportMsg] = useState(null);

  const cluster = CLUSTER_IDS.map((id) => projects.find((p) => p.project_id === id)).filter(Boolean);
  const totalHa = cluster.reduce((sum, p) => sum + parseHa(p.area_ha), 0);
  const hardBlockers = cluster.filter((p) => p.blocker_type === 'Hard blocker');
  const softBlockers = cluster.filter((p) => p.blocker_type === 'Soft blocker');
  const STANDARD_KEYWORDS = ['Verra', 'Gold Standard', 'Plan Vivo', 'JCM', 'ICVCM'];
  const standards = [...new Set(cluster.flatMap((p) => STANDARD_KEYWORDS.filter((k) => p.standard?.includes(k))))];

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Marine Spatial Planning & Opportunity Assessment</div>
      <div className="detail-head">
        <div className="kicker">SPATIAL DECISION SUPPORT</div>
        <div className="detail-title">Where could a blue carbon project be developed?</div>
        <div className="detail-sub">A guided, four-step area assessment — not a suitability score.</div>
        <div className="path">
          <div className="step done">1 · Select Area</div>
          <div className="step current">2 · Assess Area</div>
          <div className="step">3 · Review Results</div>
          <div className="step">4 · Generate Report</div>
        </div>
      </div>

      <div className="section">Selected area — Aceh & North Sumatra, Indonesia (verified project cluster)</div>
      <AcehMap
        markers={cluster.map((p) => ({ id: p.project_id, ...CLUSTER_LOCATIONS[p.project_id] }))}
        onSelect={(m) => navigate(`/projects/${m.id}`)}
      />
      <div className="sub" style={{ marginTop: 6 }}>
        Real coastline (Indonesia, MIT-licensed <a href="https://github.com/simonepri/geo-maps" target="_blank" rel="noreferrer">@geo-maps/countries-land-10km</a>, OSM/Natural Earth-derived).
        Markers are placed at regency (district)-level centroids — {cluster.map((p) => `${p.project_id} in ${CLUSTER_LOCATIONS[p.project_id].regency}`).join(', ')} —
        not exact project site coordinates, which aren't publicly available. Click a marker to open that project's record.
        Marine protected area boundaries are not yet overlaid — the authoritative WDPA source is currently unreachable from this environment's
        network policy; see <a href="#/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>Projects Explorer</a> for full source citations.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div className="card pad">
          <div className="title">Opportunities</div>
          <div className="sub">Suitable mangrove ecosystem present, with an established developer track record (Yagasu, active since 2015)</div>
          <div className="sub">Methodologies available: {standards.join(', ') || 'Not publicly available'}</div>
          <div className="sub">Indonesia's Article 6 framework is Operational, with LoAs issued in 2025</div>
          <div className="sub">{hardBlockers.length === 0 ? 'No hard blockers identified across the 3 verified projects in this cluster' : `${hardBlockers.length} hard blocker(s) identified — see below`}</div>
        </div>
        <div className="blocker" style={{ marginTop: 0, borderLeftColor: '#D28A2E', background: '#FFF8EE' }}>
          <b style={{ fontSize: '.65rem', color: '#D28A2E' }}>Considerations (from verified project records)</b>
          <div style={{ fontSize: '.62rem', marginTop: 5 }}>
            {cluster.map((p) => `${p.project_id}: ${p.primary_blocker}`).join(' · ')}
          </div>
        </div>
      </div>

      <div className="section">Area assessment summary</div>
      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{totalHa.toLocaleString()}</div>
          <div className="snapshot-label">Area (ha)</div>
          <div className="snapshot-note">Combined across {cluster.length} verified projects</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{cluster.length}</div>
          <div className="snapshot-label">Existing projects nearby</div>
          <div className="snapshot-note">{cluster.map((p) => p.project_id).join(', ')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{hardBlockers.length}</div>
          <div className="snapshot-label">Hard constraints</div>
          <div className="snapshot-note">{hardBlockers.length === 0 ? 'None identified' : hardBlockers.map((p) => p.project_id).join(', ')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{softBlockers.length}</div>
          <div className="snapshot-label">Soft constraints</div>
          <div className="snapshot-note">Require further investigation</div>
        </div>
      </div>
      <div className="sub">
        Screening-level finding only — not confirmed feasibility. Area and blocker figures are aggregated from the 3 verified project records
        above; broader spatial data (MSP zones, protected areas, tenure) are not yet integrated and would need real GIS layers.
      </div>

      <button className="btn" style={{ marginTop: 10 }} onClick={() => setReportMsg('Illustrative only — report generation is not wired up in this prototype.')}>
        Generate Area Assessment Report →
      </button>
      {reportMsg && (
        <div className="card pad" style={{ marginTop: 8, borderLeft: '4px solid #3F9162' }}>
          {reportMsg}
        </div>
      )}
    </>
  );
}
