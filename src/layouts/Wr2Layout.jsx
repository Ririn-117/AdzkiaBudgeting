import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wr2Provider } from '../context/Wr2Context';
import { ToastProvider } from '../components/ui/Toast';
import Wr2Sidebar from '../components/layout/Wr2Sidebar';
import Wr2Topbar from '../components/layout/Wr2Topbar';
import './layout.css';
import '../components/ui/ui.css';
import '../pages/unit/pages.css';
import '../pages/bkpu/bkpu.css';
import '../pages/wr2/wr2.css';

export default function Wr2Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Wr2Provider>
        <div className="app-shell">
          <Wr2Sidebar user={user} open={open} onClose={() => setOpen(false)} onLogout={logout} />
          <div className="app-main">
            <Wr2Topbar onMenuClick={() => setOpen(true)} />
            <main className="app-content">
              <Outlet />
            </main>
          </div>
        </div>
      </Wr2Provider>
    </ToastProvider>
  );
}