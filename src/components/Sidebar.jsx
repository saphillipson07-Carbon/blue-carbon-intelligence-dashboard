import { NavLink } from 'react-router-dom';

const PERMANENT_PAGES = [
  { label: 'Global Overview', path: '/' },
  { label: 'Global Enabling Conditions Map', path: '/map' },
  { label: 'Article 6 & Policy', path: '/policy' },
  { label: 'Carbon Markets', path: '/markets' },
  { label: 'Methodologies', path: '/methodologies' },
  { label: 'Projects', path: '/projects' },
  { label: 'News & Intelligence', path: '/news' },
  { label: 'Marine Spatial Planning', path: '/msp' },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">BLUE CARBON</div>
      <div className="sidebar-brand-sub">INTELLIGENCE PLATFORM</div>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-label">GLOBAL INTELLIGENCE</div>
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
      <div className="sidebar-section-label">RESOURCES</div>
      {['Documents Library', 'Data & Reports', 'Glossary'].map((item) => (
        <div className="sidebar-resource-item" key={item}>
          {item}
        </div>
      ))}
    </div>
  );
}
