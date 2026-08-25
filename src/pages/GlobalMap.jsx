import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import WorldMap, { STATUS_COLOR } from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, STATUS_COLS } from '../data';

const LAYER_FIELDS = [
  { icon: '👤', key: 'layerDna', field: 'dna_appointed' },
  { icon: '📜', key: 'layerA6', field: 'article6_framework' },
  { icon: '🏛', key: 'layerMarket', field: 'domestic_carbon_market' },
  { icon: '🤝', key: 'layerBilateral', field: 'bilateral_agreements' },
  { icon: '🌿', key: 'layerNdc', field: 'blue_carbon_ndc' },
  { icon: '✅', key: 'layerAuth', field: 'article6_authorization' },
  { icon: '🧾', key: 'layerItmo', field: 'itmos_issued' },
  { icon: '🌊', key: 'layerProjects', field: 'active_blue_carbon_projects' },
  { icon: '🔁', key: 'layerRole', field: 'market_role', isRole: true },
];

const STATUS_ORDER = ['Implemented', 'In Development', 'Planned', 'Not Available', 'No Data'];
const ROLE_ORDER = ['Host', 'Potential ITMO Supplier', 'Potential Buyer', 'Both'];
const INCOME_ORDER = ['Low income', 'Lower-middle income', 'Upper-middle income', 'High income'];

const MARKET_ROLE_COLOR = {
  Host: '#2478A6',
  'Potential ITMO Supplier': '#3F9162',
  'Potential Buyer': '#D28A2E',
  Both: '#7C6FAE',
};

