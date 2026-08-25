import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import { useApp } from '../AppContext';
import { markets } from '../data';

const ALL = 'All';

export default function CarbonMarkets() {
  const navigate = useNavigate();
  const { t, setSelectedCountry } = useApp();
  const [typeFilter, setTypeFilter] = useState(ALL);

  const opMarkets = markets.filter((m) => m.status === 'Operational').length;
  const a6Markets = markets.filter((m) => m.article6_integration === 'Implemented').length;
  const countryCount = new Set(markets.map((m) => m.country)).size;
  const types = useMemo(() => [...new Set(markets.map((m) => m.market_type))].sort(), []);

  const view = typeFilter === ALL ? markets : markets.filter((m) => m.market_type === typeFilter);

  const goCountry = (name) => {
    setSelectedCountry(name);
    navigate('/country');
  };

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

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
        {types.map((tp) => <option key={tp}>{tp}</option>)}
      </select>

      <div className="section">{t('markets.directorySection')}</div>
      {view.map((r, i) => (
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
