import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import WorldMap, { STATUS_COLOR } from '../components/WorldMap';
import { useApp } from '../AppContext';
import { countries, STATUS_COLS } from '../data';

const LAYERS = [
  { icon: '👤', label: 'DNA Appointed', field: 'dna_appointed' },
  { icon: '📜', label: 'Article 6 Framework', field: 'article6_framework' },
  { icon: '🏛', label: 'Domestic Carbon Market', field: 'domestic_carbon_market' },
  { icon: '🤝', label: 'Bilateral Agreements', field: 'bilateral_agreements' },
  { icon: '🌿', label: 'Blue Carbon in NDCs', field: 'blue_carbon_ndc' },
  { icon: '✅', label: 'Article 6 Authorizations', field: 'article6_authorization' },
  { icon: '🧾', label: 'ITMOs Issued', field: 'itmos_issued' },
  { icon: '🌊', label: 'Active Blue Carbon Projects', field: 'active_blue_carbon_projects' },
  { icon: '🔁', label: 'Market Role', field: 'market_role', isRole: true },
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
  const { setSelectedCountry } = useApp();
  const [activeField, setActiveField] = useState('dna_appointed');
  const [regionFilter, setRegionFilter] = useState('All');
  const [incomeFilter, setIncomeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewIso, setPreviewIso] = useState(null);

  const activeLayer = LAYERS.find((l) => l.field === activeField);

  const regions = useMemo(() => [...new Set(countries.map((c) => c.region))].filter(Boolean).sort(), []);
  const incomeGroups = useMemo(
    () => INCOME_ORDER.filter((g) => countries.some((c) => c.income_group === g)),
    []
  );
  const statusOptions = useMemo(() => {
    const order = activeLayer.isRole ? ROLE_ORDER : STATUS_ORDER;
    const present = new Set(countries.map((c) => c[activeField]).filter(Boolean));
    return order.filter((v) => present.has(v));
  }, [activeField, activeLayer.isRole]);

  const view = useMemo(
    () =>
      countries.filter(
        (c) =>
          (regionFilter === 'All' || c.region === regionFilter) &&
          (incomeFilter === 'All' || c.income_group === incomeFilter) &&
          (statusFilter === 'All' || c[activeField] === statusFilter)
      ),
    [regionFilter, incomeFilter, statusFilter, activeField]
  );

  const previewRow = countries.find((c) => c.iso === previewIso) || null;

  const resetFilters = () => {
    setRegionFilter('All');
    setIncomeFilter('All');
    setStatusFilter('All');
  };

  const selectLayer = (field) => {
    setActiveField(field);
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

  const legendPalette = activeLayer.isRole ? MARKET_ROLE_COLOR : STATUS_COLOR;
  const legendValues = activeLayer.isRole ? ROLE_ORDER : STATUS_ORDER;

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>← Back to Global Overview</button>

      <div className="section">Global enabling conditions</div>
      <div className="card pad">
        <div className="title">Global Enabling Conditions Map</div>
        <div className="sub">Where the factual foundations for Article 6 and blue carbon transactions exist. Status only — not a readiness score or country ranking.</div>
      </div>

      <div className="gm-filters">
        <div>
          <div className="gm-filter-label">Filter by region</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            <option value="All">All regions</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">Filter by income group</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={incomeFilter} onChange={(e) => setIncomeFilter(e.target.value)}>
            <option value="All">All income groups</option>
            {incomeGroups.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <div className="gm-filter-label">Filter by status — {activeLayer.label}</div>
          <select className="select-input" style={{ width: '100%', marginBottom: 0 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            {statusOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button className="gm-reset" onClick={resetFilters}>↻ Reset filters</button>
      </div>

      <div className="gm-layout">
        <div className="gm-layers">
          <div className="gm-layers-title">Map layers</div>
          <div className="sub" style={{ marginBottom: 6 }}>Select one indicator to color the map</div>
          {LAYERS.map((l) => (
            <button
              key={l.field}
              className={`gm-layer-btn${l.field === activeField ? ' active' : ''}`}
              onClick={() => selectLayer(l.field)}
            >
              <span>{l.icon} {l.label}</span>
              <span className={`gm-switch${l.field === activeField ? ' on' : ''}`}><span className="gm-switch-knob" /></span>
            </button>
          ))}
        </div>

        <div>
          <WorldMap
            countries={view}
            statusField={activeField}
            colorMap={activeLayer.isRole ? MARKET_ROLE_COLOR : undefined}
            onSelect={openPreview}
            selectedIso={previewIso}
          />
          <div className="gm-legend">
            {legendValues.map((v) => (
              <span key={v}><span className="gm-legend-dot" style={{ background: legendPalette[v] }} />{v}</span>
            ))}
            {!legendValues.includes('No Data') && (
              <span><span className="gm-legend-dot" style={{ background: '#F5F8F9', border: '1px solid var(--line)' }} />Not in this sample</span>
            )}
          </div>
          <div className="sub" style={{ marginTop: 6 }}>
            Geography: real country boundaries. Click a country for a status preview. Status records for Indonesia and Viet Nam are verified and sourced; other countries in this sample are illustrative pending verified source integration.
          </div>
        </div>

        <div className="gm-panel">
          {!previewRow ? (
            <div className="gm-panel-empty">Click a country on the map to preview its enabling-conditions status here.</div>
          ) : (
            <>
              <button className="gm-panel-close" onClick={() => setPreviewIso(null)}>×</button>
              <span className="flag">{previewRow.iso}</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', marginTop: 6 }}>{previewRow.country}</div>
              <div className="sub" style={{ marginTop: 2 }}>{previewRow.region} · {previewRow.income_group}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge value={previewRow.market_role} />
                {previewRow.verified && <span className="badge good">Verified · {previewRow.last_verified}</span>}
              </div>

              <div className="gm-panel-subtitle">Enabling conditions</div>
              <div className="gm-indicator-grid">
                {Object.entries(STATUS_COLS).map(([label, field]) => (
                  <div className="gm-indicator-cell" key={field}>
                    <div className="gm-indicator-label">{label}</div>
                    <div style={{ marginTop: 4 }}><Badge value={previewRow[field]} /></div>
                  </div>
                ))}
              </div>

              <button className="btn" style={{ width: '100%', textAlign: 'center', marginTop: 12 }} onClick={() => goCountryIntelligence(previewRow)}>
                View Country Intelligence →
              </button>
            </>
          )}
        </div>
      </div>

      <div className="section">{view.length} of {countries.length} countries — {activeLayer.label}</div>
      {view
        .slice()
        .sort((a, b) => a.country.localeCompare(b.country))
        .map((r) => (
          <button
            key={r.iso}
            className="list-row"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setPreviewIso(r.iso)}
          >
            <div className="list-row-main">
              <div className="list-row-title">{r.country}</div>
              <div className="list-row-sub">{r.region} · {r.income_group}</div>
            </div>
            <div><Badge value={r[activeField]} /></div>
          </button>
        ))}
    </>
  );
}
