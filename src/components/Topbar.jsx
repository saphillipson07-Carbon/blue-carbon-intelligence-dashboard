import { useApp } from '../AppContext';

export default function Topbar({ subtitle }) {
  const { t } = useApp();
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="brand-icon">🌊</div>
        <div>
          <div className="brand">{t('topbar.brand')}</div>
          <div className="brand-sub">{t('topbar.brandSub')}</div>
        </div>
      </div>
      <div className="product">
        {t('topbar.productTitle')}
        <small>{subtitle || t('topbar.defaultSubtitle')}</small>
      </div>
    </div>
  );
}
