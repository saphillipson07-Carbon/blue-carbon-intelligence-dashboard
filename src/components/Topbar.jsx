export default function Topbar({ subtitle = 'Real-time intelligence for Article 6 and blue carbon markets' }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="brand-icon">🌊</div>
        <div>
          <div className="brand">BLUE CARBON</div>
          <div className="brand-sub">INTELLIGENCE</div>
        </div>
      </div>
      <div className="product">
        Global Market Intelligence
        <small>{subtitle}</small>
      </div>
    </div>
  );
}
