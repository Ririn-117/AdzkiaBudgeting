import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, SearchX } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { BASE, LPJS, LPJ_STATUS } from '../../data/unitData';
import RecordDetail from '../../components/ui/RecordDetail';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';

const CHECKLIST = ['Kuitansi asli bermeterai', 'Faktur / nota pembelian', 'Berita acara kegiatan', 'Daftar hadir peserta', 'Bukti potong pajak (PPh)', 'Dokumentasi kegiatan'];

export default function LpjDetail() {
  const { id } = useParams();
  const toast = useToast();
  const r = LPJS.find((x) => x.id === id);

  if (!r) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Laporan (LPJ)', to: `${BASE}/laporan-spj` }, { label: 'Tidak ditemukan' }]} title="LPJ tidak ditemukan" />
        <div className="card u-empty">
          <SearchX size={32} />
          <strong>Laporan {id} tidak ada</strong>
          <Link to={`${BASE}/laporan-spj`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Laporan LPJ</Link>
        </div>
      </div>
    );
  }

  const meta = LPJ_STATUS[r.status];
  const done = r.status === 'draft' ? Math.round((r.progress / 100) * CHECKLIST.length) : CHECKLIST.length - (r.status === 'revisi' ? 1 : 0);

  const actionLabel = { draft: 'Simpan & Lanjutkan Input', verifikasi: 'Lihat Bukti Lengkap', revisi: 'Unggah Perbaikan Bukti', disetujui: 'Cetak BAP' }[r.status];

  return (
    <RecordDetail
      crumbs={[{ label: 'Modul Keuangan' }, { label: 'Laporan (LPJ)', to: `${BASE}/laporan-spj` }, { label: r.id }]}
      title={r.id}
      subtitle={r.activity}
      badge={<StatusBadge tone={meta.tone} dot={meta.dot}>{meta.label}</StatusBadge>}
      actions={<button type="button" className="u-btn u-btn-primary" onClick={() => toast.push(`${actionLabel} (simulasi, belum terhubung ke server).`)}>{actionLabel}</button>}
      notes={r.status === 'revisi' ? [{ tone: 'danger', title: 'Catatan Auditor SPI', text: r.docNote }] : []}
      fields={[
        { label: 'Induk Pengajuan', value: <Link to={`${BASE}/pengajuan/${r.ref}`} className="u-link">{r.ref}</Link> },
        { label: 'Tanggal LPJ', value: r.date },
        { label: 'Dana Tercairkan', value: formatRupiah(r.dana) },
        { label: 'Realisasi Belanja', value: formatRupiah(r.realisasi) },
        { label: 'Sisa Silpa', value: formatRupiah(r.silpa) },
        { label: 'Keterangan', value: r.extra },
        { label: 'Bukti Transaksi', value: r.docs, wide: true },
      ]}
      timeline={[
        { title: meta.label, time: r.date.split(' • ')[0], tone: r.status === 'revisi' ? 'maroon' : r.status === 'disetujui' ? 'green' : 'amber', text: r.docNote },
        { title: 'LPJ Dibuat', time: r.date.split(' • ')[0], tone: 'slate', text: 'Draft LPJ dibuat oleh Kaprodi PGMI.' },
      ]}
    >
      <section className="card">
        <h2 className="u-h2">Kelengkapan Bukti ({done} dari {CHECKLIST.length})</h2>
        <ul className="u-checklist">
          {CHECKLIST.map((c, i) => (
            <li key={c} className={i < done ? 'ok' : ''}>
              {i < done ? <CheckCircle2 size={18} /> : <Circle size={18} />} {c}
            </li>
          ))}
        </ul>
      </section>
    </RecordDetail>
  );
}