export default function GlobalMap() {
  const navigate = useNavigate();
  const { t, setSelectedCountry } = useApp();
  const LAYERS = LAYER_FIELDS.map((l) => ({ ...l, label: t(`globalMap.${l.key}`) }));
  // Order = toggle order, so the last entry is the layer currently coloring
  // the map. Any other toggled-on layers act as an "also Implemented" filter
  // (dimming, not hiding, countries that don't meet them) rather than being
  // blended into a single score.
  const [layersOn, setLayersOn] = useState(['dna_appointed']);
  const [regionFilter, setRegionFilter] = useState('All');
  const [incomeFilter, setIncomeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewIso, setPreviewIso] = useState(null);

  const colorField = layersOn[layersOn.length - 1] || null;
  const colorLayer = LAYERS.find((l) => l.field === colorField) || null;
  const filterOnlyFields = layersOn.filter((f) => f !== colorField && f !== 'market_role');

  const regions = useMemo(() => [...new Set(countries.map((c) => c.region))].filter(Boolean).sort(), []);
  const incomeGroups = useMemo(
    () => INCOME_ORDER.filter((g) => countries.some((c) => c.income_group === g)),
    []
  );
  const statusOptions = useMemo(() => {
    if (!colorLayer) return [];
    const order = colorLayer.isRole ? ROLE_ORDER : STATUS_ORDER;
    const present = new Set(countries.map((c) => c[colorField]).filter(Boolean));
    return order.filter((v) => present.has(v));
  }, [colorField, colorLayer]);

  const view = useMemo(
    () =>
      countries.filter(
        (c) =>
          (regionFilter === 'All' || c.region === regionFilter) &&
          (incomeFilter === 'All' || c.income_group === incomeFilter) &&
          (statusFilter === 'All' || !colorField || c[colorField] === statusFilter)
      ),
    [regionFilter, incomeFilter, statusFilter, colorField]
  );

  // Countries that fail one of the OTHER toggled-on layers (not the one
  // coloring the map). Shown dimmed rather than removed, on both the map
  // and the list — a visible AND-filter across facts, never a blended score.
  const mutedIsos = useMemo(() => {
    if (filterOnlyFields.length === 0) return new Set();
    return new Set(
      countries.filter((c) => filterOnlyFields.some((f) => c[f] !== 'Implemented')).map((c) => c.iso)
    );
  }, [filterOnlyFields]);

  const previewRow = countries.find((c) => c.iso === previewIso) || null;

  const resetFilters = () => {
    setRegionFilter('All');
    setIncomeFilter('All');
    setStatusFilter('All');
  };

  const toggleLayer = (field) => {
    setLayersOn((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
    setStatusFilter('All');
  };

  const openPreview = (countryName) => {
    const row = countries.find((c) => c.country === countryName);
    if (row) setPreviewIso(row.iso);
  };

  const goCountryIntelligence = (row) => {
    setSelectedCountry(row.country);
    navigate('/country');
  };

  const legendPalette = colorLayer?.isRole ? MARKET_ROLE_COLOR : STATUS_COLOR;
  const legendValues = colorLayer ? (colorLayer.isRole ? ROLE_ORDER : STATUS_ORDER) : [];

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('globalMap.section')}</div>
      <div className="card pad">
        <div className="title">{t('globalMap.title')}</div>
        <div className="sub">{t('globalMap.sub')}</div>
      </div>

      <div className="gm-filters">
        <div>
          <div className="gm-filter-label">{t('globalMap.filterByRegion')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            <option value="All">{t('common.allRegions')}</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{t('globalMap.filterByIncome')}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={incomeFilter} onChange={(e) => setIncomeFilter(e.target.value)}>
            <option value="All">{t('common.allIncomeGroups')}</option>
            {incomeGroups.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">{colorLayer ? t('globalMap.filterByStatusFor', { layer: colorLayer.label }) : t('globalMap.filterByStatus')}</div>
          <select
            className="select-input"
            style={{ width: '100%', marginBottom: 0 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={!colorLayer}
          >
            <option value="All">{t('common.allStatuses')}</option>
            {statusOptions.map((s) => <option key={s} value={s}>{colorLayer?.isRole ? t(`status.${s}`) : t(`status.${s}`)}</option>)}
          </select>
        </div>
        <button className="gm-reset" onClick={resetFilters}>{t('globalMap.resetFilters')}</button>
      </div>

      <div className="gm-layout">
        <div className="gm-layers">
          <div className="gm-layers-title">{t('globalMap.layersTitle')}</div>
          <div className="sub" style={{ marginBottom: 6 }}>
            {t('globalMap.layersSub')}
          </div>
          {LAYERS.map((l) => {
            const isOn = layersOn.includes(l.field);
            const isColor = l.field === colorField;
            return (
              <button
                key={l.field}
                className={`gm-layer-btn${isOn ? ' on' : ''}${isColor ? ' active' : ''}`}
                onClick={() => toggleLayer(l.field)}
              >
                <span>{l.icon} {l.label}{isOn && !isColor && <span className="gm-layer-note">{t('globalMap.filterTag')}</span>}</span>
                <span className={`gm-switch${isOn ? ' on' : ''}`}><span className="gm-switch-knob" /></span>
              </button>
            );
          })}
        </div>

        <div>
          <WorldMap
            countries={view}
            statusField={colorField}
            colorMap={colorLayer?.isRole ? MARKET_ROLE_COLOR : undefined}
            mutedIsos={mutedIsos}
            onSelect={openPreview}
            selectedIso={previewIso}
          />
          <div className="gm-legend">
            {colorLayer ? (
              <>
                {legendValues.map((v) => (
                  <span key={v}><span className="gm-legend-dot" style={{ background: legendPalette[v] }} />{t(`status.${v}`)}</span>
                ))}
                {!legendValues.includes('No Data') && (
                  <span><span className="gm-legend-dot" style={{ background: '#F5F8F9', border: '1px solid var(--line)' }} />{t('globalMap.notInSample')}</span>
                )}
                {filterOnlyFields.length > 0 && (
                  <span><span className="gm-legend-dot" style={{ background: '#B9C4CB', opacity: .5 }} />{t('globalMap.dimmedNote', { layers: filterOnlyFields.length > 1 ? t('globalMap.otherActiveFilters') : LAYERS.find((l) => l.field === filterOnlyFields[0])?.label })}</span>
                )}
              </>
            ) : (
              <span>{t('globalMap.toggleToColor')}</span>
            )}
          </div>
          <div className="sub" style={{ marginTop: 6 }}>
            {t('globalMap.mapCaption')}
          </div>
        </div>

        <div className="gm-panel">
          {!previewRow ? (
            <div className="gm-panel-empty">{t('globalMap.panelEmpty')}</div>
          ) : (
            <>
              <button className="gm-panel-close" onClick={() => setPreviewIso(null)}>×</button>
              <span className="flag">{previewRow.iso}</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', marginTop: 6 }}>{previewRow.country}</div>
              <div className="sub" style={{ marginTop: 2 }}>{previewRow.region} · {previewRow.income_group}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge value={previewRow.market_role} />
                {previewRow.verified && <span className="badge good">{t('common.verified')} · {previewRow.last_verified}</span>}
              </div>

              <div className="gm-panel-subtitle">{t('globalMap.panelIndicators')}</div>
              <div className="gm-indicator-grid">
                {Object.entries(STATUS_COLS).map(([label, field]) => (
                  <div className={`gm-indicator-cell${layersOn.includes(field) ? ' on-layer' : ''}`} key={field}>
                    <div className="gm-indicator-label">{t(`statusCols.${label}`)}</div>
                    <div style={{ marginTop: 4 }}><Badge value={previewRow[field]} /></div>
                  </div>
                ))}
              </div>

              <button className="btn" style={{ width: '100%', textAlign: 'center', marginTop: 12 }} onClick={() => goCountryIntelligence(previewRow)}>
                {t('globalMap.viewCountryIntelligence')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="section">{t('globalMap.countriesSection', { shown: view.length, total: countries.length })}{colorLayer ? ` — ${colorLayer.label}` : ''}</div>
      {view
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country))
        .map((r) => (
          <button
            key={r.iso}
            className={`list-row${mutedIsos.has(r.iso) ? ' muted' : ''}`}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setPreviewIso(r.iso)}
          >
            <div className="list-row-main">
              <div className="list-row-title">{r.country}</div>
              <div className="list-row-sub">{r.region} · {r.income_group}</div>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 260 }}>
              {layersOn.length > 1 ? (
                layersOn.map((f) => {
                  const l = LAYERS.find((x) => x.field === f);
                  return (
                    <span key={f} className="gm-multi-badge" title={l.label}>
                      <span className="gm-multi-badge-icon">{l.icon}</span>
                      <Badge value={r[f]} />
                    </span>
                  );
                })
              ) : (
                colorField && <Badge value={r[colorField]} />
              )}
            </div>
          </button>
        ))}
    </>
  );
}
