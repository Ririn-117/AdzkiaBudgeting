import { NavLink } from 'react-router-dom';
import { Landmark, LogOut, User, X } from 'lucide-react';
import { WR2_MENU } from '../../constants/wr2Menu';
import { LOGO_SRC } from '../../config/appConfig';
import { useWr2 } from '../../context/Wr2Context';
import { WR2 } from '../../data/wr2Data';

export default function Wr2Sidebar({ open, onClose, onLogout }) {
  const { queue, unreadCount } = useWr2();
  const badges = { queue: queue.length, notif: unreadCount };

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          {LOGO_SRC ? <img src={LOGO_SRC} alt="Logo Universitas Adzkia" className="sidebar-logo-img" /> : <div className="sidebar-logo"><Landmark size={20} /></div>}
          <div><strong>E-Budgeting</strong><span>Univ. Adzkia Padang</span></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button>
        </div>
        <div className="period-badge"><span>TA 2024/2025</span><em>GENAP (AKTIF)</em></div>
        <nav className="sidebar-nav">
          {WR2_MENU.map((g) => (
            <div key={g.heading} className="nav-group">
              <p className="nav-heading">{g.heading}</p>
              {g.items.map(({ label, to, icon: Icon, end, badge }) => (
                <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} /><span>{label}</span>
                  {badge && badges[badge] > 0 && <b className="nav-badge">{badges[badge]}</b>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar maroon"><User size={18} /></div>
            <div><strong>{WR2.short}</strong><span>Wakil Rektor II Adzkia</span></div>
          </div>
          <button className="bk-logout" onClick={onLogout}><LogOut size={15} /> Keluar Sistem</button>
        </div>
      </aside>
    </>
  );
}