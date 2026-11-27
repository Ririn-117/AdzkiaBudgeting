import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  Wallet,
  TrendingUp,
  Search,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { BASE } from '../../data/yayasanData';

const MONITORING_SUMMARY = {
  totalAnggaran: 1842000000,
  plafonSk: 'Keputusan Rapat Yayasan #04/SK-YPA',
  totalDicairkan: 1280000000,
  sppDibayar: '42 SPP telah dibayar',
  rasioTerserap: 69.49,
  sisaSaldo: 562000000,
  rasioSisa: 30.51,
  standbyKet: 'Standby BSI Operasional Yayasan',
};

const MATRIKS_KATEGORI = [
  {
    id: 'mat-1',
    nama: 'Pendidikan & Pengembangan Akademik',
    cair: 768000000,
    pagu: 1050000000,
    pct: 73.1,
    color: '#7a0c16',
  },
  {
    id: 'mat-2',
    nama: 'Sekretariat & BSDM Yayasan',
    cair: 342000000,
    pagu: 512000000,
    pct: 66.8,
    color: '#475569',
  },
  {
    id: 'mat-3',
    nama: 'Sosial, Dakwah & Beasiswa YPA',
    cair: 170000000,
    pagu: 280000000,
    pct: 60.7,
    color: '#1e3a8a',
  },
];

const DAFTAR_RINCIAN_KEGIATAN = [
  {
    id: 'keg-1',
    unit: 'FSTI - Teknik Informatika',
    kodeAkun: '5.1.02.04',
    kegiatan: 'Pengadaan Server & Upgrade Lab Komputer CBT',
    noSpp: 'SPP/YPA/2025/019',
    kategori: 'Pendidikan & Pengembangan',
    kategoriTone: 'red',
    disetujui: 450000000,
    dicairkan: 360000000,
    sisa: 90000000,
    pct: 80.0,
    status: 'Aktif / Bertahap',
    statusTone: 'blue',
  },
  {
    id: 'keg-2',
    unit: 'FKIP - PGSD',
    kodeAkun: '5.1.03.01',
    kegiatan: 'Akreditasi Unggul Prodi PGSD & Workshop OBE',
    noSpp: 'SPP/YPA/2025/024',
    kategori: 'Pendidikan & Pengembangan',
    kategoriTone: 'red',
    disetujui: 350000000,
    dicairkan: 258000000,
    sisa: 92000000,
    pct: 73.7,
    status: 'Termin 2 Cair',
    statusTone: 'blue',
  },
  {
    id: 'keg-3',
    unit: 'BSDM Yayasan',
    kodeAkun: '5.2.01.09',
    kegiatan: 'Pelatihan Kepemimpinan Islami & Sertifikasi Dosen',
    noSpp: 'SPP/YPA/2025/031',
    kategori: 'Sekretariat/BSDM',
    kategoriTone: 'blue',
    disetujui: 320000000,
    dicairkan: 212000000,
    sisa: 108000000,
    pct: 66.2,
    status: 'Aktif',
    statusTone: 'blue',
  },
  {
    id: 'keg-4',
    unit: 'Sekretariat Yayasan',
    kodeAkun: '5.2.02.01',
    kegiatan: 'Operasional Kantor Yayasan, Pemeliharaan Aset & Pajak',
    noSpp: 'SPP/YPA/2025/008',
    kategori: 'Sekretariat/BSDM',
    kategoriTone: 'blue',
    disetujui: 192000000,
    dicairkan: 130000000,
    sisa: 62000000,
    pct: 67.7,
    status: 'Rutin',
    statusTone: 'blue',
  },
  {
    id: 'keg-5',
    unit: 'Kemahasiswaan & Lazis',
    kodeAkun: '5.3.01.02',
    kegiatan: "Beasiswa Tahfidz Al-Qur'an & Bantuan Mahasiswa Dhuafa",
    noSpp: 'SPP/YPA/2025/042',
    kategori: 'Sosial & Dakwah',
    kategoriTone: 'purple',
    disetujui: 210000000,
    dicairkan: 140000000,
    sisa: 70000000,
    pct: 66.6,
    status: 'Tersalurkan 66%',
    statusTone: 'blue',
  },
  {
    id: 'keg-6',
    unit: 'LPPM - Dakwah Sosial',
    kodeAkun: '5.3.02.05',
    kegiatan: "Program Da'i Pelosok & Desa Binaan Sumbar",
    noSpp: 'SPP/YPA/2025/051',
    kategori: 'Sosial & Dakwah',
    kategoriTone: 'purple',
    disetujui: 70000000,
    dicairkan: 30000000,
    sisa: 40000000,
    pct: 42.8,
    status: 'Termin 1 Selesai',
    statusTone: 'blue',
  },
];

