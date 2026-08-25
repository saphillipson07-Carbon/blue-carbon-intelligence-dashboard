import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { news } from '../data';

const ALL = 'All';

export default function NewsIntelligence() {
  const navigate = useNavigate();
  const { t, selectedCountry, setSelectedCountry } = useApp();
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [countryFilter, setCountryFilter] = useState(ALL);

  const sorted = useMemo(() => news.slice().sort((a, b) => (a.date < b.date ? 1 : -1)), []);
  const types = useMemo(() => [...new Set(sorted.map((n) => n.type))].sort(), [sorted]);
  const countryOptions = useMemo(() => [...new Set(sorted.map((n) => n.country))].sort(), [sorted]);

  const view = sorted
    .filter((n) => typeFilter === ALL || n.type === typeFilter)
    .filter((n) => countryFilter === ALL || n.country === countryFilter);

  const spotlight = sorted.filter((n) => n.country === selectedCountry);

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('news.section')}</div>
      <div className="card pad">
        <div className="title">{t('news.title')}</div>
        <div className="sub">{t('news.sub')}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, marginTop: 10 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <select className="select-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value={ALL}>{t('news.allCategories')}</option>
              {types.map((tp) => <option key={tp}>{tp}</option>)}
            </select>
            <select className="select-input" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
              <option value={ALL}>{t('news.allCountries')}</option>
              {countryOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="section">{t('news.matchingSection', { n: view.length })}</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {view.length === 0 && <div className="pad sub">{t('news.noneMatch')}</div>}
            {view.map((r, i) => (
              <div className="news-item" key={i}>
                <span className="tag">{r.type}</span>
                <span className="date">{r.date}</span>
                <span className="date">· {r.country}</span>
                {r.verified && <span className="badge good" style={{ marginLeft: 6, fontSize: '.5rem' }}>{t('common.verified')}</span>}
                <div className="headline">{r.headline}</div>
                {r.source && (
                  <div className="sub" style={{ marginTop: 3 }}>
                    <a href={r.source} target="_blank" rel="noreferrer">{r.source_label || t('common.source')} →</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card pad">
            <div className="title">{t('news.spotlightTitle')}</div>
            <div className="sub">{t('news.spotlightSub', { country: selectedCountry, n: spotlight.length })}</div>
          </div>
          <select
            className="select-input"
            style={{ marginTop: 8, width: '100%' }}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countryOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigate('/country')}>
            {t('news.viewCountryIntelligence', { country: selectedCountry })}
          </button>
          <div className="sub" style={{ marginTop: 8 }}>{t('news.everyItemNote')}</div>
        </div>
      </div>
    </>
  );
}
