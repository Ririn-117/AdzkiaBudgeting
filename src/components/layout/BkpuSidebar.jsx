import { NavLink } from 'react-router-dom';
import { Landmark, LogOut, User, X } from 'lucide-react';
import { BKPU_MENU } from '../../constants/bkpuMenu';
import { LOGO_SRC } from '../../config/appConfig';
import { useBkpu } from '../../context/BkpuContext';
import { TA } from '../../data/bkpuData';

export default function BkpuSidebar({ user, open, onClose, onLogout }) {
  const { queue, lpjQueue, unreadCount } = useBkpu();
  const badges = { queue: queue.length, lpj: lpjQueue.length, notif: unreadCount };

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          {LOGO_SRC ? (
            <img src={LOGO_SRC} alt="Logo Universitas Adzkia" className="sidebar-logo-img" />
          ) : (
            <div className="sidebar-logo"><Landmark size={20} /></div>
          )}
          <div>
            <strong>E-Budgeting</strong>
            <span>Univ. Adzkia Padang</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button>
        </div>

        <div className="period-badge"><span>{TA} (Aktif)</span></div>

        <nav className="sidebar-nav">
          {BKPU_MENU.map((group, i) => (
            <div key={group.heading ?? i} className="nav-group">
              {group.heading && <p className="nav-heading">{group.heading}</p>}
              {group.items.map(({ label, to, icon: Icon, end, badge }) => (
                <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} />
                  <span>{label}</span>
                  {badge && badges[badge] > 0 && <b className="nav-badge">{badges[badge]}</b>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar maroon"><User size={18} /></div>
            <div>
              <strong>{user?.name}</strong>
              <span>Verifikator Anggaran BKPU</span>
            </div>
          </div>
          <button className="bk-logout" onClick={onLogout}><LogOut size={15} /> Keluar</button>
        </div>
      </aside>
    </>
  );
}