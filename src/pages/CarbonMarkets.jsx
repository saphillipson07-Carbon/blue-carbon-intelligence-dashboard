import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { countries, bilateral, markets } from '../data';

const ALL = 'All';

export default function CarbonMarkets() {
  const navigate = useNavigate();
  const { t, setSelectedCountry } = useApp();

  // Article 6 & policy state
  const [a6StatusFilter, setA6StatusFilter] = useState(ALL);
  const [ndcFilter, setNdcFilter] = useState(ALL);

  // Carbon markets state
  const [typeFilter, setTypeFilter] = useState(ALL);

  const opCount = countries.filter((c) => c.article6_framework === 'Implemented').length;
  const ndcCount = countries.filter((c) => c.blue_carbon_ndc === 'Implemented').length;
  const agreeCount = bilateral.filter((b) => b.status === 'Operational').length;
  const authCount = countries.filter((c) => c.article6_authorization === 'Implemented').length;

  const a6StatusOptions = useMemo(() => [...new Set(countries.map((c) => c.article6_framework))].sort(), []);
  const ndcOptions = useMemo(() => [...new Set(countries.map((c) => c.blue_carbon_ndc))].sort(), []);

  const a6View = useMemo(
    () =>
      countries
        .filter((c) => a6StatusFilter === ALL || c.article6_framework === a6StatusFilter)
        .filter((c) => ndcFilter === ALL || c.blue_carbon_ndc === ndcFilter)
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country)),
    [a6StatusFilter, ndcFilter]
  );

  const opMarkets = markets.filter((m) => m.status === 'Operational').length;
  const a6Markets = markets.filter((m) => m.article6_integration === 'Implemented').length;
  const countryCount = new Set(markets.map((m) => m.country)).size;
  const marketTypes = useMemo(() => [...new Set(markets.map((m) => m.market_type))].sort(), []);
  const marketsView = typeFilter === ALL ? markets : markets.filter((m) => m.market_type === typeFilter);

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
        <select className="select-input" value={a6StatusFilter} onChange={(e) => setA6StatusFilter(e.target.value)}>
          <option value={ALL}>{t('policy.allFrameworkStatuses')}</option>
          {a6StatusOptions.map((v) => <option key={v} value={v}>{t(`status.${v}`)}</option>)}
        </select>
        <select className="select-input" value={ndcFilter} onChange={(e) => setNdcFilter(e.target.value)}>
          <option value={ALL}>{t('policy.allNdcStatuses')}</option>
          {ndcOptions.map((v) => <option key={v} value={v}>{t(`status.${v}`)}</option>)}
        </select>
      </div>

      <div className="section">{t('policy.frameworksSection')}</div>
      {a6View.map((r) => (
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

      <div className="section">{t('markets.section')}</div>
      <div className="card pad">
        <div className="title">{t('markets.title')}</div>
        <div className="sub">{t('markets.sub')}</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{markets.length}</div>
          <div className="snapshot-label">{t('markets.statTracked')}</div>
          <div className="snapshot-note">{t('markets.statTrackedNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{opMarkets}</div>
          <div className="snapshot-label">{t('markets.statOperational')}</div>
          <div className="snapshot-note">{t('markets.statOperationalNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{a6Markets}</div>
          <div className="snapshot-label">{t('markets.statA6')}</div>
          <div className="snapshot-note">{t('markets.statA6Note')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{countryCount}</div>
          <div className="snapshot-label">{t('markets.statCountries')}</div>
          <div className="snapshot-note">{t('markets.statCountriesNote')}</div>
        </div>
      </div>

      <div className="card pad" style={{ borderLeft: '3px solid var(--blue)' }}>
        <div className="title">{t('markets.intelTitle')}</div>
        <div className="sub" style={{ marginTop: 6 }}>
          {t('markets.intelBody')}
        </div>
        <div className="sub" style={{ marginTop: 6, fontStyle: 'italic' }}>
          {t('markets.intelCaveat')}
        </div>
        <div className="sub" style={{ marginTop: 6 }}>
          {t('markets.sourcesLabel')} <a href="https://www.regreener.earth/blog/carbon-credit-prices-today-trends-and-forecasts-for-2026" target="_blank" rel="noreferrer">Regreener — Carbon Credit Prices 2026</a>
          {' · '}<a href="https://www.idxcarbon.co.id/document/share/161/caf49365-34e4-4582-8cd3-bb660ebb126c" target="_blank" rel="noreferrer">IDXCarbon Monthly Report, Feb 2026</a>
        </div>
      </div>

      <select className="select-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value={ALL}>{t('markets.allMarketTypes')}</option>
        {marketTypes.map((tp) => <option key={tp}>{tp}</option>)}
      </select>

      <div className="section">{t('markets.directorySection')}</div>
      {marketsView.map((r, i) => (
        <button
          key={i}
          className="list-row"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }}
          onClick={() => goCountry(r.country)}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <div className="list-row-main">
              <div className="list-row-title">
                {r.country} · {r.market_name}
                {r.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>{t('common.verified')}</span>}
              </div>
              <div className="list-row-sub">{r.market_type} · {t('markets.labelRegistry')}: {r.registry} · {t('markets.labelPlatform')}: {r.platform} · {t('markets.labelUpdated')} {r.last_updated}</div>
            </div>
            <div><Badge value={r.status} /></div>
          </div>
          {r.price_note && <div className="sub" style={{ marginTop: 6 }}>{r.price_note}</div>}
        </button>
      ))}
      <div className="sub">{t('markets.footnote')}</div>
    </>
  );
}
