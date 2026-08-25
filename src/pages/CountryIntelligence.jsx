import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Donut from '../components/Donut';
import { useApp } from '../AppContext';
import { countries, bilateral, markets, methodologies, news, projectsForCountry, STATUS_COLS } from '../data';

function fmtHa(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M ha`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k ha`;
  return `${n} ha`;
}

export default function CountryIntelligence() {
  const navigate = useNavigate();
  const { selectedCountry, setSelectedCountry } = useApp();
  const [downloadMsg, setDownloadMsg] = useState(null);
  const row = countries.find((c) => c.country === selectedCountry) || countries[0];
  const bc = row.blue_carbon;

  const countryProjects = projectsForCountry(row.country);
  const partners = bilateral.filter((b) => b.country_a === row.country || b.country_b === row.country);
  const marketRow = markets.find((m) => m.country === row.country);
  const countryNews = useMemo(
    () => news.filter((n) => n.country === row.country).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [row.country]
  );
  const timeline = useMemo(() => [...countryNews].reverse(), [countryNews]);

  const ecosystemKeys = useMemo(
    () => [...new Set(countryProjects.map((p) => p.ecosystem?.split(' ')[0]).filter(Boolean))],
    [countryProjects]
  );
  const applicableMethodologies = useMemo(
    () => methodologies.filter((m) => ecosystemKeys.some((k) => m.ecosystem.toLowerCase().includes(k.toLowerCase()))),
    [ecosystemKeys]
  );

  const indicators = Object.entries(STATUS_COLS);

  const goExplorer = (path) => navigate(path);
  const goProject = (id) => navigate(`/projects/${id}`);

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="ci-head card pad" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="flag">{row.iso}</span>
            <span style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--navy)' }}>{row.country}</span>
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge value={row.market_role} />
              {row.verified && <span className="badge good">Verified · {row.last_verified}</span>}
            </div>
            <div className="sub" style={{ marginTop: 4 }}>{row.region} · {row.income_group}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <select
              className="select-input"
              style={{ marginBottom: 0 }}
              value={row.country}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((c) => <option key={c.iso}>{c.country}</option>)}
            </select>
            <button className="btn" style={{ marginTop: 0 }} onClick={() => navigate('/map')}>View in Map →</button>
            <button className="btn" style={{ marginTop: 0, background: 'var(--blue)' }} onClick={() => setDownloadMsg('Illustrative only — profile export is not wired up in this prototype.')}>
              ↓ Download Profile
            </button>
          </div>
        </div>
        {downloadMsg && <div className="sub" style={{ marginTop: 8, color: 'var(--blue)' }}>{downloadMsg}</div>}
        {row.notes && <div className="sub" style={{ marginTop: 10 }}>{row.notes}</div>}
      </div>

      <div className="section">Country snapshot</div>
      <div className="project-snapshot" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="snapshot-card">
          <div className="snapshot-number">{bc ? fmtHa(bc.mangrove_area_ha) : '—'}</div>
          <div className="snapshot-label">Mangrove area</div>
          <div className="snapshot-note">{bc ? '2021 National Mangrove Map' : 'Not publicly available'}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{countryProjects.length}</div>
          <div className="snapshot-label">Tracked projects</div>
          <div className="snapshot-note">In this sample, not a national total</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{applicableMethodologies.length}</div>
          <div className="snapshot-label">Applicable methodologies</div>
          <div className="snapshot-note">By ecosystem type present here</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{partners.length}</div>
          <div className="snapshot-label">Bilateral agreements</div>
          <div className="snapshot-note">Article 6.2 cooperation</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginTop: 4 }}>
        <div className="card pad">
          <div className="title">Policy &amp; framework timeline<span className="card-link" onClick={() => goExplorer('/policy')}>View Article 6 &amp; Policy →</span></div>
          <div className="sub">Dated, sourced events for {row.country} from tracked news and agreements.</div>
          {timeline.length === 0 ? (
            <div className="sub" style={{ marginTop: 10 }}>No dated policy timeline events available for this country in the current sample.</div>
          ) : (
            <div className="ci-timeline">
              {timeline.map((n, i) => (
                <div className="ci-timeline-item" key={i}>
                  <div className="ci-timeline-dot" />
                  <div className="ci-timeline-body">
                    <div className="ci-timeline-date">{n.date} <span className="tag" style={{ marginLeft: 4 }}>{n.type}</span></div>
                    <div className="ci-timeline-label">{n.headline}</div>
                    {n.source && <a className="ci-timeline-source" href={n.source} target="_blank" rel="noreferrer">{n.source_label || 'Source'} →</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card pad">
          <div className="title">Article 6 status</div>
          <div className="sub">Facts only — never a readiness score.</div>
          <div className="gm-indicator-grid" style={{ marginTop: 8 }}>
            {indicators.map(([label, field]) => (
              <div className="gm-indicator-cell" key={field}>
                <div className="gm-indicator-label">{label}</div>
                <div style={{ marginTop: 4 }}><Badge value={row[field]} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div className="card pad">
          <div className="title">Market role &amp; Article 6 cooperation partners</div>
          <div style={{ marginTop: 6 }}><Badge value={row.market_role} /></div>
          {partners.length === 0 ? (
            <div className="sub" style={{ marginTop: 10 }}>No bilateral Article 6 agreements recorded for this country in the current sample.</div>
          ) : (
            partners.map((p, i) => {
              const other = p.country_a === row.country ? p.country_b : p.country_a;
              return (
                <div className="mini-row" key={i} style={{ alignItems: 'flex-start' }}>
                  <div className="mini-row-main">
                    <span className="mini-row-title">{other}</span>
                    <div className="mini-row-sub">Signed {p.signed}{p.note ? ` · ${p.note}` : ''}</div>
                    {p.source && <a className="ci-timeline-source" href={p.source} target="_blank" rel="noreferrer">{p.source_label || 'Source'} →</a>}
                  </div>
                  <Badge value={p.status} />
                </div>
              );
            })
          )}
          <button className="btn" style={{ width: '100%', textAlign: 'center', marginTop: 10 }} onClick={() => goExplorer('/policy')}>
            See all agreements →
          </button>
        </div>

        <div className="card pad">
          <div className="title">NDC commitments &amp; blue carbon inclusion</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="gm-indicator-label" style={{ minHeight: 0 }}>Blue carbon in NDC</span>
            <Badge value={row.blue_carbon_ndc} />
          </div>
          {bc?.ndc_mangrove_target_note ? (
            <>
              <div className="sub" style={{ marginTop: 10 }}>{bc.ndc_mangrove_target_note}</div>
              {bc.ndc_target_source && <a className="ci-timeline-source" href={bc.ndc_target_source} target="_blank" rel="noreferrer">{bc.ndc_target_source_label || 'Source'} →</a>}
            </>
          ) : (
            <div className="sub" style={{ marginTop: 10 }}>Specific NDC blue carbon targets not publicly available / not yet verified for this country in the current sample.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div className="card pad">
          <div className="title">Domestic carbon market<span className="card-link" onClick={() => goExplorer('/markets')}>View Carbon Markets →</span></div>
          {!marketRow ? (
            <div className="sub" style={{ marginTop: 10 }}>No domestic carbon market record for this country in the current sample.</div>
          ) : (
            <table className="mini-table">
              <tbody>
                <tr><td>Market</td><td><b>{marketRow.market_name}</b></td></tr>
                <tr><td>Type</td><td>{marketRow.market_type}</td></tr>
                <tr><td>Status</td><td><Badge value={marketRow.status} /></td></tr>
                <tr><td>Article 6 integration</td><td><Badge value={marketRow.article6_integration} /></td></tr>
                <tr><td>Registry</td><td>{marketRow.registry}</td></tr>
                <tr><td>Platform</td><td>{marketRow.platform}</td></tr>
                {marketRow.price_note && <tr><td>Price / activity</td><td style={{ fontSize: '.58rem' }}>{marketRow.price_note}</td></tr>}
              </tbody>
            </table>
          )}
          {marketRow?.source && <a className="ci-timeline-source" href={marketRow.source} target="_blank" rel="noreferrer">{marketRow.source_label || 'Source'} →</a>}
        </div>

        <div className="card pad">
          <div className="title">Blue carbon ecosystems<span className="card-link" onClick={() => goExplorer('/methodologies')}>View Methodologies →</span></div>
          {!bc ? (
            <div className="sub" style={{ marginTop: 10 }}>Ecosystem-level area data not yet verified for this country in the current sample.</div>
          ) : (
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: 4 }}>
              <Donut
                pct={Math.round((bc.mangrove_dense_ha / bc.mangrove_area_ha) * 100)}
                centerNum={`${Math.round((bc.mangrove_dense_ha / bc.mangrove_area_ha) * 100)}%`}
                centerLabel="Dense canopy"
                color="#3F9162"
              />
              <div style={{ flex: 1 }}>
                <div className="sub"><b>Mangrove:</b> {bc.mangrove_area_note}</div>
                <div className="sub" style={{ marginTop: 6 }}><b>Seagrass:</b> {bc.seagrass_area_note}</div>
                <div className="sub" style={{ marginTop: 6 }}><b>Salt marsh:</b> {bc.salt_marsh_note}</div>
                <div className="sub" style={{ marginTop: 6 }}><b>Mitigation potential:</b> {bc.mitigation_potential_note}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a className="ci-timeline-source" href={bc.mangrove_area_source} target="_blank" rel="noreferrer">{bc.mangrove_area_source_label} →</a>
                  <a className="ci-timeline-source" href={bc.mitigation_potential_source} target="_blank" rel="noreferrer">{bc.mitigation_potential_source_label} →</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginTop: 12 }}>
        <div className="card pad">
          <div className="title">Project pipeline<span className="card-link" onClick={() => goExplorer('/projects')}>View Projects →</span></div>
          {countryProjects.length === 0 ? (
            <div className="sub" style={{ marginTop: 10 }}>No project records for this country in the current sample.</div>
          ) : (
            countryProjects.map((p) => (
              <button key={p.project_id} className="project-row" style={{ width: '100%', textAlign: 'left', display: 'block' }} onClick={() => goProject(p.project_id)}>
                <span className="project-link">{p.project_id} · {p.ecosystem} · {p.stage} →</span>
                {p.verified && <span className="badge good" style={{ marginLeft: 8, fontSize: '.5rem' }}>Verified</span>}
                <div className="project-meta">{p.assessment_stage}</div>
              </button>
            ))
          )}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="pad" style={{ paddingBottom: 0 }}>
            <div className="title">Live intelligence<span className="card-link" onClick={() => goExplorer('/news')}>View all →</span></div>
            <div className="sub">Latest tracked updates for {row.country}.</div>
          </div>
          {countryNews.length === 0 ? (
            <div className="sub pad">No tracked news items for this country in the current sample.</div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {countryNews.slice(0, 5).map((n, i) => (
                <div className="news-item" key={i}>
                  <span className="tag">{n.type}</span>
                  <span className="date">{n.date}</span>
                  <div className="headline">
                    {n.source ? <a href={n.source} target="_blank" rel="noreferrer">{n.headline}</a> : n.headline}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {row.sources && row.sources.length > 0 && (
        <>
          <div className="section">Key documents &amp; sources</div>
          <div className="card pad">
            {row.sources.map((s, i) => (
              <div key={i} style={{ fontSize: '.62rem', marginTop: i ? 6 : 0 }}>
                <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section">Explore further</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => goExplorer('/policy')}>Article 6 &amp; Policy →</button>
        <button className="btn" onClick={() => goExplorer('/markets')}>Carbon Markets →</button>
        <button className="btn" onClick={() => goExplorer('/methodologies')}>Methodologies →</button>
        <button className="btn" onClick={() => goExplorer('/projects')}>Projects →</button>
        <button className="btn" onClick={() => goExplorer('/news')}>News &amp; Intelligence →</button>
        {row.country === 'Indonesia' && (
          <button className="btn" onClick={() => goExplorer('/msp')}>Marine Spatial Planning →</button>
        )}
      </div>
    </>
  );
}