export default function YayasanMonitoring() {
  const [q, setQ] = useState('');

  const filteredKegiatan = DAFTAR_RINCIAN_KEGIATAN.filter(
    (k) =>
      k.unit.toLowerCase().includes(q.toLowerCase()) ||
      k.kegiatan.toLowerCase().includes(q.toLowerCase()) ||
      k.noSpp.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="yys-page">
      {/* 3 Top Summary KPI Cards */}
      <div className="yys-kpi-grid cols-3">
        {/* Card 1: ALOKASI PLAFON SAH */}
        <div className="yys-kpi-card border-top-blue">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">ALOKASI PLAFON SAH</span>
            <div className="yys-kpi-icon-wrap blue">
              <FileText size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Total Anggaran Disetujui
            </div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              {formatRupiah(MONITORING_SUMMARY.totalAnggaran)}
            </div>
          </div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge blue">100% Plafon TA</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {MONITORING_SUMMARY.plafonSk}
            </span>
          </div>
        </div>

        {/* Card 2: REALISASI PERBANKAN / KAS */}
        <div className="yys-kpi-card border-top-maroon">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">REALISASI PERBANKAN / KAS</span>
            <div className="yys-kpi-icon-wrap red">
              <CreditCard size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Total Dana Dicairkan
            </div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              {formatRupiah(MONITORING_SUMMARY.totalDicairkan)}
            </div>
          </div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge red">
              {MONITORING_SUMMARY.rasioTerserap}% Terserap
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {MONITORING_SUMMARY.sppDibayar}
            </span>
          </div>
        </div>

        {/* Card 3: CADANGAN & KOMITMEN SISA */}
        <div className="yys-kpi-card border-top-purple">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">CADANGAN & KOMITMEN SISA</span>
            <div className="yys-kpi-icon-wrap purple">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Total Sisa Saldo
            </div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0', color: '#1e40af' }}>
              {formatRupiah(MONITORING_SUMMARY.sisaSaldo)}
            </div>
          </div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge purple">
              {MONITORING_SUMMARY.rasioSisa}% Tersisa
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {MONITORING_SUMMARY.standbyKet}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section (2 Columns: Matriks Penyerapan + Pangsa Pencairan) */}
      <div className="yys-monitoring-split">
        {/* Left: Matriks Penyerapan 3 Kategori */}
        <div className="yys-matriks-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#7a0c16" />
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                Matriks Penyerapan 3 Kategori Yayasan
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, background: '#dbeafe', borderRadius: 2 }} /> Disetujui
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, background: '#7a0c16', borderRadius: 2 }} /> Dicairkan
              </span>
            </div>
          </div>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.73rem', color: '#64748b' }}>
            Distribusi perbandingan alokasi disetujui vs dana dicairkan kasir
          </p>

          {/* 3 Rows */}
          {MATRIKS_KATEGORI.map((m) => (
            <div key={m.id} className="yys-matriks-row">
              <div className="yys-matriks-header">
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: m.color, marginRight: 5 }}>●</span> {m.nama}
                </span>
                <div className="yys-matriks-stats">
                  <span style={{ fontWeight: 700, color: '#7a0c16' }}>{formatRupiah(m.cair)}</span>
                  <span style={{ color: '#64748b' }}>/ {formatRupiah(m.pagu)}</span>
                  <strong style={{ color: '#0f172a', minWidth: 42, textAlign: 'right' }}>{m.pct}%</strong>
                </div>
              </div>

              <div className="yys-matriks-bar">
                <div
                  className="yys-matriks-fill"
                  style={{
                    width: `${m.pct}%`,
                    background: m.color,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Bottom 3 Summary statistics */}
          <div className="yys-matriks-bottom-info">
            <div className="yys-matriks-info-box">
              <div className="yys-matriks-info-label">Alokasi Utama</div>
              <div className="yys-matriks-info-val">Pendidikan (57.0%)</div>
            </div>
            <div className="yys-matriks-info-box">
              <div className="yys-matriks-info-label">Laju Tercepat</div>
              <div className="yys-matriks-info-val">Lab CBT Komputer</div>
            </div>
            <div className="yys-matriks-info-box">
              <div className="yys-matriks-info-label">Sisa Cadangan Kas</div>
              <div className="yys-matriks-info-val" style={{ color: '#1e40af' }}>{formatRupiah(MONITORING_SUMMARY.sisaSaldo)}</div>
            </div>
          </div>
        </div>

        {/* Right: Pangsa Pencairan Donut Chart */}
        <div className="yys-donut-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              Pangsa Pencairan
            </h3>
            <span className="yys-pill-badge blue" style={{ fontSize: '0.68rem' }}>
              Audit BSI
            </span>
          </div>

          {/* Donut Graphic */}
          <div className="yys-donut-container">
            <svg viewBox="0 0 100 100" className="yys-donut-svg">
              {/* Background circle */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
              {/* Arc 1: Pendidikan & Dev (60%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#7a0c16"
                strokeWidth="14"
                strokeDasharray="143.25 238.76"
                strokeDashoffset="60"
              />
              {/* Arc 2: Sekretariat & BSDM (26.7%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#475569"
                strokeWidth="14"
                strokeDasharray="63.74 238.76"
                strokeDashoffset="-83.25"
              />
              {/* Arc 3: Sosial & Dakwah (13.3%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="14"
                strokeDasharray="31.75 238.76"
                strokeDashoffset="-147"
              />
            </svg>

            <div className="yys-donut-center-text">
              <span className="yys-donut-center-pct">69.5%</span>
              <span className="yys-donut-center-sub">TERCAIRKAN</span>
            </div>
          </div>

          {/* Legend List */}
          <div className="yys-donut-legend">
            <div className="yys-donut-legend-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7a0c16' }} />
                <span>Pendidikan &amp; Dev</span>
              </span>
              <strong>60.0%</strong>
            </div>

            <div className="yys-donut-legend-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#475569' }} />
                <span>Sekretariat &amp; BSDM</span>
              </span>
              <strong>26.7%</strong>
            </div>

            <div className="yys-donut-legend-item">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e3a8a' }} />
                <span>Sosial &amp; Dakwah</span>
              </span>
              <strong>13.3%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Rincian Kegiatan & Realisasi Pencairan Kasir */}
      <div className="yys-table-card">
        <div className="yys-table-head-area" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="yys-table-title-wrap">
            <div className="yys-table-icon">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="yys-table-title">Rincian Kegiatan & Realisasi Pencairan Kasir</h3>
              <p className="yys-table-sub">
                Klik pada baris data untuk memeriksa drawer audit aktivitas, rincian termin, dan kontak penanggung jawab.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ position: 'relative', width: 230 }}>
              <Search size={14} style={{ position: 'absolute', left: 9, top: 9, color: '#94a3b8' }} />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari unit atau kegiatan..."
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem 0.4rem 1.9rem',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.75rem',
                }}
              />
            </div>
            <span className="yys-pill-badge blue" style={{ whiteSpace: 'nowrap' }}>
              6 Kegiatan Terdata
            </span>
          </div>
        </div>

        {/* 9 Columns Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="yys-table">
            <thead>
              <tr>
                <th>UNIT / PRODI</th>
                <th>NAMA KEGIATAN</th>
                <th>KATEGORI YAYASAN</th>
                <th>ANGGARAN DISETUJUI</th>
                <th>DICAIRKAN KASIR</th>
                <th>SISA SALDO</th>
                <th>PERSENTASE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredKegiatan.map((k) => (
                <tr key={k.id}>
                  {/* Unit / Prodi */}
                  <td>
                    <strong style={{ fontSize: '0.78rem', color: '#0f172a', display: 'block' }}>{k.unit}</strong>
                    <span className="yys-row-ref">Kode Akun: {k.kodeAkun}</span>
                  </td>

                  {/* Nama Kegiatan */}
                  <td style={{ maxWidth: 260 }}>
                    <span className="yys-row-prog">{k.kegiatan}</span>
                    <span className="yys-row-ref" style={{ color: '#2563eb' }}>No. SPP: {k.noSpp}</span>
                  </td>

                  {/* Kategori Yayasan */}
                  <td>
                    <span
                      className="yys-pill-badge"
                      style={{
                        background:
                          k.kategoriTone === 'red'
                            ? '#fee2e2'
                            : k.kategoriTone === 'purple'
                              ? '#ede9fe'
                              : '#dbeafe',
                        color:
                          k.kategoriTone === 'red'
                            ? '#991b1b'
                            : k.kategoriTone === 'purple'
                              ? '#6b21a8'
                              : '#1e40af',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {k.kategori}
                    </span>
                  </td>

                  {/* Anggaran Disetujui */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <strong>{formatRupiah(k.disetujui)}</strong>
                  </td>

                  {/* Dicairkan Kasir */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <strong style={{ color: '#7a0c16' }}>{formatRupiah(k.dicairkan)}</strong>
                  </td>

                  {/* Sisa Saldo */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <strong style={{ color: '#1e40af' }}>{formatRupiah(k.sisa)}</strong>
                  </td>

                  {/* Persentase */}
                  <td style={{ minWidth: 110, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${k.pct}%`,
                            height: '100%',
                            background: k.pct > 70 ? '#7a0c16' : '#1e3a8a',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>
                        {k.pct}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="yys-pill-badge blue">
                      {k.status}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="yys-btn-more"
                      title="Lihat Detail SPP"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Total Konsolidasi Row */}
              <tr className="yys-table-konsolidasi-row">
                <td colSpan={3}>
                  <strong style={{ fontSize: '0.82rem' }}>TOTAL KONSOLIDASI YAYASAN</strong>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <strong>{formatRupiah(MONITORING_SUMMARY.totalAnggaran)}</strong>
                </td>
                <td style={{ whiteSpace: 'nowrap', color: '#7a0c16' }}>
                  <strong>{formatRupiah(MONITORING_SUMMARY.totalDicairkan)}</strong>
                </td>
                <td style={{ whiteSpace: 'nowrap', color: '#1e40af' }}>
                  <strong>{formatRupiah(MONITORING_SUMMARY.sisaSaldo)}</strong>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <strong style={{ color: '#7a0c16' }}>{MONITORING_SUMMARY.rasioTerserap}%</strong>
                </td>
                <td colSpan={2} style={{ textAlign: 'right', fontSize: '0.71rem', color: '#64748b' }}>
                  Rekapitulasi Otomatis Kasir
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="yys-footer-bar">
        <span>© 2025 Yayasan Pendidikan Adzkia • Universitas Adzkia Padang. Hak Cipta Dilindungi.</span>
        <div className="yys-footer-right">
          <span className="yys-footer-badge">
            <Shield size={14} color="#64748b" /> Audit Trail Keuangan Terverifikasi
          </span>
          <span>v2.4.0-ERP</span>
        </div>
      </footer>
    </div>
  );
}
