import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ToastProvider } from '../components/ui/Toast';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import './layout.css';
import '../components/ui/ui.css';
import '../pages/unit/pages.css';

export default function UnitLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="app-shell">
          <Sidebar
            user={user}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={logout}
          />
          <div className="app-main">
            <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} />
            <main className="app-content">
              <Outlet />
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}
