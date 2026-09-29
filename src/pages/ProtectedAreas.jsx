import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcehMap from '../components/AcehMap';
import { useApp } from '../AppContext';

const ALL = 'All';

// Real protected-area boundaries from the World Database on Protected Areas
// (WDPA), UNEP-WCMC & IUCN, August 2026 release, clipped to Aceh & North
// Sumatra — the same source AcehMap renders on its polygon layer. This page
// reads the plain (unprojected) properties for the filterable directory;
// AcehMap independently fetches the pre-projected pixel version to draw the
// shapes. See AcehMap.jsx for why those are two separate files.
const dataUrl = '/geo/aceh-mpas.json';

function fmtKm2(n) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} km²`;
}

export default function ProtectedAreas() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [areas, setAreas] = useState([]);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [designationFilter, setDesignationFilter] = useState(ALL);
  const [iucnFilter, setIucnFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(dataUrl)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAreas((d.features || []).map((f) => f.properties)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const designationOptions = useMemo(() => [...new Set(areas.map((a) => a.designation))].sort(), [areas]);
  const iucnOptions = useMemo(() => [...new Set(areas.map((a) => a.iucn_category))].sort(), [areas]);

  const view = useMemo(() => {
    const q = search.trim().toLowerCase();
    return areas
      .filter((a) => {
        if (typeFilter === 'Marine' && !a.marine) return false;
        if (typeFilter === 'Terrestrial' && a.marine) return false;
        if (designationFilter !== ALL && a.designation !== designationFilter) return false;
        if (iucnFilter !== ALL && a.iucn_category !== iucnFilter) return false;
        if (q && !a.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [areas, typeFilter, designationFilter, iucnFilter, search]);

  const marineCount = useMemo(() => areas.filter((a) => a.marine).length, [areas]);
  const totalAreaKm2 = useMemo(() => areas.reduce((sum, a) => sum + (a.area_km2 || 0), 0), [areas]);

  const resetFilters = () => {
    setTypeFilter(ALL);
    setDesignationFilter(ALL);
    setIucnFilter(ALL);
    setSearch('');
  };

  const selectArea = (props) => setSelectedId((cur) => (cur === props.wdpa_site_id ? null : props.wdpa_site_id));

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('protectedAreas.section')}</div>
      <div className="card pad">
        <div className="title">{t('protectedAreas.title')}</div>
        <div className="sub">{t('protectedAreas.sub')}</div>
      </div>

      <div className="project-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-number">{areas.length}</div>
          <div className="snapshot-label">{t('protectedAreas.statTotal')}</div>
          <div className="snapshot-note">{t('protectedAreas.statTotalNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{marineCount}</div>
          <div className="snapshot-label">{t('protectedAreas.statMarine')}</div>
          <div className="snapshot-note">{t('protectedAreas.statMarineNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{areas.length - marineCount}</div>
          <div className="snapshot-label">{t('protectedAreas.statTerrestrial')}</div>
          <div className="snapshot-note">{t('protectedAreas.statTerrestrialNote')}</div>
        </div>
        <div className="snapshot-card">
          <div className="snapshot-number">{totalAreaKm2 >= 1000 ? `${(totalAreaKm2 / 1000).toFixed(1)}k` : totalAreaKm2.toFixed(0)}</div>
          <div className="snapshot-label">{t('protectedAreas.statArea')}</div>
          <div className="snapshot-note">{t('protectedAreas.statAreaNote')}</div>
        </div>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          placeholder={t('protectedAreas.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gm-filters gm-filters-4">
        <div>
          <div className="gm-filter-label">{t('protectedAreas.filterType')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value={ALL}>{t('protectedAreas.typeAll')}</option>
            <option value="Marine">{t('protectedAreas.typeMarine')}</option>
            <option value="Terrestrial">{t('protectedAreas.typeTerrestrial')}</option>
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('protectedAreas.filterDesignation')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
            <option value={ALL}>{t('common.allStatuses')}</option>
            {designationOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('protectedAreas.filterIucn')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={iucnFilter} onChange={(e) => setIucnFilter(e.target.value)}>
            <option value={ALL}>{t('common.allStatuses')}</option>
            {iucnOptions.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div />
        <button className="gm-reset" onClick={resetFilters}>{t('globalMap.resetFilters')}</button>
      </div>

      <AcehMap markers={[]} highlightId={selectedId} onAreaSelect={selectArea} />
      <div className="gm-legend">
        <span><span className="gm-legend-dot" style={{ background: 'rgba(18,153,155,.55)', border: '1px solid #12999B' }} />{t('protectedAreas.legendMarine')}</span>
        <span><span className="gm-legend-dot" style={{ background: 'rgba(63,145,98,.5)', border: '1px solid #3F9162' }} />{t('protectedAreas.legendTerrestrial')}</span>
      </div>
      <div className="sub" style={{ marginTop: 6 }}>{t('protectedAreas.mapCaption')}</div>
      <div className="sub" style={{ marginTop: 2, fontSize: '.52rem' }}>{t('protectedAreas.sourceCitation')}</div>

      <div className="section">{t('protectedAreas.matchingSection', { n: view.length, total: areas.length })}</div>

      {view.length === 0 ? (
        <div className="card pad">
          <div className="title">{t('protectedAreas.noneTitle')}</div>
          <div className="sub">{t('protectedAreas.noneSub')}</div>
        </div>
      ) : (
        view.map((a) => (
          <button
            key={a.wdpa_site_id}
            className="list-row"
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              borderColor: selectedId === a.wdpa_site_id ? 'var(--navy)' : undefined,
              borderWidth: selectedId === a.wdpa_site_id ? 2 : 1,
            }}
            onClick={() => selectArea(a)}
          >
            <div className="list-row-main">
              <div className="list-row-title">
                {a.name}
                <span className="tag" style={{ marginLeft: 6 }}>{a.marine ? t('protectedAreas.legendMarine') : t('protectedAreas.legendTerrestrial')}</span>
              </div>
              <div className="list-row-sub">
                {a.designation} · {t('protectedAreas.cellIucn')}: {a.iucn_category} · {t('protectedAreas.cellArea')}: {fmtKm2(a.area_km2)}
                {a.marine_area_km2 > 0 ? ` (${t('protectedAreas.cellMarineArea')}: ${fmtKm2(a.marine_area_km2)})` : ''}
                {' · '}{a.status_year ? `${t('protectedAreas.cellStatusYear')} ${a.status_year}` : t('protectedAreas.statusYearUnknown')}
              </div>
            </div>
          </button>
        ))
      )}

      <div className="sub" style={{ marginTop: 10 }}>{t('protectedAreas.otherCountriesNote')}</div>
    </>
  );
}
