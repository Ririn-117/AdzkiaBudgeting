import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RektorNotificationProvider } from '../context/RektorNotificationContext';
import { ToastProvider } from '../components/ui/Toast';
import RektorSidebar from '../components/layout/RektorSidebar';
import RektorTopbar from '../components/layout/RektorTopbar';
import './layout.css';
import '../components/ui/ui.css';
import '../pages/unit/pages.css';
import '../pages/rektor/rektor.css';

export default function RektorLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <RektorNotificationProvider>
        <div className="app-shell">
          <RektorSidebar
            user={user}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={logout}
          />
          <div className="app-main">
            <RektorTopbar user={user} onMenuClick={() => setSidebarOpen(true)} />
            <main className="app-content">
              <Outlet />
            </main>
          </div>
        </div>
      </RektorNotificationProvider>
    </ToastProvider>
  );
}
