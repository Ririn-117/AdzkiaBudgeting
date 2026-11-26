import { NavLink } from 'react-router-dom';
import { Eye, Landmark, LogOut, ShieldCheck, X } from 'lucide-react';
import { REKTOR_MENU } from '../../constants/rektorMenu';
import { LOGO_SRC } from '../../config/appConfig';
import { useRektorNotifications } from '../../context/RektorNotificationContext';
import { PERIOD, REKTOR_PROFILE } from '../../data/rektorData';

export default function RektorSidebar({ user, open, onClose, onLogout }) {
  const { unreadCount } = useRektorNotifications();
  const name = user?.name && user.name !== 'Rektor' ? user.name : REKTOR_PROFILE.name;

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
          <div><strong>E-Budgeting</strong><span>Univ. Adzkia Padang</span></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button>
        </div>

        <div className="period-badge">
          <Eye size={15} /><span>Akses Eksekutif</span><em>{PERIOD.semester}</em>
        </div>

        <nav className="sidebar-nav">
          {REKTOR_MENU.map((group) => (
            <div key={group.heading} className="nav-group">
              <p className="nav-heading">{group.heading}</p>
              {group.items.map(({ label, to, icon: Icon, end, showBadge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} /><span>{label}</span>
                  {showBadge && unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="rk-audit-box">
          <span><ShieldCheck size={13} /> Audit Oversight</span>
          <p>Sistem aktif dalam mode peninjauan eksekutif read-only institusi.</p>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar">{name.replace(/^(Prof\.|Dr\.|H\.|\s)+/g, '').trim()[0]?.toUpperCase() ?? 'R'}</div>
            <div><strong>{name}</strong><span>{REKTOR_PROFILE.title}</span></div>
          </div>
          <div className="sidebar-user-bottom">
            <span className="role-tag"><Eye size={12} /> Read Only</span>
            <button onClick={onLogout}><LogOut size={14} /> Keluar Sistem</button>
          </div>
        </div>
      </aside>
    </>
  );
}
