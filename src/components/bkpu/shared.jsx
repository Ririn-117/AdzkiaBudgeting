import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { SLA_META } from '../../data/bkpuData';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';

export const fmtJt = (n) => `Rp ${(n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
export const sum = (list, key) => list.reduce((a, x) => a + x[key], 0);
export const uniq = (list, key) => [...new Set(list.map((x) => x[key]))];

export function SlaChip({ day }) {
  const m = SLA_META[day] ?? SLA_META[1];
  return <span className={`bk-sla ${m.tone}`}>{day >= 3 && <Timer size={13} />}{m.label}</span>;
}

export function DocChip({ docs, missing = 'KAK' }) {
  const [ok, total] = docs;
  return ok >= total
    ? <span className="bk-doc ok"><CheckCircle2 size={14} /> {ok}/{total} Lengkap</span>
    : <span className="bk-doc bad"><AlertTriangle size={14} /> {ok}/{total} (Kurang {missing})</span>;
}

export function Donut({ percent, size = 84, stroke = 10, color = '#161a77', track = '#e3e7f4', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="bk-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${(Math.min(100, percent) / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <span className="u-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span />
    </span>
  );
}

// Pagination dengan elipsis untuk jumlah halaman besar
export function BigPager({ page, pageCount, onChange }) {
  const nums = [...new Set([1, 2, 3, pageCount, page - 1, page, page + 1])].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const items = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push(`gap-${n}`);
    items.push(n);
  });
  return (
    <nav className="u-pager" aria-label="Halaman">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Sebelumnya"><ChevronLeft size={14} /></button>
      {items.map((it) => typeof it === 'string'
        ? <span key={it} className="bk-gap">…</span>
        : <button key={it} type="button" className={it === page ? 'on' : ''} onClick={() => onChange(it)}>{it}</button>)}
      <button type="button" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Berikutnya"><ChevronRight size={14} /></button>
    </nav>
  );
}

export function DisposisiModal({ open, onClose, refs = [] }) {
  const toast = useToast();
  const [target, setTarget] = useState('Kepala BKPU');
  const [note, setNote] = useState('');
  const send = () => {
    toast.push(`Disposisi ${refs.join(', ')} diteruskan ke ${target} (simulasi).`);
    setNote('');
    onClose();
  };
  return (
    <Modal open={open} title="Lembar Disposisi" onClose={onClose}
      footer={<><button type="button" className="u-btn u-btn-outline" onClick={onClose}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={send}>Kirim Disposisi</button></>}>
      <p className="u-hint">Berkas: <b>{refs.join(', ') || '-'}</b></p>
      <div className="u-field">
        <label className="u-label" htmlFor="dsp-target">Teruskan kepada</label>
        <select id="dsp-target" className="u-select" value={target} onChange={(e) => setTarget(e.target.value)}>
          {['Kepala BKPU', 'Kabiro Keuangan', 'Wakil Rektor II'].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="u-field">
        <label className="u-label" htmlFor="dsp-note">Catatan disposisi</label>
        <textarea id="dsp-note" className="u-textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Instruksi atau catatan untuk penerima disposisi" />
      </div>
    </Modal>
  );
}