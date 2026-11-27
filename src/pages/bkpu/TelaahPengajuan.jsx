import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Calendar, CheckCircle2, ClipboardCheck, Download, Eye, FileText, History, Landmark,
  Mail, MapPin, Paperclip, RotateCcw, Save, SearchX, ShieldAlert, Table2, Users, UserRound, Send,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { BASE, CHECKLIST_TEXT, STAGE_META, getSubmissionDetail } from '../../data/bkpuData';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export default function TelaahPengajuan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { submissions, decideSubmission } = useBkpu();
  const sub = submissions.find((s) => s.id === id);
  const detail = useMemo(() => (sub ? getSubmissionDetail(sub) : null), [sub]);

  const [checks, setChecks] = useState(() => CHECKLIST_TEXT.map((_, i) => !(i === 1 && sub?.docs[0] < sub?.docs[1])));
  const [note, setNote] = useState(() => (sub && sub.docs[0] >= sub.docs[1]
    ? 'Administrasi lengkap dan tarif belanja telah disesuaikan unit sesuai SBM Rektor No. 42/2024. Berkas memenuhi syarat kepatuhan teknis dan fiskal. Direkomendasikan untuk disetujui Wakil Rektor II.' : ''));
  const [error, setError] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  if (!sub) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Pengajuan' }, { label: 'Tidak ditemukan' }]} title="Usulan tidak ditemukan" />
        <div className="card u-empty"><SearchX size={32} /><strong>Usulan {id} tidak ada</strong>
          <Link to={`${BASE}/verifikasi`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Daftar Verifikasi</Link></div>
      </div>
    );
  }

  const active = sub.stage === 'antrean' || sub.stage === 'ditelaah';
  const total = detail.rab.reduce((a, r) => a + r.qty * r.price, 0);
  const done = checks.filter(Boolean).length;
  const usedPct = ((detail.pagu.real + sub.amount) / detail.pagu.induk) * 100;
  const sisa = detail.pagu.induk - detail.pagu.real;
  const meta = STAGE_META[sub.stage];
  const statusText = sub.resubmit ? 'Menunggu Verifikasi Ulang (Revisi Unit Diterima)' : meta.label;
  const back = active ? `${BASE}/verifikasi` : `${BASE}/pengajuan`;

  const forward = () => {
    if (done < CHECKLIST_TEXT.length) { setError('Seluruh poin kepatuhan administrasi harus terpenuhi sebelum diteruskan ke WR II.'); return; }
    decideSubmission(sub, 'forward', note.trim());
    toast.push(`${sub.id} berhasil diteruskan ke Wakil Rektor II dan disimpan di database.`);
    navigate(back);
  };
  const revise = () => {
    if (note.trim().length < 10) { setError('Isi catatan perbaikan (minimal 10 karakter) agar unit tahu apa yang harus direvisi.'); return; }
    decideSubmission(sub, 'revise', note.trim());
    toast.push(`Permintaan revisi ${sub.id} berhasil dikirim ke unit dan disimpan di database.`);
    navigate(back);
  };
  const reject = () => {
    if (reason.trim().length < 10) return;
    decideSubmission(sub, 'reject', reason.trim());
    toast.push(`${sub.id} ditolak dan tercatat di database.`);
    setRejectOpen(false);
    navigate(back);
  };

  return (
    <div className="upage">
      <div className="bk-toprow">
        <Link to={back} className="u-btn u-btn-outline u-btn-sm"><ArrowLeft size={15} /> {active ? 'Kembali ke Daftar Verifikasi' : 'Kembali ke Semua Pengajuan'}</Link>
        <span className={`bk-status-pill t-${meta.tone}`}><i /> {statusText}</span>
        <span className="bk-id-chip">SIMKEU-ID: {detail.simkeu}</span>
        <span className="bk-id-chip strong">{detail.sbmStatus}</span>
      </div>

      <section className="card bk-title-card">
        <div>
          <p className="bk-ref"><span className="u-badge u-badge-maroon">{sub.id}</span> <b>{detail.fullUnit}</b> • {detail.facultyShort}</p>
          <h1>{sub.title}</h1>
          <p className="bk-meta"><span><UserRound size={14} /> Pengusul: {detail.pengusul}</span><span><Calendar size={14} /> Tgl Masuk: {detail.entry}</span><span><FileText size={14} /> Periode: {detail.periode}</span></p>
        </div>
        <div className="bk-total"><span>TOTAL NILAI USULAN</span><strong>{formatRupiah(sub.amount)}</strong><small><CheckCircle2 size={14} /> Sesuai Batas Maksimal Prodi</small></div>
      </section>

      <div className="bk-telaah-grid">
        <div className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight"><h2><BookOpen size={20} /> A. Ringkasan Program Kerja & Relevansi IKU</h2><span className="u-badge u-badge-sky">Tridharma Dikti</span></div>
            <div className="bk-tiles">
              <div><span>Jadwal Pelaksanaan</span><b>{detail.schedule[0]}</b><small>{detail.schedule[1]}</small></div>
              <div><span>Target Peserta</span><b>{detail.participants[0]}</b><small>{detail.participants[1]}</small></div>
              <div><span>Lokasi Kegiatan</span><b>{detail.location[0]}</b><small>{detail.location[1]}</small></div>
            </div>
            <div className="bk-iku">
              <p><b>Capaian Indikator Kinerja Utama (IKU) Didukung:</b> {detail.iku.map((t, i) => <span key={t} className={`bk-iku-tag ${i ? 'dark' : ''}`}>{t}</span>)}</p>
              <p>{detail.summary}</p>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight">
              <div><h2><Table2 size={20} /> B. Rincian Anggaran Biaya (RAB) Hasil Penyesuaian Unit</h2><p className="u-hint">Semua harga satuan dievaluasi terhadap Standar Biaya Masukan (SBM) Adzkia TA 2024/2025</p></div>
              <span className="u-badge u-badge-green"><CheckCircle2 size={13} /> {detail.rab.length} dari {detail.rab.length} Item Terverifikasi SBM</span>
            </div>
            <div className="u-scroll">
              <table className="u-table" style={{ minWidth: 760 }}>
                <thead><tr><th>No</th><th>Komponen & Spesifikasi Belanja</th><th className="num">Volume</th><th className="num">Harga Satuan</th><th className="num">Subtotal</th><th>Verifikasi Standar SBM</th></tr></thead>
                <tbody>
                  {detail.rab.map((r, i) => (
                    <tr key={r.name}>
                      <td>{i + 1}</td>
                      <td><span className="u-cell-title">{r.name}</span><span className="u-cell-sub">{r.spec}</span>{r.adj && <span className="bk-adj">{r.adj}</span>}</td>
                      <td className="num">{r.qty} {r.unit}</td>
                      <td className="num">{formatRupiah(r.price)}</td>
                      <td className="num strong">{formatRupiah(r.qty * r.price)}</td>
                      <td><span className="u-badge u-badge-green"><CheckCircle2 size={12} /> {r.badge}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={4} className="num">Total Usulan RAB Kegiatan</td><td className="num" style={{ color: '#7a0c16' }}>{formatRupiah(total)}</td><td>BALANCE (PAS)</td></tr></tfoot>
              </table>
            </div>
            <div className="bk-pagu">
              <p className="bk-pagu-title"><Landmark size={14} /> Kondisi alokasi pagu anggaran {sub.unit} ({TA_SHORT})</p>
              <div className="bk-pagu-row">
                <span>Pagu Induk: <b>{formatRupiah(detail.pagu.induk)}</b></span>
                <span>Terealisasi: <b>{formatRupiah(detail.pagu.real)}</b></span>
                <span className="ok">Sisa Tersedia: <b>{formatRupiah(sisa)}</b></span>
                <div className="bk-pagu-bar"><span>Serapan Pasca Usulan Ini: <b>{usedPct.toFixed(1)}%</b></span><div className="u-bar green"><i style={{ width: `${Math.min(100, usedPct)}%` }} /></div></div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><Paperclip size={20} /> C. Berkas Kelengkapan Administrasi & Surat Pengantar</h2><span className="u-hint">{detail.files.length} Dokumen Sah Terlampir</span></div>
            <div className="bk-files">
              {detail.files.map((f) => (
                <div key={f.name} className="bk-file">
                  <div className="bk-file-top"><FileText size={24} /><span className="u-badge u-badge-green">{f.tag}</span></div>
                  <strong title={f.name}>{f.name}</strong>
                  <small>{f.size} • {f.meta}</small>
                  <div className="bk-file-foot">
                    <button type="button" className="u-link" onClick={() => toast.push(`Membuka ${f.name} (simulasi).`)}><Eye size={14} /> Lihat Berkas</button>
                    <button type="button" className="u-iconbtn" aria-label={`Unduh ${f.name}`} onClick={() => toast.push(`Unduh ${f.name} (simulasi).`)}><Download size={15} /></button>
                  </div>
                </div>
              ))}
              {sub.missingDoc && <div className="bk-file missing"><ShieldAlert size={24} /><strong>{sub.missingDoc} belum diunggah</strong><small>Wajib dilengkapi unit sebelum diteruskan.</small></div>}
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><History size={20} /> D. Riwayat Catatan Revisi & Audit Telaah</h2><span className="u-hint">Siklus Verifikasi ke-{detail.history.length}</span></div>
            <ul className="bk-hist">
              {detail.history.map((h) => (
                <li key={h.title} className={`t-${h.tone}`}>
                  <i />
                  <div>
                    <p className="bk-hist-head"><b>{h.title}</b>{h.who && <span className="u-badge u-badge-sky">{h.who}</span>}</p>
                    <time>{h.time}</time>
                    <blockquote>{h.text}</blockquote>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="bk-side">
          <section className="card bk-panel">
            <div className="bk-panel-head"><span className="bk-ico maroon"><ClipboardCheck size={20} /></span><div><h2>Lembar Telaah BKPU</h2><p>Biro Keuangan & Perencanaan Umum</p></div></div>
            <p className="bk-panel-label">Kepatuhan Administrasi (Wajib) <b>{done} / {CHECKLIST_TEXT.length} Terpenuhi</b></p>
            <ul className="bk-checks">
              {CHECKLIST_TEXT.map((t, i) => (
                <li key={t}>
                  <label>
                    <input type="checkbox" className="u-check" checked={checks[i]} disabled={!active} onChange={() => { setChecks((c) => c.map((v, k) => (k === i ? !v : v))); setError(''); }} />
                    <span>{t}</span>
                  </label>
                </li>
              ))}
            </ul>

            <p className="bk-panel-label">Catatan Rekomendasi Verifikator</p>
            <textarea className="u-textarea" rows={5} value={note} readOnly={!active} onChange={(e) => { setNote(e.target.value); setError(''); }} placeholder="Tulis catatan telaah atau alasan permintaan revisi..." aria-label="Catatan rekomendasi" />
            <p className="u-hint">Catatan ini akan diteruskan ke dashboard persetujuan Wakil Rektor II Bidang Keuangan.</p>
            {error && <p className="u-err" role="alert">{error}</p>}

            {active ? (
              <div className="bk-actions">
                <button type="button" className="u-btn u-btn-primary u-btn-block" onClick={forward}><Send size={15} /> Lanjutkan ke Wakil Rektor II</button>
                <button type="button" className="u-btn bk-btn-amber u-btn-block" onClick={revise}><RotateCcw size={15} /> Minta Revisi Kembali ke Prodi</button>
                <button type="button" className="u-btn u-btn-soft u-btn-block" onClick={() => toast.push('Catatan sementara disimpan (simulasi).')}><Save size={15} /> Simpan Catatan Sementara</button>
                <button type="button" className="u-link" onClick={() => setRejectOpen(true)}>Tolak usulan (non-RKAT)</button>
              </div>
            ) : (
              <div className="u-note"><ShieldAlert size={18} /><div><strong>Berkas telah diproses: {meta.label}</strong><p>{sub.decisionNote || sub.note || 'Lembar telaah ditampilkan dalam mode baca.'}</p></div></div>
            )}
            <p className="bk-auth"><ShieldAlert size={16} /> <span><b>Kewenangan BKPU:</b> BKPU hanya bertindak sebagai penelaah kepatuhan standar anggaran & kelengkapan administrasi. Hak otorisasi pencairan dana dan persetujuan alokasi sepenuhnya berada pada Wakil Rektor II.</span></p>
          </section>

          <div className="bk-help">
            <Mail size={22} />
            <div><b>Butuh Klarifikasi Unit?</b><small>Hubungi Kaprodi/PIC {sub.unit}</small></div>
            <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => toast.push(`Pesan klarifikasi dikirim ke ${sub.pic} (simulasi).`)}>Hubungi</button>
          </div>
        </aside>
      </div>

      <Modal open={rejectOpen} title="Tolak usulan" onClose={() => setRejectOpen(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setRejectOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" disabled={reason.trim().length < 10} onClick={reject}>Tolak Usulan</button></>}>
        <p className="u-hint">Usulan <b>{sub.id}</b> akan ditutup dan tidak dapat diteruskan ke WR II.</p>
        <div className="u-field"><label className="u-label" htmlFor="rj">Alasan penolakan (minimal 10 karakter)</label><textarea id="rj" className="u-textarea" value={reason} onChange={(e) => setReason(e.target.value)} /></div>
      </Modal>
    </div>
  );
}

const TA_SHORT = 'TA 2024/2025 Genap';