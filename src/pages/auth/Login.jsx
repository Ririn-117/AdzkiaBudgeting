import { Navigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';
import { INSTITUTION_NAME, LOGO_SRC } from '../../config/appConfig';
import LoginForm from '../../components/auth/LoginForm';
import './Login.css';

function Logo({ size = 48 }) {
  if (LOGO_SRC) {
    return <img src={LOGO_SRC} alt={`Logo ${INSTITUTION_NAME}`} style={{ height: size }} />;
  }
  return (
    <div className="logo-box" style={{ width: size, height: size }}>
      <Landmark size={size * 0.5} />
    </div>
  );
}

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/dashboard'} replace />;
  }

  return (
    <div className="login-page">
      <header className="topbar">
        <Landmark size={22} />
        <span>UNIVERSITAS ADZKIA</span>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="card-brand">
            <Logo size={48} />
            <div>
              <h3>{INSTITUTION_NAME}</h3>
              <p>Sistem Informasi Pengelolaan Anggaran</p>
            </div>
          </div>

          <h1 className="card-title">Masuk ke E-Budgeting</h1>
          <p className="card-subtitle">Silakan masuk menggunakan akun yang telah terdaftar.</p>

          <LoginForm />

          <div className="card-chip">Sistem Informasi E-Budgeting &bull; {INSTITUTION_NAME}</div>
        </div>
      </main>

      <footer className="page-footer">
        &copy; {new Date().getFullYear()} {INSTITUTION_NAME}. Biro Administrasi Perencanaan &amp; Keuangan (BAPK).
      </footer>
    </div>
  );
}