import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { findProject } from '../data';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useApp();
  const r = findProject(projectId);

  if (!r) {
    return (
      <>
        <div className="card pad">{t('projectDetail.notFound')}</div>
        <button className="btn" onClick={() => navigate('/projects')}>{t('projectDetail.backToProjects')}</button>
      </>
    );
  }

  const details = [
    [t('projectDetail.labelProjectId'), r.project_id],
    [t('projectDetail.labelCountry'), r.country],
    [t('projectDetail.labelEcosystem'), r.ecosystem],
    [t('projectDetail.labelStage'), r.stage],
  ];

  return (
    <>
      <button className="btn" onClick={() => navigate('/projects')}>{t('projectDetail.backToExplorer')}</button>

      <div className="detail-head">
        <div className="kicker">{t('projectDetail.kickerPrefix')} {r.project_id}</div>
        <div className="detail-title">{r.country} · {r.ecosystem}</div>
        <div className="detail-sub">{r.stage} · {r.assessment_stage} · {t('projectDetail.noReadinessScore')}</div>
        <div className="path">
          <div className="step done">{t('projectDetail.stepConcept')}</div>
          <div className="step done">{t('projectDetail.stepMethodology')}</div>
          <div className="step current">{t('projectDetail.stepDevelopment')}</div>
          <div className="step">{t('projectDetail.stepHostCountry')}</div>
          <div className="step">{t('projectDetail.stepAuthorization')}</div>
          <div className="step">{t('projectDetail.stepIssuance')}</div>
        </div>
      </div>

      <div className="section">{t('projectDetail.recordSection')}</div>
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
          <div className="section">{t('projectDetail.verifiedSection')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              [t('projectDetail.labelDeveloper'), r.developer],
              [t('projectDetail.labelBuyer'), r.buyer],
              [t('projectDetail.labelStandard'), r.standard],
              [t('projectDetail.labelArea'), r.area_ha ? `${r.area_ha} ha` : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div className="card pad" key={label}>
                <div style={{ fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          {r.credits_estimate && (
            <div className="card pad" style={{ marginTop: 10 }}>
              <div style={{ fontSize: '.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{t('projectDetail.labelCredits')}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{r.credits_estimate}</div>
            </div>
          )}
        </>
      )}

      <div className="section">{t('projectDetail.caasSection')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card pad">
          <div className="title">{t('projectDetail.currentAssessment')}</div>
          <div className="sub">{t('projectDetail.caasStageSub')}</div>
          <div style={{ marginTop: 8 }}><Badge value={r.assessment_stage} /></div>
        </div>
        <div className="card pad">
          <div className="title">{t('projectDetail.blockerStatus')}</div>
          <div className="sub">{t('projectDetail.blockerStatusSub')}</div>
          <div style={{ marginTop: 8 }}><Badge value={r.blocker_type} /></div>
          <div className="sub" style={{ marginTop: 7 }}><b>{r.primary_blocker}</b></div>
        </div>
      </div>

      <div className="section">{t('projectDetail.nextSection')}</div>
      <div className="blocker">
        <b style={{ fontSize: '.65rem', color: 'var(--red)' }}>{t('projectDetail.priorityAction')}</b>
        <div style={{ fontSize: '.65rem', marginTop: 4 }}>
          {t('projectDetail.priorityActionText', { blocker: r.primary_blocker?.toLowerCase() })}
        </div>
        <div style={{ fontSize: '.58rem', color: 'var(--muted)', marginTop: 5 }}>{r.transaction_note}</div>
      </div>

      {r.verified && r.source && (
        <div className="sub" style={{ marginTop: 10 }}>
          <b>{t('projectDetail.sourceLabel')}</b> <a href={r.source} target="_blank" rel="noreferrer">{r.source_label || r.source}</a>
          {r.last_verified && <> {t('projectDetail.lastChecked', { date: r.last_verified })}</>}
        </div>
      )}
    </>
  );
}
