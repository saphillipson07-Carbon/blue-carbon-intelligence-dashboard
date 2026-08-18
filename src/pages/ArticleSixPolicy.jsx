import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { countries, bilateral } from '../data';

const ALL = 'All';

export default function ArticleSixPolicy() {
  const navigate = useNavigate();
  const { setSelectedCountry } = useApp();
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
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Article 6 & Policy Explorer</div>
      <div className="card pad">
        <div className="title">Article 6 & Policy Explorer</div>
        <div className="sub">National frameworks, NDC commitments, bilateral agreements and authorization status. Status vocabulary only — no composite scores.</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{opCount}</div>
          <div className="snapshot-label">Article 6 frameworks implemented</div>
          <div className="snapshot-note">of {countries.length} countries tracked</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{ndcCount}</div>
          <div className="snapshot-label">Blue carbon in NDCs</div>
          <div className="snapshot-note">Implemented submissions</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{agreeCount}</div>
          <div className="snapshot-label">Bilateral agreements</div>
          <div className="snapshot-note">Operational cooperation</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{authCount}</div>
          <div className="snapshot-label">Authorizations issued</div>
          <div className="snapshot-note">Article 6 LoA activity</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value={ALL}>All framework statuses</option>
          {statusOptions.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="select-input" value={ndcFilter} onChange={(e) => setNdcFilter(e.target.value)}>
          <option value={ALL}>All NDC statuses</option>
          {ndcOptions.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="section">National frameworks & NDC commitments</div>
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
              DNA: <Badge value={r.dna_appointed} /> &nbsp; NDC blue carbon: <Badge value={r.blue_carbon_ndc} /> &nbsp; Authorization: <Badge value={r.article6_authorization} />
            </div>
          </div>
          <div><Badge value={r.article6_framework} /></div>
        </button>
      ))}

      <div className="section">Bilateral agreements</div>
      {bilateral.map((r, i) => (
        <div className="list-row" key={i}>
          <div className="list-row-main">
            <div className="list-row-title">{r.country_a} · {r.country_b}</div>
            <div className="list-row-sub">Signed {r.signed}</div>
          </div>
          <div><Badge value={r.status} /></div>
        </div>
      ))}
      <div className="sub">Data reflects illustrative records pending integration with verified UNFCCC and national sources.</div>
    </>
  );
}
