import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {children}
        <div className="footer">
          Blue Carbon Intelligence · V6.3 functional concept · Illustrative data pending verified source integration
        </div>
      </div>
    </div>
  );
}
