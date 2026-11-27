import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle, Banknote, Building2, CheckCircle2, Download, FileText, History, Landmark, Printer, RotateCcw, Save, SearchX,
  ShieldAlert, ShieldCheck, ShoppingCart, UserRound, Wallet, XCircle, BadgeCheck, Paperclip, Circle,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { BASE, LPJ_STAGE_META, getLpjDetail } from '../../data/bkpuData';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

const CHECKS = [
  'Uji faktur materai Rp 10.000 telah valid sesuai batasan transaksi.',
  'Laporan Berita Acara Pelaksanaan Kegiatan telah disahkan Dekan.',
  'Seluruh bukti potong PPh/PPN telah diunggah dan tervalidasi di DJP.',
];

export default function TelaahLpj() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { lpjs, decideLpj } = useBkpu();
  const lpj = lpjs.find((l) => l.id === id);
  const d = useMemo(() => (lpj ? getLpjDetail(lpj) : null), [lpj]);

  const [checks, setChecks] = useState([true, true, false]);
  const [note, setNote] = useState(lpj?.id === 'LPJ-2025-003'
    ? 'Secara substansi kegiatan dan kuitansi fisik telah terlaksana 100%. Mohon unit melampirkan bukti potong/setor PPh 23 untuk katering sebesar Rp 180.000 sebelum diterbitkan Berita Acara Rekonsiliasi (BAR).' : '');
  const [error, setError] = useState('');

  if (!lpj) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Verifikasi LPJ' }, { label: 'Tidak ditemukan' }]} title="LPJ tidak ditemukan" />
        <div className="card u-empty"><SearchX size={32} /><strong>Laporan {id} tidak ada</strong>
          <Link to={`${BASE}/lpj`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Semua LPJ</Link></div>
      </div>
    );
  }

  const readOnly = lpj.stage === 'sah';
  const allValid = d.items.every((i) => i.ok);
  const allChecked = checks.every(Boolean);
  const invalid = d.items.filter((i) => !i.ok);
  const meta = LPJ_STAGE_META[lpj.stage];
  const totalRab = d.items.reduce((a, i) => a + i.rab, 0);
  const totalReal = d.items.reduce((a, i) => a + i.real, 0);
  const canApprove = allValid && (allChecked || lpj.id !== 'LPJ-2025-003') && !readOnly;
  const decisionText = canApprove ? 'Memenuhi Syarat' : 'Belum Memenuhi Syarat';

  const approve = () => {
    decideLpj(lpj, 'approve', note.trim());
    toast.push(`${lpj.id} disahkan dan BAP diterbitkan (simulasi).`);
    navigate(`${BASE}/lpj`);
  };
  const revise = () => {
    if (note.trim().length < 10) { setError('Isi instruksi revisi (minimal 10 karakter) agar PIC unit tahu bukti apa yang kurang.'); return; }
    decideLpj(lpj, 'revise', note.trim());
    toast.push(`Permintaan perbaikan ${lpj.id} dikirim ke PIC unit (simulasi).`);
    navigate(`${BASE}/lpj`);
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Verifikasi LPJ' }, { label: 'Menunggu Pemeriksaan' }, { label: lpj.id }]}
        title="Pemeriksaan Laporan Pertanggungjawaban (LPJ)"
        badge={<span className="u-tag">Tahap: Telaah Faktual BKPU</span>}
        actions={<>
          <button type="button" className="u-btn u-btn-soft" onClick={() => toast.push('Unduh bundle LPJ ZIP (simulasi, belum ada berkas dari server).')}><Download size={15} /> Unduh Bundle LPJ (ZIP)</button>
          <button type="button" className="u-btn u-btn-soft" onClick={() => window.print()}><Printer size={15} /> Cetak Lembar Telaah</button>
        </>}
      />

      <section className="card bk-lpj-head">
        <div>
          <p className="bk-ref"><span className="u-badge u-badge-maroon">{lpj.id}</span> <span className="bk-id-chip">{d.sk}</span> <span className="u-hint">Tanggal Masuk: {d.entry}</span> <span className={`u-badge u-badge-${meta.tone}`}>{meta.label}</span></p>
          <h2>{lpj.title}</h2>
          <div className="bk-lpj-people">
            <div><Building2 size={16} /><span>UNIT PELAKSANA</span><b>{d.unitName}</b><small>{d.unitSub}</small></div>
            <div><UserRound size={16} /><span>KETUA PIC KEGIATAN</span><b>{d.pic}</b><small>{d.picSub}</small></div>
            <div><ShieldCheck size={16} /><span>PENGUSUL ANGGARAN</span><b>{d.pengusul}</b><small>{d.pengusulSub}</small></div>
          </div>
        </div>
        <div className="bk-audit-box">
          <p><b>KEPATUHAN AUDIT FISKAL</b><span>{d.percent}% Selesai</span></p>
          <div className="u-bar maroon"><i style={{ width: `${d.percent}%` }} /></div>
          <p><span>Berkas Bukti:</span><b>{d.files.done} Disahkan / {d.files.pending} Pending</b></p>
          <p><span>Status Setoran SILPA:</span><b>{lpj.silpa ? formatRupiah(lpj.silpa) : 'Rp 0 (Nihil - Pass)'}</b></p>
        </div>
      </section>

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>Anggaran Disetujui</span><Wallet size={19} /></div><p className="u-sum-value">{formatRupiah(lpj.pagu)}</p><p className="u-sum-sub"><Landmark size={13} /> Dasar SK WR II Bidang Keuangan</p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Realisasi Dilaporkan</span><ShoppingCart size={19} /></div><p className="u-sum-value">{formatRupiah(lpj.real)}</p><p className="u-sum-sub"><span className="u-badge u-badge-sky">{Math.round((lpj.real / lpj.pagu) * 100)}% Terserap</span> Sesuai Alokasi</p></div>
        <div className="u-sum u-sum-rose"><div className="u-sum-top"><span>Sisa Saldo (Silpa)</span><Banknote size={19} /></div><p className="u-sum-value">{formatRupiah(lpj.silpa)}</p><p className="u-sum-sub"><CheckCircle2 size={13} /> {lpj.silpa ? 'Wajib setor balik' : 'Nihil / Tidak ada setor balik'}</p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Verifikasi Pajak & Bukti</span><AlertTriangle size={19} /></div><p className="u-sum-value">{d.txFiles} <small>Berkas Transaksi</small></p><p className="u-sum-sub" style={{ color: invalid.length ? '#b4121f' : '#0b6b44' }}>{invalid.length ? `! ${invalid.length} Catatan PPh 23 Perlu Solusi` : 'Seluruh pajak sesuai'}</p></div>
      </div>

      <div className="bk-telaah-grid">
        <div className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight">
              <div><h2>Komparasi Rincian Belanja vs Bukti Fisik</h2><p className="u-hint">Uji keabsahan kuitansi, faktur bernomor seri, materai, dan potongan pajak transaksi</p></div>
              <span><span className="u-badge u-badge-sky">{d.items.length} Pos Alokasi</span> {invalid.length > 0 && <span className="u-badge u-badge-red">{invalid.length} Perlu Klarifikasi</span>}</span>
            </div>
            <div className="u-scroll">
              <table className="u-table" style={{ minWidth: 860 }}>
                <thead><tr><th>No</th><th>Item Belanja & Spesifikasi</th><th className="num">RAB Disetujui</th><th className="num">Realisasi Riil</th><th>Dokumen Bukti</th><th>Kepatuhan Pajak</th><th>Status BKPU</th></tr></thead>
                <tbody>
                  {d.items.map((it, i) => (
                    <tr key={it.name} className={it.ok ? '' : 'row-err'}>
                      <td>{i + 1}</td>
                      <td style={{ maxWidth: 250 }}><span className="u-cell-title">{it.name}</span>{!it.ok && <span className="u-badge u-badge-red" style={{ marginLeft: 6 }}>{it.flag}</span>}<span className="u-cell-sub">{it.spec}</span><span className="u-cell-sub">{it.code}</span></td>
                      <td className="num">{formatRupiah(it.rab)}</td>
                      <td className="num">{formatRupiah(it.real)}</td>
                      <td><span className="u-mono" style={{ color: '#3b4a8f' }}><Paperclip size={12} /> {it.doc}</span><span className="u-cell-sub">{it.docNote}</span></td>
                      <td><b style={{ color: it.ok ? '#0f172a' : '#b4121f' }}>{it.tax}</b><span className="u-cell-sub" style={it.ok ? undefined : { color: '#b4121f' }}>{it.taxNote}</span></td>
                      <td>{it.ok ? <span className="u-badge u-badge-sky"><CheckCircle2 size={12} /> Valid</span> : <span className="u-badge u-badge-red"><XCircle size={12} /> Revisi</span>}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={2}>Total Rekapitulasi:</td><td className="num">{formatRupiah(totalRab)}</td><td className="num">{formatRupiah(totalReal)}</td><td colSpan={3} style={{ fontWeight: 500 }}>Selisih Pembukuan: {formatRupiah(totalRab - totalReal)} ({totalRab === totalReal ? 'Pas/Seimbang' : 'Silpa'})</td></tr></tfoot>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><ShieldAlert size={20} /> Daftar Uji Petik Kepatuhan Perpajakan & Legalitas Fiskal</h2><span className="u-hint">Standard Operating Procedure BKPU No. 04/KEU/2024</span></div>
            <div className="bk-tax-grid">
              {d.taxChecks.map((t) => (
                <div key={t.title} className={`bk-tax ${t.ok ? '' : 'bad'}`}>
                  <p className="bk-tax-head"><b>{t.title}</b>{t.ok ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}</p>
                  <p>{t.text}</p>
                  <p className="bk-tax-foot"><b>{t.status}</b><span>{t.ok ? 'Lengkap' : 'Pending'}</span></p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="bk-side">
          <section className="card bk-panel">
            <div className="bk-sec-head tight"><h2>Lembar Keputusan BKPU</h2><span className={`u-badge ${canApprove ? 'u-badge-green' : 'u-badge-red'}`}>{decisionText}</span></div>
            <dl className="u-kv">
              <div><dt>Kelayakan SPJ Keuangan</dt><dd>{d.items.length - invalid.length} dari {d.items.length} Pos Bersih</dd></div>
              <div><dt>Kekurangan Setoran Pajak</dt><dd style={{ color: invalid.length ? '#b4121f' : undefined }}>{invalid.length ? 'Rp 180.000' : 'Rp 0'}</dd></div>
              <div><dt>Sanksi Keterlambatan</dt><dd style={{ color: '#0b6b44' }}>0 Hari (Tepat Waktu)</dd></div>
            </dl>
            <p className="bk-panel-label">Instruksi Revisi & Catatan Auditor <b>Wajib dikirim ke PIC</b></p>
            <textarea className="u-textarea" rows={5} value={note} readOnly={readOnly} onChange={(e) => { setNote(e.target.value); setError(''); }} aria-label="Instruksi revisi" placeholder="Tulis instruksi revisi atau catatan audit..." />
            {error && <p className="u-err" role="alert">{error}</p>}
            <ul className="bk-checks">
              {CHECKS.map((t, i) => (
                <li key={t} className={i === 2 ? 'danger' : ''}>
                  <label><input type="checkbox" className="u-check" checked={checks[i]} disabled={readOnly} onChange={() => setChecks((c) => c.map((v, k) => (k === i ? !v : v)))} /><span>{t}</span></label>
                </li>
              ))}
            </ul>
            {readOnly ? (
              <div className="u-note u-note-success"><BadgeCheck size={18} /><div><strong>LPJ telah disahkan</strong><p>BAP telah diterbitkan. Halaman ini dalam mode baca.</p></div></div>
            ) : (
              <div className="bk-actions">
                <button type="button" className="u-btn u-btn-soft u-btn-block" onClick={revise}><RotateCcw size={15} /> Minta Perbaikan / Kelengkapan Bukti ke Unit</button>
                <button type="button" className="u-btn u-btn-primary u-btn-block" disabled={!canApprove} onClick={approve}><BadgeCheck size={15} /> Sahkan Pemeriksaan LPJ & Terbitkan BAP</button>
                <button type="button" className="u-link" onClick={() => toast.push('Draft hasil telaah disimpan (simulasi).')}><Save size={14} /> Simpan Draft Hasil Telaah</button>
              </div>
            )}
            <p className="bk-auth">Pemberitahuan otomatis via WhatsApp & Email akan terkirim ke {d.pic} setelah tombol tindakan ditekan.</p>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><History size={20} /> Jejak Audit & Kronologi LPJ</h2><span className="u-hint">{d.history.length} Peristiwa</span></div>
            <ul className="u-timeline">
              {d.history.map((h) => (
                <li key={h.title} className={`tl-${h.tone}`}>
                  <i />
                  <div><div className="u-tl-head"><strong>{h.title}</strong><time>{h.time}</time></div><p>{h.text}</p></div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}