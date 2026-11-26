import { useState } from 'react';
import { BadgeCheck, Copy, Download, FileSignature, Fingerprint, Landmark, Lock, ScrollText, ShieldCheck, UserCheck, Wallet } from 'lucide-react';
import { REKTOR_PROFILE as P } from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { ReadOnlyTag } from '../../components/rektor/RektorParts';

const TABS = [
  ['bio', 'Biodata & Legalitas Jabatan'],
  ['statuta', 'Statuta & Ruang Lingkup Kebijakan'],
  ['delegasi', 'Pengawasan Keuangan & Delegasi'],
  ['keamanan', 'Keamanan & Riwayat Sesi'],
];

const BIO = [
  ['Nama Lengkap & Gelar', P.name], ['Jabatan Institusi', P.jabatan],
  ['Nomor Induk Pegawai (NIP)', P.nip], ['Nomor Induk Dosen Nasional (NIDN)', P.nidn],
  ['Pangkat / Golongan Ruang', P.pangkat], ['Jabatan Fungsional Akademik', P.jabatanFungsional],
  ['Basis Kepakaran Akademik', P.kepakaran], ['Masa Bhakti SK Pelantikan', P.masaBhakti],
];

const STATUTA = [
  ['Penetapan pagu definitif', 'Pagu RKAT disahkan melalui Keputusan Rektor setelah telaah WR II dan verifikasi BKPU.'],
  ['Pengawasan realisasi', 'Memantau serapan anggaran, pencairan kas SP2D, dan pertanggungjawaban LPJ seluruh satuan kerja.'],
  ['Arah strategis', 'Seluruh program kerja mengacu pada Rencana Strategis (RENSTRA) Adzkia 2020–2025.'],
];

const DELEGASI = [
  ['Wakil Rektor II', 'Dr. H. Alfian, S.E., M.Si., Ak.', 'Otorisator keuangan kampus: telaah dan persetujuan usulan RKAT.', UserCheck],
  ['Kepala Bagian BKPU', 'Nurul Hidayati, M.Ak., CA.', 'Auditor internal institusi: verifikasi kepatuhan SBM, kuitansi, dan perpajakan LPJ.', ScrollText],
  ['Kasir Utama Perbankan', 'Unit Layanan BSI Rektorat', 'Disbursement & giro operasional: eksekusi SP2D melalui CMS Bank BSI.', Wallet],
  ['Bendahara Yayasan', 'Yayasan Pendidikan Adzkia', 'Otorisasi pencairan dan rekonsiliasi buku kas dengan SIMKEU.', Landmark],
];

const SECURITY = [
  [BadgeCheck, 'TTE BSrE Tersertifikasi', 'Tanda tangan elektronik pimpinan tersertifikasi.'],
  [Lock, 'Mode Read-Only Eksekutif Ditegakkan', 'Sesuai Statuta kampus, akun ini hanya dapat meninjau dan tidak dapat mengubah data anggaran.'],
  [Fingerprint, 'Akses Terautentikasi', 'Profil pimpinan tertinggi. Integritas data terkunci.'],
  [ShieldCheck, 'Kode Enkripsi Ledger: SHA-256', 'Status sinkronisasi: SIMKEU SYNC (Oversight Mode) • Audit Ready.'],
];

export default function RektorProfil() {
  const toast = useToast();
  const [tab, setTab] = useState('bio');

  const copy = async () => {
    const text = [P.name, P.title, `NIP: ${P.nip}`, `NIDN: ${P.nidn}`, P.pangkat, P.jabatanFungsional, P.masaBhakti].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.push('Data profil disalin.');
    } catch {
      toast.push('Tidak dapat menyalin otomatis. Salin data secara manual.', 'error');
    }
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Sistem' }, { label: 'Profil Saya' }]}
        title="Profil Pimpinan"
        accent
        badge={<ReadOnlyTag>Mode Read-Only Eksekutif</ReadOnlyTag>}
      />

      <section className="card rk-profile">
        <div className="rk-photo" aria-hidden="true">A</div>
        <div className="rk-profile-main">
          <div className="rk-tags">
            <StatusBadge tone="maroon">Periode 2023–2027</StatusBadge>
            <StatusBadge tone="green" icon={BadgeCheck}>TTE BSrE Tersertifikasi</StatusBadge>
            <StatusBadge tone="navy">{P.pangkat.split(' / ')[0]} ({P.pangkat.split('Gol. ')[1]})</StatusBadge>
          </div>
          <h2>{P.name}</h2>
          <p>NIP: {P.nip} • NIDN: {P.nidn} • {P.sk}</p>
          <p>{P.title} Padang • {P.kantor}</p>
          <div className="rk-secure"><i /><div><b>Akses terautentikasi: profil pimpinan tertinggi</b>Mode read-only eksekutif ditegakkan sesuai Statuta kampus.</div></div>
        </div>
        <div className="rk-profile-actions">
          <button type="button" className="u-btn u-btn-outline" onClick={copy}><Copy size={15} /> Salin Data Profil</button>
          <button type="button" className="u-btn u-btn-primary" onClick={() => toast.push('SK Rektorat diunduh (simulasi).')}><Download size={15} /> Unduh SK Rektorat</button>
        </div>
      </section>

      <section className="card">
        <div className="u-tabs" role="tablist">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </div>

        <div style={{ marginTop: '1.2rem' }}>
          {tab === 'bio' && (
            <>
              <div className="rk-sec-title">
                <div><h2>Data Legalitas Pejabat Rektor</h2><p>Arsip kepegawaian dan nomor induk resmi pimpinan universitas.</p></div>
                <span className="rk-lock"><Lock size={12} /> Integritas Data Terkunci • Terverifikasi BKPU</span>
              </div>
              <dl className="u-dl">
                {BIO.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </>
          )}

          {tab === 'statuta' && (
            <>
              <div className="rk-sec-title"><div><h2>Statuta & Ruang Lingkup Kebijakan</h2><p>Kewenangan pengawasan Rektor atas siklus anggaran institusi.</p></div></div>
              <ul className="rk-list">
                {STATUTA.map(([t, x]) => <li key={t}><ScrollText size={17} /><div><strong>{t}</strong>{x}</div></li>)}
              </ul>
            </>
          )}

          {tab === 'delegasi' && (
            <>
              <div className="rk-sec-title"><div><h2>Pengawasan Keuangan & Delegasi</h2><p>Pejabat dan unit yang menjalankan fungsi keuangan di bawah supervisi Rektor.</p></div></div>
              <ul className="rk-list">
                {DELEGASI.map(([role, nm, desc, Icon]) => <li key={role}><Icon size={17} /><div><strong>{role} • {nm}</strong>{desc}</div></li>)}
              </ul>
            </>
          )}

          {tab === 'keamanan' && (
            <>
              <div className="rk-sec-title"><div><h2>Keamanan & Riwayat Sesi</h2><p>Status keamanan akun eksekutif. Riwayat sesi rinci akan tampil saat sistem terhubung ke API.</p></div></div>
              <ul className="rk-list">
                {SECURITY.map(([Icon, t, x]) => <li key={t} className="lock"><Icon size={17} /><div><strong>{t}</strong>{x}</div></li>)}
              </ul>
            </>
          )}
        </div>
      </section>
      <p className="rk-count-line"><FileSignature size={13} style={{ verticalAlign: '-2px' }} /> Dokumen jabatan: {P.sk}</p>
    </div>
  );
}
