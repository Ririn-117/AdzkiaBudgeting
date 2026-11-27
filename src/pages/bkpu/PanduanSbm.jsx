import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, SBM_ROWS } from '../../data/bkpuData';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

export default function PanduanSbm() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const rows = useMemo(() => SBM_ROWS.filter((r) => r.join(' ').toLowerCase().includes(q.trim().toLowerCase())), [q]);

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Rujukan' }, { label: 'Panduan SBM 2025' }]}
        title="Panduan Standar Biaya Masukan (SBM) 2025"
        subtitle="Rujukan wajib verifikasi: Keputusan Rektor Universitas Adzkia No. 14/SK/UA/2024 (Revisi 02.2025)."
        accent
        actions={<>
          <Link to={`${BASE}/verifikasi`} className="u-btn u-btn-outline"><ArrowLeft size={15} /> Kembali</Link>
          <button type="button" className="u-btn u-btn-navy" onClick={() => { downloadCsv('Plafon_SBM_2025.csv', [['Kategori', 'Uraian', 'Satuan', 'Batas Tarif'], ...SBM_ROWS]); toast.push('Tabel plafon SBM diunduh (CSV).'); }}><Download size={15} /> Unduh Tabel Plafon</button>
        </>}
      />
      <section className="card">
        <div className="u-iwrap" style={{ maxWidth: 420 }}><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari kategori atau uraian..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari SBM" /></div>
        <div className="u-scroll" style={{ marginTop: '1rem' }}>
          <table className="u-table" style={{ minWidth: 560 }}>
            <thead><tr><th>Kategori</th><th>Uraian</th><th>Satuan</th><th className="num">Batas Tarif</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.join('-')}><td><span className="u-badge u-badge-sky">{r[0]}</span></td><td className="u-cell-title">{r[1]}</td><td>{r[2]}</td><td className="num strong">{formatRupiah(r[3])}</td></tr>)}</tbody>
          </table>
          {rows.length === 0 && <div className="u-empty"><strong>Tidak ditemukan</strong>Coba kata kunci lain.</div>}
        </div>
        <p className="u-hint" style={{ marginTop: '0.7rem' }}>Tarif di atas adalah data contoh. Gunakan dokumen SBM resmi Universitas Adzkia sebagai acuan.</p>
      </section>
    </div>
  );
}