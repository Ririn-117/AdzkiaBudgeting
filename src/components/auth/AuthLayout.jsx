import { Landmark } from 'lucide-react';
import { INSTITUTION_NAME } from '../../config/appConfig';
import BrandLogo from './BrandLogo';
import '../../pages/auth/Login.css';
import '../../pages/auth/AuthExtra.css';

// Kerangka halaman untuk Register dan Lupa Kata Sandi (header, kartu, footer).
export default function AuthLayout({ children, wide = false }) {
  return (
    <div className="login-page">
      <header className="topbar">
        <Landmark size={22} />
        <span>UNIVERSITAS ADZKIA</span>
      </header>

      <main className="login-main">
        <div className={`login-card ${wide ? 'login-card-wide' : ''}`}>
          <div className="brand-center">
            <BrandLogo size={56} />
            <h3>{INSTITUTION_NAME.toUpperCase()}</h3>
            <p>Sistem Informasi Pengelolaan Anggaran</p>
          </div>
          <hr className="divider" />
          {children}
        </div>
      </main>

      <footer className="page-footer">
        &copy; {new Date().getFullYear()} {INSTITUTION_NAME}. Biro Administrasi Perencanaan &amp; Keuangan (BAPK).
      </footer>
    </div>
  );
}