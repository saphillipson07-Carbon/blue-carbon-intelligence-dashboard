import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data';

// Real, verified project cluster (see Projects Explorer for full source
// citations on each record) — used as a worked example for the MSP
// workflow rather than a fabricated scenario. Screen positions are
// illustrative placement along a schematic coastline, not GPS coordinates;
// none of these projects have publicly mapped boundaries.
const CLUSTER_COUNTRY = 'Indonesia';
const CLUSTER_IDS = ['BC-101', 'BC-102', 'BC-103'];
const CLUSTER_POSITIONS = { 'BC-101': { x: 40, y: 32 }, 'BC-102': { x: 62, y: 46 }, 'BC-103': { x: 50, y: 66 } };

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
      <div
        style={{
          position: 'relative',
          height: 320,
          borderRadius: 8,
          background: 'linear-gradient(160deg, #EAF4F8 0%, #DCEEF2 60%, #CFE8ED 100%)',
          border: '1px solid var(--line)',
          overflow: 'hidden',
        }}
      >
        <div
          title={`Assessment area — ${totalHa.toLocaleString()} ha across ${cluster.length} projects`}
          style={{
            position: 'absolute', left: '50%', top: '48%', transform: 'translate(-50%, -50%)',
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(18,153,155,.14)', border: '2px dashed #12999B',
          }}
        />
        {cluster.map((p) => {
          const pos = CLUSTER_POSITIONS[p.project_id] || { x: 50, y: 50 };
          return (
            <button
              key={p.project_id}
              title={`${p.project_id} · ${p.ecosystem} · ${p.stage} — click to open`}
              onClick={() => navigate(`/projects/${p.project_id}`)}
              style={{
                position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)',
                width: 16, height: 16, borderRadius: '50%', background: '#12999B',
                border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,.25)', cursor: 'pointer', padding: 0,
              }}
            />
          );
        })}
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '.55rem', color: 'var(--muted)', background: 'rgba(255,255,255,.85)', padding: '4px 8px', borderRadius: 6 }}>
          🌊 Assessment area &nbsp;&nbsp; ● Verified project (click to open)
        </div>
      </div>
      <div className="sub" style={{ marginTop: 6 }}>
        Pin placement is illustrative — these projects don't have publicly mapped boundaries. Project identities, area and status are real
        (see <a href="#/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>Projects Explorer</a> for sources).
        Interactive polygon drawing over real satellite/GIS layers would be a further build, not simulated here.
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
