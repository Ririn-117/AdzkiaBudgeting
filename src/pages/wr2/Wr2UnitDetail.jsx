import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { BASE, POS, UNITS_MATRIX } from '../../data/wr2Data';
import PageHeader from '../../components/ui/PageHeader';
import RecordDetail from '../../components/ui/RecordDetail';

export default function Wr2UnitDetail() {
  const { code } = useParams();
  const { submissions } = useWr2();
  const unit = UNITS_MATRIX.find((u) => u.code === code);

  if (!unit) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Laporan Anggaran', to: `${BASE}/laporan` }, { label: 'Tidak ditemukan' }]} title="Unit tidak ditemukan" />
        <div className="card u-empty"><SearchX size={32} /><strong>Kode unit {code} tidak ada</strong></div>
      </div>
    );
  }
  const list = submissions.filter((s) => s.fc === code);

  return (
    <RecordDetail
      crumbs={[{ label: 'Riwayat & Laporan' }, { label: 'Laporan Anggaran', to: `${BASE}/laporan` }, { label: unit.code }]}
      title={unit.name}
      subtitle={`${unit.fac} • Kode: ${unit.kode}`}
      badge={<span className={`u-badge u-badge-${unit.tone}`}>{unit.status}</span>}
      actions={<Link to={`${BASE}/laporan`} className="u-btn u-btn-outline"><ArrowLeft size={15} /> Kembali</Link>}
      fields={[
        { label: 'Pagu Awal', value: formatRupiah(unit.pagu) }, { label: 'Usulan Masuk', value: formatRupiah(unit.usul) },
        { label: 'Disetujui WR II', value: formatRupiah(unit.setuju) }, { label: 'Realisasi SP2D', value: formatRupiah(unit.real) },
        { label: 'Sisa Pagu', value: formatRupiah(unit.pagu - unit.setuju) }, { label: 'Serapan', value: `${((unit.real / unit.pagu) * 100).toFixed(1)}%` },
      ]}
    >
      <section className="card">
        <h2 className="u-h2">Pengajuan Terkait Unit ({list.length})</h2>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 600 }}>
            <thead><tr><th>No. Usulan</th><th>Kegiatan</th><th className="num">Total</th><th>Posisi</th></tr></thead>
            <tbody>{list.slice(0, 10).map((s) => (<tr key={s.id}><td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-id">{s.id}</Link></td><td>{s.title}</td><td className="num strong">{formatRupiah(s.amount)}</td><td><span className={`u-badge u-badge-${POS[s.stage].tone}`}>{POS[s.stage].label}</span></td></tr>))}</tbody>
          </table>
          {list.length === 0 && <div className="u-empty"><strong>Belum ada pengajuan</strong>Unit ini tidak memiliki pengajuan pada data contoh.</div>}
        </div>
      </section>
    </RecordDetail>
  );
}