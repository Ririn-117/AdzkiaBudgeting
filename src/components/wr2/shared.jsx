import { useState } from 'react';
import Modal from '../ui/Modal';

export { Donut, Toggle, BigPager, fmtJt, sum, uniq } from '../bkpu/shared';

export const fmtM = (n) => `Rp ${(n / 1e9).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;

// Donut multi-segmen sederhana: parts = [{ value, color }]
export function Segments({ parts, size = 170, stroke = 22, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  let offset = 0;
  return (
    <div className="bk-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {parts.map((p) => {
          const len = (p.value / total) * c;
          const el = <circle key={p.color} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} />;
          offset += len;
          return el;
        })}
      </svg>
      <span>{children}</span>
    </div>
  );
}

// Simulasi: menerima 6 digit angka apa saja. Ganti dengan verifikasi OTP ke server nanti.
export function OtpModal({ open, onClose, onVerified }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const submit = () => {
    if (!/^\d{6}$/.test(code)) { setErr('Masukkan 6 digit kode OTP.'); return; }
    setCode(''); setErr('');
    onVerified();
  };
  return (
    <Modal open={open} title="Verifikasi OTP Otorisasi" onClose={onClose}
      footer={<><button type="button" className="u-btn u-btn-outline" onClick={onClose}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={submit}>Verifikasi</button></>}>
      <p className="u-hint">Nilai di atas ambang otorisasi mewajibkan token OTP dinamis pimpinan. (Mode simulasi: isi 6 digit angka apa saja.)</p>
      <div className="u-field">
        <label className="u-label" htmlFor="otp">Kode OTP (6 digit)</label>
        <input id="otp" className={`u-input ${err ? 'invalid' : ''}`} inputMode="numeric" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }} autoFocus />
        {err && <p className="u-err">{err}</p>}
      </div>
    </Modal>
  );
}