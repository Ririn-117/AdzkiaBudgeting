import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronDown, Contact, Loader2, LogIn, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LOGIN_ROLE_OPTIONS, ROLE_HOME } from '../../constants/roles';
import PasswordInput from './PasswordInput';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!identifier.trim()) next.identifier = 'Email atau username wajib diisi.';
    if (!password) next.password = 'Kata sandi wajib diisi.';
    if (!role) next.role = 'Silakan pilih hak akses / peran.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const user = await login({ identifier, password, role, remember });
      navigate(ROLE_HOME[user.role] ?? '/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login gagal. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{formError}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="identifier">Email atau Username</label>
        <div className="input-wrap">
          <User size={18} className="input-icon" />
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="Masukkan email atau username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={submitting}
            className={`input has-icon ${errors.identifier ? 'input-error' : ''}`}
            aria-invalid={Boolean(errors.identifier)}
          />
        </div>
        {errors.identifier && <p className="field-error">{errors.identifier}</p>}
      </div>

      <div className="field">
        <label htmlFor="password">Kata Sandi</label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          hasError={Boolean(errors.password)}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <p className="field-error">{errors.password}</p>}
      </div>

      <div className="field">
        <label htmlFor="role">Masuk Sebagai</label>
        <div className="input-wrap">
          <Contact size={18} className="input-icon" />
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={submitting}
            className={`input has-icon has-toggle select ${role ? '' : 'is-placeholder'} ${
              errors.role ? 'input-error' : ''
            }`}
            aria-invalid={Boolean(errors.role)}
          >
            <option value="" disabled>
              Pilih Hak Akses / Peran
            </option>
            {LOGIN_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="select-chevron" />
        </div>
        {errors.role && <p className="field-error">{errors.role}</p>}
      </div>

      <div className="form-row">
        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={submitting}
          />
          <span>Ingat saya</span>
        </label>
        {/* Halaman lupa kata sandi belum dibuat */}
        <Link to="/forgot-password" className="link-strong">
          Lupa kata sandi?
        </Link>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className="spin" /> Memproses...
          </>
        ) : (
          <>
            Masuk <LogIn size={18} />
          </>
        )}
      </button>

      <p className="switch-auth">
        Belum memiliki akun?{' '}
        {/* Halaman register belum dibuat (tahap berikutnya) */}
        <Link to="/register" className="link-strong">
          Buat Akun
        </Link>
      </p>
    </form>
  );
}