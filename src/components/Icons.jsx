const STANDARD_COLORS = {
  Verra: '#2478A6',
  'Gold Standard': '#D28A2E',
  'Plan Vivo': '#3F9162',
  JCM: '#12999B',
  ICVCM: '#6E7F8A',
};

export function StdIcon({ standard }) {
  const color = STANDARD_COLORS[standard] || '#6E7F8A';
  return (
    <span className="std-icon" style={{ background: color }}>
      {standard?.[0]}
    </span>
  );
}

const MARKET_ICONS = {
  ETS: '🏛',
  'ETS (Pilot)': '🏛',
  Voluntary: '🌿',
  'Compliance + Voluntary': '⚖',
  'Carbon Tax Offset': '📄',
};

export function MktIcon({ marketType }) {
  return <span className="mkt-icon">{MARKET_ICONS[marketType] || '💰'}</span>;
}
