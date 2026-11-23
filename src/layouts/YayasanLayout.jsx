import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { YayasanProvider } from '../context/YayasanContext';
import { ToastProvider, useToast } from '../components/ui/Toast';
import YayasanSidebar from '../components/layout/YayasanSidebar';
import YayasanTopbar from '../components/layout/YayasanTopbar';
import Modal from '../components/ui/Modal';
import { formatRupiah } from '../utils/format';
import { REKENING_KAS, INITIAL_SUMMARY } from '../data/yayasanData';
import './layout.css';
import '../components/ui/ui.css';
import '../pages/yayasan/yayasan.css';

function YayasanShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <YayasanSidebar
        user={user}
        open={open}
        onClose={() => setOpen(false)}
        onLogout={logout}
      />
      <div className="app-main">
        <YayasanTopbar onMenuClick={() => setOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function YayasanLayout() {
  return (
    <ToastProvider>
      <YayasanProvider>
        <YayasanShell />
      </YayasanProvider>
    </ToastProvider>
  );
}
