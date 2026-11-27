import { Link } from 'react-router-dom';
import { ArrowLeft, Timer } from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { BASE } from '../../data/bkpuData';
import { SlaChip } from '../../components/bkpu/shared';
import PageHeader from '../../components/ui/PageHeader';

const HOURS_LEFT = { 1: '± 20 jam kerja', 2: '± 12 jam kerja', 3: '4 jam kerja' };

export default function MatriksSla() {
  const { queue, lpjQueue } = useBkpu();
  const sorted = [...queue].sort((a, b) => b.slaDay - a.slaDay);

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Verifikasi Anggaran' }, { label: 'Matriks SLA' }]}
        title="Matriks SLA Telaah BKPU"
        subtitle="Rincian sisa waktu telaah untuk setiap berkas dalam antrean. Standar SLA universitas: maksimal 3 hari kerja per berkas."
        accent
        actions={<Link to={`${BASE}/verifikasi`} className="u-btn u-btn-outline"><ArrowLeft size={15} /> Kembali ke Antrean</Link>}
      />
      <div className="u-sum-grid cols-4">
        {[1, 2, 3].map((d) => (
          <div key={d} className={`u-sum u-sum-${d === 3 ? 'maroon' : d === 2 ? 'blue' : 'green'}`}>
            <div className="u-sum-top"><span>Hari ke-{d}</span><Timer size={19} /></div>
            <p className="u-sum-value">{queue.filter((s) => s.slaDay === d).length} <small>Usulan</small></p>
            <p className="u-sum-sub">{d === 3 ? 'Tenggat hari ini' : d === 2 ? 'Dalam batas wajar' : 'SLA aman'}</p>
          </div>
        ))}
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Antrean LPJ</span><Timer size={19} /></div><p className="u-sum-value">{lpjQueue.length} <small>Berkas</small></p><p className="u-sum-sub">SOP uji fisik maks. 5 hari kerja</p></div>
      </div>
      <section className="card">
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 760 }}>
            <thead><tr><th>No. Usulan</th><th>Unit</th><th className="num">Nilai</th><th>Posisi SLA</th><th>Perkiraan Sisa Waktu</th><th>Aksi</th></tr></thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id} className={s.slaDay >= 3 ? 'row-err' : ''}>
                  <td><span className="u-id">{s.id}</span></td><td>{s.unit}</td><td className="num strong">{formatRupiah(s.amount)}</td>
                  <td><SlaChip day={s.slaDay} /></td><td>{HOURS_LEFT[s.slaDay]}</td>
                  <td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-btn u-btn-soft u-btn-sm">Telaah</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <div className="u-empty"><strong>Antrean kosong</strong>Tidak ada berkas yang menunggu telaah.</div>}
        </div>
        <p className="u-hint" style={{ marginTop: '0.7rem' }}>Perkiraan sisa waktu adalah data contoh. Perhitungan sebenarnya memakai jam kerja dan kalender libur dari server.</p>
      </section>
    </div>
  );
}