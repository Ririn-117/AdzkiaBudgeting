import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Contact,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserCheck,
  UserCog,
} from 'lucide-react';
import { LOGIN_ROLE_OPTIONS, ROLES } from '../../constants/roles';
import { UNIT_OPTIONS } from '../../constants/units';
import { registerRequest } from '../../services/authService';
import { api } from '../../services/api';
import TextField from './TextField';
import SelectField from './SelectField';
import PasswordInput from './PasswordInput';

// Administrator tidak bisa diajukan lewat pendaftaran mandiri.
const REGISTER_ROLE_OPTIONS = LOGIN_ROLE_OPTIONS.filter((o) => o.value !== ROLES.ADMINISTRATOR);

const INITIAL = {
  fullName: '',
  email: '',
  unit: '',
  role: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

const EMAIL_PATTERN = /^[^\s@]+@adzkia\.ac\.id$/i;

function validate(v) {
  const e = {};
  if (!v.fullName.trim()) e.fullName = 'Nama lengkap wajib diisi.';
  if (!v.email.trim()) e.email = 'Email institusi wajib diisi.';
  else if (!EMAIL_PATTERN.test(v.email.trim())) e.email = 'Gunakan email institusi berakhiran @adzkia.ac.id.';
  if (!v.unit) e.unit = 'Pilih unit / program studi.';
  if (!v.role) e.role = 'Pilih role yang diajukan.';
  if (!v.password) e.password = 'Kata sandi wajib diisi.';
  else if (v.password.length < 8) e.password = 'Kata sandi minimal 8 karakter.';
  if (!v.confirmPassword) e.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
  else if (v.confirmPassword !== v.password) e.confirmPassword = 'Konfirmasi kata sandi tidak sama.';
  if (!v.agree) e.agree = 'Anda harus menyetujui pernyataan ini.';
  return e;
}

export default function RegisterForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [unitOptions, setUnitOptions] = useState(UNIT_OPTIONS);

  useEffect(() => {
    let active = true;
    api.get('/master/units', { auth: false })
      .then((res) => {
        if (active && Array.isArray(res?.units) && res.units.length > 0) {
          setUnitOptions(res.units.map((u) => ({ value: u.code, label: u.name })));
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const setField = (name) => (e) =>
    setValues((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const result = await registerRequest(values);
      setSuccessMessage(result.message);
    } catch (err) {
      setFormError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="success-panel">
        <CheckCircle2 size={40} />
        <h2>Pendaftaran Diajukan</h2>
        <p>{successMessage}</p>
        <Link to="/login" className="btn-primary btn-link">
          Kembali ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="card-title">Buat Akun E-Budgeting</h1>
      <p className="card-subtitle">Lengkapi data berikut untuk mengajukan pendaftaran akun.</p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="alert-error" role="alert">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <TextField
          id="fullName"
          label="Nama Lengkap"
          icon={Contact}
          placeholder="Masukkan nama lengkap beserta gelar"
          autoComplete="name"
          value={values.fullName}
          onChange={setField('fullName')}
          disabled={submitting}
          error={errors.fullName}
        />

        <TextField
          id="email"
          label="Email Institusi"
          icon={Mail}
          type="email"
          placeholder="nama@adzkia.ac.id"
          autoComplete="email"
          value={values.email}
          onChange={setField('email')}
          disabled={submitting}
          error={errors.email}
        />

        <div className="form-grid">
          <SelectField
            id="unit"
            label="Unit / Program Studi"
            icon={Building2}
            placeholder="Pilih Unit/Prodi"
            options={unitOptions}
            value={values.unit}
            onChange={setField('unit')}
            disabled={submitting}
            error={errors.unit}
          />
          <SelectField
            id="role"
            label="Role yang Diajukan"
            icon={UserCog}
            placeholder="Pilih Role Pengguna"
            options={REGISTER_ROLE_OPTIONS}
            value={values.role}
            onChange={setField('role')}
            disabled={submitting}
            error={errors.role}
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="password">Kata Sandi</label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              value={values.password}
              onChange={setField('password')}
              disabled={submitting}
              hasError={Boolean(errors.password)}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Konfirmasi Sandi</label>
            <PasswordInput
              id="confirmPassword"
              icon={KeyRound}
              autoComplete="new-password"
              placeholder="Ulangi kata sandi"
              value={values.confirmPassword}
              onChange={setField('confirmPassword')}
              disabled={submitting}
              hasError={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div>
          <label className="agree">
            <input
              type="checkbox"
              checked={values.agree}
              onChange={setField('agree')}
              disabled={submitting}
            />
            <span>
              Saya menyatakan data yang diisi adalah benar, sah, dan dapat dipertanggungjawabkan secara
              institusional.
            </span>
          </label>
          {errors.agree && <p className="field-error">{errors.agree}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" /> Memproses...
            </>
          ) : (
            <>
              Ajukan Pendaftaran <UserCheck size={18} />
            </>
          )}
        </button>

        <p className="switch-auth">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="link-strong">
            Masuk
          </Link>
        </p>

        <div className="card-chip chip-icon">
          <ShieldCheck size={14} />
          Akun baru akan diverifikasi oleh Administrator sebelum dapat digunakan.
        </div>
      </form>
    </>
  );
}