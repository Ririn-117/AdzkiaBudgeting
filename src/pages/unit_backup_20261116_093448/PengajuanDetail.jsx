import { Link, useParams } from 'react-router-dom';
import { Banknote, ClipboardCheck, FilePen, SearchX } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { BASE, SUBMISSIONS, SUBMISSION_STATUS, buildRab } from '../../data/unitData';
import RecordDetail from '../../components/ui/RecordDetail';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';

const TIMELINES = {
  revisi: (s) => [
    { title: 'Catatan Revisi Ditambahkan', time: '19 Apr, 10:15', tone: 'amber', text: `Verifikator BKPU: ${s.note}` },
    { title: 'Diajukan ke BKPU', time: s.date, tone: 'slate', text: 'Usulan diajukan oleh Kaprodi dan masuk antrean verifikasi.' },
  ],
  verifikasi: (s) => [
    { title: 'Menunggu Telaah WR II', time: '16 Apr', tone: 'slate', text: s.position },
    { title: 'Diajukan ke BKPU', time: s.date, tone: 'slate', text: 'Usulan diajukan oleh Kaprodi.' },
  ],
  disetujui: (s) => [
    { title: 'Persetujuan WR II', time: '15 Apr', tone: 'green', text: `Usulan disetujui penuh. ${s.position}.` },
    { title: 'Verifikasi BKPU Selesai', time: '10 Apr', tone: 'slate', text: 'Rincian RAB sesuai SBM Universitas Adzkia.' },
    { title: 'Diajukan ke BKPU', time: s.date, tone: 'slate', text: 'Usulan diajukan oleh Kaprodi.' },
  ],
  draft: (s) => [
    { title: 'Draft Disimpan', time: s.date, tone: 'slate', text: `Kelengkapan data ${s.completeness}%. Lengkapi sebelum diajukan.` },
  ],
};

export default function PengajuanDetail() {
  const { id } = useParams();
  const s = SUBMISSIONS.find((x) => x.id === id);

  if (!s) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Daftar Pengajuan', to: `${BASE}/pengajuan` }, { label: 'Tidak ditemukan' }]} title="Pengajuan tidak ditemukan" />
        <div className="card u-empty">
          <SearchX size={32} />
          <strong>Usulan {id} tidak ada</strong>
          <Link to={`${BASE}/pengajuan`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Daftar Pengajuan</Link>
        </div>
      </div>
    );
  }

  const meta = SUBMISSION_STATUS[s.status];
  const rab = buildRab(s.total);

  let actions = <Link to={`${BASE}/pengajuan`} className="u-btn u-btn-outline">Kembali ke Daftar</Link>;
  if (s.status === 'revisi') actions = <Link to={`${BASE}/pengajuan/baru`} className="u-btn u-btn-primary"><FilePen size={15} /> Perbaiki Usulan</Link>;
  if (s.status === 'draft') actions = <Link to={`${BASE}/pengajuan/baru`} className="u-btn u-btn-primary"><FilePen size={15} /> Lanjutkan Pengisian</Link>;
  if (s.phase === 'cairkan') actions = <Link to={`${BASE}/pencairan`} className="u-btn u-btn-navy"><Banknote size={15} /> Ajukan Pencairan</Link>;
  if (s.phase === 'lpj') actions = <Link to={`${BASE}/laporan-spj`} className="u-btn u-btn-navy"><ClipboardCheck size={15} /> Buat LPJ</Link>;

  return (
    <RecordDetail
      crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Daftar Pengajuan', to: `${BASE}/pengajuan` }, { label: s.id }]}
      title={s.title}
      subtitle={`${s.id} • diajukan ${s.date}`}
      badge={<StatusBadge tone={meta.tone} dot>{meta.label}</StatusBadge>}
      actions={actions}
      notes={
        s.status === 'revisi'
          ? [{ tone: 'warn', title: 'Catatan Revisi BKPU', text: s.note, to: `${BASE}/pengajuan/baru`, linkLabel: 'Buka formulir revisi' }]
          : s.locked
            ? [{ tone: 'info', title: 'Berkas terkunci', text: 'Pengajuan yang sedang diverifikasi tidak dapat diubah sampai proses selesai.' }]
            : []
      }
      fields={[
        { label: 'No. Usulan', value: s.id },
        { label: 'Tanggal Pengajuan', value: s.date },
        { label: 'Penanggung Jawab', value: s.pic },
        { label: 'Periode', value: s.ta },
        { label: 'Kategori Anggaran', value: s.category },
        { label: 'Sumber Dana', value: s.source },
        { label: 'Total RAB', value: formatRupiah(s.total), wide: true },
      ]}
      timeline={TIMELINES[s.status](s)}
    >
      <section className="card">
        <h2 className="u-h2">Ringkasan Rincian Anggaran (RAB)</h2>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 520 }}>
            <thead><tr><th>No</th><th>Komponen</th><th>Kategori Belanja</th><th className="num">Subtotal</th></tr></thead>
            <tbody>
              {rab.map((r, i) => (
                <tr key={r.name}>
                  <td>{i + 1}</td><td className="u-cell-title">{r.name}</td><td>{r.cat}</td><td className="num strong">{formatRupiah(r.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={3}>Total</td><td className="num">{formatRupiah(rab.reduce((a, r) => a + r.subtotal, 0))}</td></tr></tfoot>
          </table>
        </div>
        <p className="u-hint" style={{ marginTop: '0.7rem' }}>Rincian ini data contoh. Rincian asli akan dimuat dari server setelah backend terhubung.</p>
      </section>
    </RecordDetail>
  );
}
