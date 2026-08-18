import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLE_POINTS = [
  { label: 'Selected area (14,250 ha)', x: 48, y: 50, kind: 'area' },
  { label: 'BC-001 Mangrove Restoration (Development)', x: 62, y: 34, kind: 'project' },
  { label: 'BC-002 Seagrass Restoration (Validation)', x: 36, y: 68, kind: 'project' },
];

export default function MarineSpatialPlanning() {
  const navigate = useNavigate();
  const [reportMsg, setReportMsg] = useState(null);

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

      <div className="section">Selected area — Cenderawasih Bay, Indonesia (example)</div>
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
        {EXAMPLE_POINTS.map((p, i) => (
          <div
            key={i}
            title={p.label}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              width: p.kind === 'area' ? 90 : 14,
              height: p.kind === 'area' ? 90 : 14,
              borderRadius: '50%',
              background: p.kind === 'area' ? 'rgba(18,153,155,.18)' : '#12999B',
              border: p.kind === 'area' ? '2px dashed #12999B' : '2px solid white',
              boxShadow: p.kind === 'project' ? '0 1px 4px rgba(0,0,0,.25)' : 'none',
            }}
          />
        ))}
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '.55rem', color: 'var(--muted)', background: 'rgba(255,255,255,.85)', padding: '4px 8px', borderRadius: 6 }}>
          🌊 Selected area &nbsp;&nbsp; ● Active project
        </div>
      </div>
      <div className="sub" style={{ marginTop: 6 }}>
        Area drawing/upload tools are illustrative in this prototype; a production build would support interactive polygon drawing.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div className="card pad">
          <div className="title">Opportunities</div>
          <div className="sub">Suitable ecosystem present</div>
          <div className="sub">Adequate area for development</div>
          <div className="sub">Methodologies available (VM0033)</div>
          <div className="sub">Potential Article 6 pathway</div>
        </div>
        <div className="blocker" style={{ marginTop: 0, borderLeftColor: '#D28A2E', background: '#FFF8EE' }}>
          <b style={{ fontSize: '.65rem', color: '#D28A2E' }}>Considerations</b>
          <div style={{ fontSize: '.62rem', marginTop: 5 }}>
            Protected area overlap · Land tenure unverified · Community consultation needed · Data gaps in local mapping
          </div>
        </div>
      </div>

      <div className="section">Area assessment summary</div>
      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">14,250</div>
          <div className="snapshot-label">Area (ha)</div>
          <div className="snapshot-note">Mangrove ecosystem</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">2</div>
          <div className="snapshot-label">Existing projects nearby</div>
          <div className="snapshot-note">BC-001, BC-002</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">0</div>
          <div className="snapshot-label">Hard constraints</div>
          <div className="snapshot-note">None identified</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">4</div>
          <div className="snapshot-label">Soft constraints</div>
          <div className="snapshot-note">Require further investigation</div>
        </div>
      </div>
      <div className="sub">Screening-level finding only — not confirmed feasibility. All spatial data are indicative and require field verification.</div>

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
