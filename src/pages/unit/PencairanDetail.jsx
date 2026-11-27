import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, SearchX } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { BASE, DISBURSEMENTS } from '../../data/unitData';
import { fetchDisbursementDetail } from '../../services/unitService';
import RecordDetail from '../../components/ui/RecordDetail';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';

export default function PencairanDetail() {
  const { id } = useParams();
  const fallback = DISBURSEMENTS.find((x) => x.id === id) || null;
  const [r, setR] = useState(fallback);
  const [loading, setLoading] = useState(!fallback);

  useEffect(() => {
    let active = true;
    fetchDisbursementDetail(id)
      .then((res) => {
        if (active && res) setR(res);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading && !r) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Pencairan Dana', to: `${BASE}/pencairan` }, { label: id }]} title="Memuat detail pencairan..." />
      </div>
    );
  }

  if (!r) {
    return (
      <div className="upage">
        <PageHeader crumbs={[{ label: 'Pencairan Dana', to: `${BASE}/pencairan` }, { label: 'Tidak ditemukan' }]} title="Pencairan tidak ditemukan" />
        <div className="card u-empty">
          <SearchX size={32} />
          <strong>Transaksi {id} tidak ada</strong>
          <Link to={`${BASE}/pencairan`} className="u-btn u-btn-primary" style={{ marginTop: '0.8rem' }}>Kembali ke Pencairan Dana</Link>
        </div>
      </div>
    );
  }

  const paid = r.status === 'cair';
  const timeline = [
    ...(paid ? [{ title: 'Dana Dicairkan', time: r.statusNote.replace('Realisasi Kas: ', ''), tone: 'green', text: `Dana ${formatRupiah(r.amount)} masuk ke ${r.bank}.` }] : [{ title: 'SP2D Terbit, Menunggu Kliring', time: r.statusNote.replace('Est. Cair: ', 'Est. '), tone: 'amber', text: 'Dana sedang diproses kasir universitas dan menunggu kliring bank.' }]),
    { title: 'SP2D Diterbitkan', time: r.date, tone: 'slate', text: `Nomor SP2D: ${r.sp2d}` },
    { title: 'Pengajuan Pencairan Diajukan', time: r.date, tone: 'slate', text: `${r.termin} (${r.terminNote}) diajukan oleh Kaprodi PGMI.` },
  ];

  return (
    <RecordDetail
      crumbs={[{ label: 'Modul Keuangan' }, { label: 'Pencairan Dana', to: `${BASE}/pencairan` }, { label: r.id }]}
      title={r.id}
      subtitle={r.activity}
      badge={paid ? <StatusBadge tone="green">Telah Dicairkan</StatusBadge> : <StatusBadge tone="blue" dot>{r.statusLabel}</StatusBadge>}
      actions={r.canLpj ? <Link to={`${BASE}/laporan-spj`} className="u-btn u-btn-primary">Lanjut LPJ <ArrowRight size={14} /></Link> : <Link to={`${BASE}/pencairan`} className="u-btn u-btn-outline">Kembali ke Daftar</Link>}
      fields={[
        { label: 'Induk Pengajuan', value: <Link to={`${BASE}/pengajuan/${r.ref}`} className="u-link">{r.ref}</Link> },
        { label: 'Unit Pelaksana', value: r.unit },
        { label: 'Pagu Disetujui', value: formatRupiah(r.approved) },
        { label: 'Termin', value: `${r.termin} (${r.terminNote})` },
        { label: 'Nominal Pencairan', value: formatRupiah(r.amount) },
        { label: 'No. Kuitansi', value: r.receipt },
        { label: 'Rekening Tujuan', value: `${r.bank} - ${r.account}`, wide: true },
        { label: 'No. SP2D', value: r.sp2d, wide: true },
      ]}
      timeline={timeline}
    />
  );
}
