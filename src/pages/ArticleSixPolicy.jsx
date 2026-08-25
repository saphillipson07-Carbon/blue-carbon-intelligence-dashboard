import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { countries, bilateral } from '../data';

const ALL = 'All';

export default function ArticleSixPolicy() {
  const navigate = useNavigate();
  const { t, setSelectedCountry } = useApp();
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [ndcFilter, setNdcFilter] = useState(ALL);

  const opCount = countries.filter((c) => c.article6_framework === 'Implemented').length;
  const ndcCount = countries.filter((c) => c.blue_carbon_ndc === 'Implemented').length;
  const agreeCount = bilateral.filter((b) => b.status === 'Operational').length;
  const authCount = countries.filter((c) => c.article6_authorization === 'Implemented').length;

  const statusOptions = useMemo(() => [...new Set(countries.map((c) => c.article6_framework))].sort(), []);
  const ndcOptions = useMemo(() => [...new Set(countries.map((c) => c.blue_carbon_ndc))].sort(), []);

  const view = useMemo(
    () =>
      countries
        .filter((c) => statusFilter === ALL || c.article6_framework === statusFilter)
        .filter((c) => ndcFilter === ALL || c.blue_carbon_ndc === ndcFilter)
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country)),
    [statusFilter, ndcFilter]
  );

  const goCountry = (name) => {
    setSelectedCountry(name);
    navigate('/country');
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('policy.section')}</div>
      <div className="card pad">
        <div className="title">{t('policy.title')}</div>
        <div className="sub">{t('policy.sub')}</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{opCount}</div>
          <div className="snapshot-label">{t('policy.statFrameworks')}</div>
          <div className="snapshot-note">{t('policy.statFrameworksNote', { n: countries.length })}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{ndcCount}</div>
          <div className="snapshot-label">{t('policy.statNdc')}</div>
          <div className="snapshot-note">{t('policy.statNdcNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{agreeCount}</div>
          <div className="snapshot-label">{t('policy.statBilateral')}</div>
          <div className="snapshot-note">{t('policy.statBilateralNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{authCount}</div>
          <div className="snapshot-label">{t('policy.statAuth')}</div>
          <div className="snapshot-note">{t('policy.statAuthNote')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value={ALL}>{t('policy.allFrameworkStatuses')}</option>
          {statusOptions.map((v) => <option key={v} value={v}>{t(`status.${v}`)}</option>)}
        </select>
        <select className="select-input" value={ndcFilter} onChange={(e) => setNdcFilter(e.target.value)}>
          <option value={ALL}>{t('policy.allNdcStatuses')}</option>
          {ndcOptions.map((v) => <option key={v} value={v}>{t(`status.${v}`)}</option>)}
        </select>
      </div>

      <div className="section">{t('policy.frameworksSection')}</div>
      {view.map((r) => (
        <button
          key={r.iso}
          className="list-row"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => goCountry(r.country)}
        >
          <div className="list-row-main">
            <div className="list-row-title">{r.country}</div>
            <div className="list-row-sub">
              {t('policy.labelDna')} <Badge value={r.dna_appointed} /> &nbsp; {t('policy.labelNdc')} <Badge value={r.blue_carbon_ndc} /> &nbsp; {t('policy.labelAuth')} <Badge value={r.article6_authorization} />
            </div>
          </div>
          <div><Badge value={r.article6_framework} /></div>
        </button>
      ))}

      <div className="section">{t('policy.bilateralSection')}</div>
      {bilateral.map((r, i) => (
        <div className="list-row" key={i} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="list-row-main">
              <div className="list-row-title">
                {r.country_a} · {r.country_b}
                {r.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>{t('common.verified')}</span>}
              </div>
              <div className="list-row-sub">{t('policy.signed')} {r.signed}</div>
            </div>
            <div><Badge value={r.status} /></div>
          </div>
          {r.note && <div className="sub" style={{ marginTop: 6 }}>{r.note}</div>}
          {r.source && (
            <div className="sub" style={{ marginTop: 4 }}>
              <a href={r.source} target="_blank" rel="noreferrer">{r.source_label || t('common.source')}</a>
            </div>
          )}
        </div>
      ))}
      <div className="sub">{t('policy.footnote')}</div>
    </>
  );
}
