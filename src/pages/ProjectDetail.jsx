import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { findProject } from '../data';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const r = findProject(projectId);

  if (!r) {
    return (
      <>
        <div className="card pad">Project record not found.</div>
        <button className="btn" onClick={() => navigate('/projects')}>← Back to Projects</button>
      </>
    );
  }

  const details = [
    ['Project ID', r.project_id],
    ['Country', r.country],
    ['Ecosystem', r.ecosystem],
    ['Stage', r.stage],
  ];

  return (
    <>
      <button className="btn" onClick={() => navigate('/projects')}>← Back to Project Explorer</button>

      <div className="detail-head">
        <div className="kicker">PROJECT INTELLIGENCE · {r.project_id}</div>
        <div className="detail-title">{r.country} · {r.ecosystem}</div>
        <div className="detail-sub">{r.stage} · {r.assessment_stage} · No readiness score assigned</div>
        <div className="path">
          <div className="step done">Concept</div>
          <div className="step done">Methodology</div>
          <div className="step current">Development</div>
          <div className="step">Host Country</div>
          <div className="step">Authorization</div>
          <div className="step">Issuance / ITMO</div>
        </div>
      </div>

      <div className="section">Project record</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {details.map(([label, value]) => (
          <div className="card pad" key={label}>
            <div style={{ fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </div>

      {r.verified && (
        <>
          <div className="section">Verified project record</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              ['Developer', r.developer],
              ['Buyer / Offtake', r.buyer],
              ['Standard', r.standard],
              ['Area', r.area_ha ? `${r.area_ha} ha` : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div className="card pad" key={label}>
                <div style={{ fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          {r.credits_estimate && (
            <div className="card pad" style={{ marginTop: 10 }}>
              <div style={{ fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Estimated credits</div>
              <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{r.credits_estimate}</div>
            </div>
          )}
        </>
      )}

      <div className="section">CAAS / transaction assessment</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card pad">
          <div className="title">Current assessment</div>
          <div className="sub">CAAS assessment stage</div>
          <div style={{ marginTop: 8 }}><Badge value={r.assessment_stage} /></div>
        </div>
        <div className="card pad">
          <div className="title">Blocker status</div>
          <div className="sub">Issue preventing or slowing transaction progress</div>
          <div style={{ marginTop: 8 }}><Badge value={r.blocker_type} /></div>
          <div className="sub" style={{ marginTop: 7 }}><b>{r.primary_blocker}</b></div>
        </div>
      </div>

      <div className="section">What needs to happen next</div>
      <div className="blocker">
        <b style={{ fontSize: '.65rem', color: 'var(--red)' }}>Priority action</b>
        <div style={{ fontSize: '.65rem', marginTop: 4 }}>
          Confirm and document the {r.primary_blocker?.toLowerCase()} and its implications for the host-country Article 6 pathway.
        </div>
        <div style={{ fontSize: '.58rem', color: 'var(--muted)', marginTop: 5 }}>{r.transaction_note}</div>
      </div>

      {r.verified && r.source && (
        <div className="sub" style={{ marginTop: 10 }}>
          <b>Source:</b> <a href={r.source} target="_blank" rel="noreferrer">{r.source_label || r.source}</a>
          {r.last_verified && <> · last checked {r.last_verified}</>}
        </div>
      )}
    </>
  );
}
