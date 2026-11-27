import { Link } from 'react-router-dom';
import { Bell, Building2, ChevronRight, Clock, Menu, ShieldCheck, User } from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { BASE } from '../../data/bkpuData';

export default function BkpuTopbar({ user, onMenuClick }) {
  const { unreadCount } = useBkpu();

  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu"><Menu size={22} /></button>

      <div className="crumb">
        <Building2 size={16} />
        <span className="crumb-faculty">Universitas</span>
        <ChevronRight size={14} className="crumb-sep" />
        <strong>BKPU Telaah Anggaran</strong>
      </div>
      <span className="bk-chip"><Clock size={14} /> Batas Telaah BKPU: 3 Hari Kerja</span>

      <div className="topbar-spacer" />

      <div className="role-chip"><ShieldCheck size={14} /> Peran: <strong>BKPU (Biro Keuangan)</strong></div>
      <Link to={`${BASE}/notifikasi`} className="bk-bell" aria-label={`Notifikasi (${unreadCount} belum dibaca)`}>
        <Bell size={20} />
        {unreadCount > 0 && <b>{unreadCount}</b>}
      </Link>
      <div className="user-chip">
        <div className="user-meta bk-right">
          <strong>{user?.name}</strong>
          <span>BKPU</span>
        </div>
        <div className="avatar maroon"><User size={18} /></div>
      </div>
    </header>
  );
}