import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BkpuProvider } from '../context/BkpuContext';
import { ToastProvider } from '../components/ui/Toast';
import BkpuSidebar from '../components/layout/BkpuSidebar';
import BkpuTopbar from '../components/layout/BkpuTopbar';
import './layout.css';
import '../components/ui/ui.css';
import '../pages/unit/pages.css';
import '../pages/bkpu/bkpu.css';

export default function BkpuLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <BkpuProvider>
        <div className="app-shell">
          <BkpuSidebar user={user} open={open} onClose={() => setOpen(false)} onLogout={logout} />
          <div className="app-main">
            <BkpuTopbar user={user} onMenuClick={() => setOpen(true)} />
            <main className="app-content">
              <Outlet />
            </main>
          </div>
        </div>
      </BkpuProvider>
    </ToastProvider>
  );
}