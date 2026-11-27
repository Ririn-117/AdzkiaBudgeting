import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Eye, FileText, Gavel, Printer, QrCode, SearchX, ShieldCheck, Target } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { getSubmissionDetail } from '../../data/bkpuData';
import { BASE, OTP_THRESHOLD, POS, RESULT, TA } from '../../data/wr2Data';
import { OtpModal } from '../../components/wr2/shared';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

const OPTIONS = [
  ['setuju', 'Setuju Penuh (Definitif)', (a) => `Alokasi penuh ${formatRupiah(a)}. SK dan TTE barcode diterbitkan langsung.`],
  ['bertahap', 'Setuju Bersyarat / Bertahap', () => 'Pencairan termin I (70%) dan termin II pasca laporan kemajuan.'],
  ['revisi', 'Kembalikan untuk Revisi', () => 'Pengusul diwajibkan memperbaiki item sebelum ditelaah ulang.'],
  ['tolak', 'Tolak Usulan Anggaran', () => 'Usulan digugurkan dari RKAT semester berjalan.'],
];
const NOTE_DEFAULT = 'Disetujui sesuai telaah BKPU. Pastikan luaran 12 modul OBE selesai tepat waktu sebelum semester baru dimulai.';

export default function Wr2Keputusan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { submissions, decide } = useWr2();
  const sub = submissions.find((s) => s.id === id);
  const d = useMemo(() => (sub ? getSubmissionDetail(sub) : null), [sub]);
  const [type, setType] = useState('setuju');
  const [note, setNote] = useState(NOTE_DEFAULT);
  const [tte, setTte] = useState(false);
  const [err, setErr] = useState('');
  const [otp, setOtp] = useState(false);

  if (!sub) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Persetujuan Anggaran' }, { label: 'Tidak ditemukan' }]} title="Usulan tidak ditemukan" />
        <div className="card u-empty"><SearchX size={32} /><strong>Usulan {id} tidak ada</strong><Link to={`${BASE}/menunggu`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Antrean</Link></div>
      </div>
    );
  }

  const active = sub.stage === 'menunggu';
  const approve = type === 'setuju' || type === 'bertahap';
  const total = d.rab.reduce((a, r) => a + r.qty * r.price, 0);
  const real = d.pagu.real;
  const kum = ((real + sub.amount) / d.pagu.induk) * 100;
  const back = active ? `${BASE}/menunggu` : `${BASE}/pengajuan`;

  const finish = () => {
    decide([sub], type, note.trim());
    toast.push(`Keputusan ${sub.id} berhasil disimpan ke database.`);
    navigate(back);
  };
  const submit = () => {
    if (!approve && note.trim().length < 10) { setErr('Isi catatan resmi (minimal 10 karakter) untuk revisi atau penolakan.'); return; }
    if (approve && !tte) { setErr('Centang pernyataan TTE (BSrE) untuk menerbitkan SK.'); return; }
    setErr('');
    if (approve && sub.amount > OTP_THRESHOLD) setOtp(true); else finish();
  };
  const label = { setuju: 'Kirim Keputusan Otorisasi (Setujui)', bertahap: 'Kirim Keputusan Bersyarat', revisi: 'Kirim Pengembalian Revisi', tolak: 'Kirim Penolakan' }[type];

  return (
    <div className="upage">
      <div className="bk-toprow">
        <Link to={back} className="u-btn u-btn-outline u-btn-sm"><ArrowLeft size={15} /> {active ? 'Antrean Persetujuan' : 'Semua Pengajuan'}</Link>
        <span className="bk-id-chip">{sub.faculty}</span><span className="bk-id-chip strong">{sub.id}</span>
        <span style={{ flex: 1 }} />
        <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => window.print()}><Printer size={14} /> Cetak Lembar Telaah</button>
        <span className="bk-id-chip strong"><ShieldCheck size={14} /> Level Otoritas: WR II Definitif</span>
      </div>

      <div className="bk-telaah-grid">
        <div className="bk-col">
          <section className="card bk-title-card" style={{ display: 'block' }}>
            <p className="bk-ref"><span className="u-badge u-badge-maroon">{active ? 'SIAP OTORISASI WR II' : POS[sub.stage].label.toUpperCase()}</span> <span className="u-badge u-badge-sky"><CheckCircle2 size={12} /> Lolos Telaah Administrasi & SBM BKPU</span> <span className="u-mono">REG: 2025/GENAP/{sub.id}</span></p>
            <p className="u-hint" style={{ margin: '0.8rem 0 0' }}>Nilai Disposisi Bersih</p>
            <p className="bk-total" style={{ textAlign: 'left', padding: 0, background: 'none' }}><strong>{formatRupiah(sub.amount)}</strong></p>
            <h1 style={{ margin: '0.3rem 0 1rem', fontSize: '1.5rem', fontWeight: 800 }}>{sub.title}</h1>
            <div className="bk-tiles">
              <div><span>Unit Pengusul</span><b>{sub.unit}</b><small>{sub.faculty}</small></div>
              <div><span>Penanggung Jawab (PIC)</span><b>{sub.pic}</b><small>Ketua Program Studi</small></div>
              <div><span>Waktu Pelaksanaan</span><b>{d.schedule[0]}</b><small>{TA}</small></div>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2>Audit Beban Pagu Anggaran Unit</h2><span className="u-hint">Sumber: Buku Besar RKAT Terpusat</span></div>
            <div className="bk-tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
              <div><span>Total Pagu Induk 2025</span><b>{formatRupiah(d.pagu.induk)}</b><small>Mata Anggaran {sub.mak.replace('MAK: ', '')}</small></div>
              <div><span>Realisasi s/d Hari Ini</span><b>{formatRupiah(real)}</b><small>{((real / d.pagu.induk) * 100).toFixed(2)}% Terserap</small></div>
              <div><span>Pengajuan Ini</span><b style={{ color: '#7a0c16' }}>{formatRupiah(sub.amount)}</b><small>{((sub.amount / d.pagu.induk) * 100).toFixed(2)}% dari Total Pagu</small></div>
              <div><span>Estimasi Sisa Pagu</span><b>{formatRupiah(d.pagu.induk - real - sub.amount)}</b><small>Status: {kum <= 70 ? 'Sangat Aman' : 'Melewati Batas Kuota'}</small></div>
            </div>
            <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem' }}><span>Beban Kumulatif Pasca Otorisasi WR II: {kum.toFixed(2)}%</span><b>Batas Kuota Semester Genap: 70.00%</b></p>
            <div className={`u-bar ${kum <= 70 ? 'green' : 'maroon'}`}><i style={{ width: `${Math.min(100, kum)}%` }} /></div>
          </section>

          <section className="card">
            <h2 className="u-h2"><Target size={20} /> Relevansi Indikator Kinerja Utama (IKU) & Rasionalitas Program</h2>
            <p style={{ margin: '0 0 0.8rem', fontSize: '0.92rem', lineHeight: 1.6, color: '#334155' }}>{d.summary}</p>
            <div className="bk-iku">{d.iku.map((t) => <p key={t}><b>{t}</b></p>)}</div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2>Rincian Komponen Anggaran Biaya (RAB)</h2><span className="u-badge u-badge-sky">Telah Disesuaikan SBM</span></div>
            <div className="u-scroll">
              <table className="u-table" style={{ minWidth: 700 }}>
                <thead><tr><th>No</th><th>Komponen / Spesifikasi Item</th><th className="num">Volume</th><th className="num">Tarif Satuan (SBM)</th><th className="num">Subtotal</th><th>Status Telaah</th></tr></thead>
                <tbody>
                  {d.rab.map((r, i) => (
                    <tr key={r.name}>
                      <td className="u-mono">{pad2(i + 1)}</td>
                      <td><span className="u-cell-title">{r.name}</span><span className="u-cell-sub">{r.spec}</span>{r.adj && <span className="bk-adj">{r.adj}</span>}</td>
                      <td className="num">{r.qty} {r.unit}</td><td className="num">{formatRupiah(r.price)}</td><td className="num strong">{formatRupiah(r.qty * r.price)}</td>
                      <td><span className={`u-badge ${r.adj ? 'u-badge-sky' : 'u-badge-green'}`}><CheckCircle2 size={12} /> {r.adj ? 'Koreksi SBM' : 'Valid'}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={4} className="num">Total Usulan Biaya (Klir & Sesuai SBM):</td><td className="num">{formatRupiah(total)}</td><td>100% SESUAI</td></tr></tfoot>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><FileText size={20} /> Dokumen Pendukung Terlampir (Sah & Terverifikasi)</h2><span className="u-hint">{d.files.length} File Dilampirkan</span></div>
            <div className="bk-files">
              {d.files.map((f) => (
                <div key={f.name} className="bk-file">
                  <div className="bk-file-top"><FileText size={24} /><span className="u-badge u-badge-green">{f.tag}</span></div>
                  <strong title={f.name}>{f.name}</strong><small>{f.size} • {f.meta}</small>
                  <div className="bk-file-foot">
                    <button type="button" className="u-link" onClick={() => toast.push(`Membuka ${f.name} (simulasi).`)}><Eye size={14} /> Lihat Dokumen</button>
                    <button type="button" className="u-iconbtn" aria-label={`Unduh ${f.name}`} onClick={() => toast.push(`Unduh ${f.name} (simulasi).`)}><Download size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="bk-side">
          <section className="card bk-panel">
            <h2 className="u-h2"><Gavel size={20} /> Lembar Keputusan WR II</h2>
            {active ? (
              <>
                <p className="u-hint">Pilihlah tindakan otorisasi anggaran di bawah ini. Keputusan pimpinan akan langsung menerbitkan nomor register otorisasi universitas dan membukukan reservasi dana di SIMKEU.</p>
                <div className="wr2-opts" role="radiogroup" aria-label="Pilihan keputusan">
                  {OPTIONS.map(([k, t, desc]) => (
                    <label key={k} className={`wr2-opt ${type === k ? 'on' : ''} ${k === 'tolak' ? 'danger' : ''}`}>
                      <input type="radio" name="dec" checked={type === k} onChange={() => { setType(k); setErr(''); setNote(k === 'setuju' || k === 'bertahap' ? NOTE_DEFAULT : ''); }} />
                      <span><b>{t}</b><small>{desc(sub.amount)}</small></span>
                    </label>
                  ))}
                </div>
                <p className="bk-panel-label">Catatan Resmi Disposisi Wakil Rektor II: <b>Tercetak pada SK</b></p>
                <textarea className="u-textarea" rows={4} value={note} onChange={(e) => { setNote(e.target.value); setErr(''); }} aria-label="Catatan resmi" />
                {approve && (
                  <label className="wr2-tte"><input type="checkbox" className="u-check" checked={tte} onChange={(e) => setTte(e.target.checked)} /> <span>Bubuhkan Tanda Tangan Elektronik (TTE BSrE) & QR Verifikasi</span><QrCode size={18} /></label>
                )}
                {err && <p className="u-err" role="alert">{err}</p>}
                <button type="button" className="u-btn u-btn-primary u-btn-block" onClick={submit}><Gavel size={15} /> {label}</button>
                <div className="u-actions"><button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => setType('revisi')}>Minta Revisi</button><button type="button" className="u-btn u-btn-danger u-btn-sm" onClick={() => setType('tolak')}>Tolak Usulan</button></div>
              </>
            ) : (
              <div className="u-note u-note-success"><CheckCircle2 size={18} /><div>
                <strong>{RESULT[sub.result]?.label ?? 'Telah diputuskan'}</strong>
                <p>{sub.sk ? `No. SK: ${sub.sk} • ` : ''}{sub.decidedAt}</p><p>{sub.note}</p>
              </div></div>
            )}
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2>Hasil Verifikasi BKPU</h2><span className="u-badge u-badge-sky">100% Lolos</span></div>
            <ul className="bk-checks">
              {[['Kelengkapan Dokumen & TOR', '5/5 Berkas Lengkap'], ['Kepatuhan Standar Biaya Masukan (SBM)', 'Telah Disesuaikan'], ['Ketersediaan Pagu Alokasi Unit', 'Sisa Rp 164,5 Jt'], ['Validasi Rekening SIMKEU', 'BSI Virtual Acc Valid']].map(([a, b]) => (
                <li key={a}><label style={{ justifyContent: 'space-between' }}><span><CheckCircle2 size={14} style={{ color: '#0f9d63' }} /> {a}</span><b style={{ fontSize: '0.8rem' }}>{b}</b></label></li>
              ))}
            </ul>
            <div className="bk-auth"><span><b>Ahmad Zaky, S.E.</b> (Verifikator BKPU)<br />"Direkomendasikan untuk disetujui penuh oleh Wakil Rektor II. Tarif honorarium narasumber telah disesuaikan dengan SBM SK Rektor No. 42/2024."</span></div>
          </section>

          <section className="card">
            <h2 className="u-h2">Jejak Riwayat Pengajuan</h2>
            <ul className="u-timeline">
              {[...d.history].reverse().map((h) => (
                <li key={h.title} className={h.tone === 'amber' ? 'tl-amber' : h.tone === 'green' ? 'tl-green' : ''}><i /><div><div className="u-tl-head"><strong>{h.title}</strong></div><p style={{ fontSize: '0.82rem' }}>{h.time}</p></div></li>
              ))}
              {active && <li className="tl-maroon"><i /><div><strong>Tersaji di meja otorisasi Wakil Rektor II</strong><p style={{ fontSize: '0.82rem' }}>{sub.entry} • {sub.entryTime} (Aktif)</p></div></li>}
            </ul>
          </section>
        </aside>
      </div>
      <OtpModal open={otp} onClose={() => setOtp(false)} onVerified={() => { setOtp(false); finish(); }} />
    </div>
  );
}

const pad2 = (n) => String(n).padStart(2, '0');