import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { forgotPasswordRequest } from '../../services/authService';
import TextField from './TextField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Format email tidak valid.');
      return;
    }
    setError('');

    setSubmitting(true);
    try {
      const result = await forgotPasswordRequest({ email });
      setSuccessMessage(result.message);
    } catch (err) {
      setFormError(err.message || 'Permintaan gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="success-panel">
        <CheckCircle2 size={40} />
        <h2>Permintaan Diterima</h2>
        <p>{successMessage}</p>
        <Link to="/login" className="btn-primary btn-link">
          Kembali ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="card-title">Lupa Kata Sandi</h1>
      <p className="card-subtitle">
        Masukkan email institusi Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
      </p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="alert-error" role="alert">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <TextField
          id="email"
          label="Email Institusi"
          icon={Mail}
          type="email"
          placeholder="nama@adzkia.ac.id"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          error={error}
        />

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" /> Memproses...
            </>
          ) : (
            <>
              Kirim Tautan Reset <Send size={18} />
            </>
          )}
        </button>

        <p className="switch-auth">
          <Link to="/login" className="link-strong back-link">
            <ArrowLeft size={14} /> Kembali ke Masuk
          </Link>
        </p>
      </form>
    </>
  );
}