import { NavLink } from 'react-router-dom';
import { useApp } from '../AppContext';
import { LANGUAGES } from '../i18n';

export default function Sidebar() {
  const { t, language, setLanguage } = useApp();

  const PERMANENT_PAGES = [
    { label: t('sidebar.navGlobalOverview'), path: '/' },
    { label: t('sidebar.navGlobalMap'), path: '/map' },
    { label: t('sidebar.navPolicy'), path: '/policy' },
    { label: t('sidebar.navMarkets'), path: '/markets' },
    { label: t('sidebar.navMethodologies'), path: '/methodologies' },
    { label: t('sidebar.navProjects'), path: '/projects' },
    { label: t('sidebar.navNews'), path: '/news' },
    { label: t('sidebar.navMsp'), path: '/msp' },
  ];

  const RESOURCES = [t('sidebar.resDocuments'), t('sidebar.resData'), t('sidebar.resGlossary')];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">{t('sidebar.brand')}</div>
      <div className="sidebar-brand-sub">{t('sidebar.brandSub')}</div>

      <div className="sidebar-lang" role="group" aria-label={t('sidebar.language')}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            className={`sidebar-lang-btn${language === l.code ? ' active' : ''}`}
            onClick={() => setLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <hr className="sidebar-divider" />
      <div className="sidebar-section-label">{t('sidebar.sectionGlobal')}</div>
      {PERMANENT_PAGES.map((p) => (
        <NavLink
          key={p.path}
          to={p.path}
          end={p.path === '/'}
          className={({ isActive }) =>
            'sidebar-nav-item' + (isActive ? ' active' : '')
          }
        >
          {p.label}
        </NavLink>
      ))}
      <hr className="sidebar-divider" />
      <div className="sidebar-section-label">{t('sidebar.sectionResources')}</div>
      {RESOURCES.map((item) => (
        <div className="sidebar-resource-item" key={item}>
          {item}
        </div>
      ))}
    </div>
  );
}
