import Sidebar from './Sidebar';
import { useApp } from '../AppContext';

export default function Layout({ children }) {
  const { t } = useApp();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {children}
        <div className="footer">
          {t('common.footer')}
        </div>
      </div>
    </div>
  );
}
