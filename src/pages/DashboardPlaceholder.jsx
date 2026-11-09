import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../constants/roles';

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login berhasil (data dummy)</h2>
      <p>Nama: <strong>{user.name}</strong></p>
      <p>Role: <strong>{ROLE_LABELS[user.role]}</strong></p>
      <p style={{ color: '#6b7280' }}>
        Halaman ini hanya placeholder sementara. Dashboard setiap role akan dibuat pada tahap berikutnya.
      </p>
      <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}