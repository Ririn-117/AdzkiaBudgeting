import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Check,
  Search,
  RotateCcw,
  Lock,
  PenTool,
  Clock,
  ShieldCheck,
  CreditCard,
  ClipboardList,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { useYayasan } from '../../context/YayasanContext';
import { useToast } from '../../components/ui/Toast';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE } from '../../data/yayasanData';

export default function YayasanMenunggu() {
  const { pending, approveRequest } = useYayasan();
  const toast = useToast();
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedNominal, setSelectedNominal] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter
  const filtered = pending.filter((item) => {
    const matchQ =
      !q ||
      item.id.toLowerCase().includes(q.toLowerCase()) ||
      item.program.toLowerCase().includes(q.toLowerCase()) ||
      item.unit.toLowerCase().includes(q.toLowerCase()) ||
      (item.skWr2 && item.skWr2.toLowerCase().includes(q.toLowerCase()));

    const matchCat = !selectedCategory || item.kategoriPilar === selectedCategory;
    const matchUnit = !selectedUnit || item.unit === selectedUnit;
    let matchNom = true;
    if (selectedNominal === 'lt30') matchNom = item.nilaiDiminta < 30000000;
    else if (selectedNominal === '30to50') matchNom = item.nilaiDiminta >= 30000000 && item.nilaiDiminta <= 50000000;
    else if (selectedNominal === 'gt50') matchNom = item.nilaiDiminta > 50000000;

    return matchQ && matchCat && matchUnit && matchNom;
  });

  const handleReset = () => {
    setQ('');
    setSelectedCategory('');
    setSelectedUnit('');
    setSelectedNominal('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExportXls = () => {
    downloadCsv('Antrean_Pencairan_Yayasan.csv', [
      ['No. Permintaan', 'RSK', 'Unit & Fakultas', 'Nama Kegiatan', 'Kategori', 'No. SK WR II', 'Plafon Disetujui', 'Nominal Diminta', 'Pencairan Lalu', 'Sisa Anggaran', 'Tgl. Pengajuan', 'Status'],
      ...filtered.map((p) => [
        p.id,
        p.rsk || '',
        `${p.unit} - ${p.faculty}`,
        p.program,
        p.kategoriPilar,
        p.skWr2 || '',
        p.paguDisetujui || p.nilaiDiminta,
        p.nilaiDiminta,
        p.pencairanLalu || 0,
        p.sisaPagu || 0,
        `${p.date} ${p.time || ''}`,
        p.status || 'Menunggu Otorisasi',
      ]),
    ]);
    toast.push('Rekap XLS antrean pencairan berhasil diunduh.');
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => approveRequest(id, 'Disetujui secara kolektif oleh Ketua Yayasan.'));
    toast.push(`${selectedIds.length} permohonan berhasil disetujui kolektif.`);
    setSelectedIds([]);
  };

  // Totals
  const totalPlafon = filtered.reduce((acc, curr) => acc + (curr.paguDisetujui || curr.nilaiDiminta), 0);
  const totalDiminta = filtered.reduce((acc, curr) => acc + curr.nilaiDiminta, 0);
  const totalLalu = filtered.reduce((acc, curr) => acc + (curr.pencairanLalu || 0), 0);
  const totalSisa = filtered.reduce((acc, curr) => acc + (curr.sisaPagu || 0), 0);

  return (
    <div className="yys-page">
      {/* Header & Breadcrumb */}
      <div className="yys-header-area">
        <div className="yys-breadcrumb">
          <span>Persetujuan Pencairan</span>
          <span>&gt;</span>
          <span>Menunggu Persetujuan Yayasan</span>
          <span>&gt;</span>
          <span className="yys-pill-badge red" style={{ background: '#b91c1c', color: '#fff', fontSize: '0.7rem' }}>
            {pending.length} Menunggu Otorisasi
          </span>
        </div>
        <div className="yys-header-row">
          <h1 className="yys-title">Permintaan Pencairan Dana Menunggu Persetujuan Yayasan</h1>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button type="button" className="u-btn u-btn-soft" onClick={handleExportXls}>
              <FileSpreadsheet size={15} /> Unduh Rekap XLS
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              disabled={selectedIds.length === 0}
              onClick={handleBatchApprove}
              style={{
                opacity: selectedIds.length === 0 ? 0.8 : 1,
                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <Check size={15} /> Setujui Kolektif Terpilih ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="yys-kpi-grid cols-4">
        {/* Card 1: Berkas Menunggu */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">BERKAS MENUNGGU KEPUTUSAN</span>
            <div className="yys-kpi-icon-wrap pink">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span className="num-large">{pending.length}</span>
            <span className="unit-text">Permohonan</span>
          </div>
          <div className="yys-kpi-sub">
            <span style={{ color: '#b91c1c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              <AlertCircle size={13} /> 1 Perlu Atensi Mendesak
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Maks. SLA: 48 Jam</span>
          </div>
        </div>

        {/* Card 2: Total Nominal */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TOTAL NOMINAL PERMOHONAN</span>
            <div className="yys-kpi-icon-wrap sky">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span>Rp 127.50</span>
          </div>
          <div className="yys-kpi-sub">
            <span>Alokasi Plafon: <b>5.27%</b></span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Dari Alokasi Kas Bulan Ini</span>
          </div>
        </div>

        {/* Card 3: Rata-rata Waktu */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">RATA-RATA WAKTU ANTREAN</span>
            <div className="yys-kpi-icon-wrap blue">
              <Clock size={18} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span className="num-large">1.2</span>
            <span className="unit-text">Hari Kerja</span>
          </div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge green" style={{ fontSize: '0.67rem' }}>
              ⚡ 35% Lebih Cepat
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Target: &lt; 2 Hari</span>
          </div>
        </div>

        {/* Card 4: Integritas Dokumen BKPU */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">INTEGRITAS DOKUMEN BKPU</span>
            <div className="yys-kpi-icon-wrap blue">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span className="num-large">100%</span>
            <span className="unit-text" style={{ color: '#2563eb', fontWeight: 600 }}>SK Valid</span>
          </div>
          <div className="yys-kpi-sub">
            <span>Semua lampiran LPJ & RAB</span>
            <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Terverifikasi Digital</span>
          </div>
        </div>
      </div>

      {/* Filter Box & Parameter Aktif */}
      <div className="yys-table-card">
        <div className="yys-filter-box">
          <div className="yys-filter-search">
            <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nomor permohonan, nama kegiatan, kode unit, atau SK WR II..."
            />
          </div>

          <select
            className="yys-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Semua Kategori Yayasan</option>
            <option value="Pendidikan & Pengemb.">Pendidikan & Pengemb.</option>
            <option value="Sosial & Pengabdian">Sosial & Pengabdian</option>
          </select>

          <select
            className="yys-filter-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="">Semua Unit / Fakultas</option>
            <option value="Prodi S1 PGMI">Prodi S1 PGMI</option>
            <option value="Prodi S1 Teknik Informatika">Prodi S1 Teknik Informatika</option>
            <option value="LPPM Universitas Adzkia">LPPM Universitas Adzkia</option>
            <option value="Biro Kemahasiswaan & Alumni">Biro Kemahasiswaan & Alumni</option>
          </select>

          <select
            className="yys-filter-select"
            value={selectedNominal}
            onChange={(e) => setSelectedNominal(e.target.value)}
          >
            <option value="">Semua Rentang Nominal</option>
            <option value="lt30">&lt; Rp 30 Juta</option>
            <option value="30to50">Rp 30 - 50 Juta</option>
            <option value="gt50">&gt; Rp 50 Juta</option>
          </select>

          <button type="button" className="u-btn u-btn-soft" onClick={handleReset}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Parameter Aktif Bar */}
        <div className="yys-param-active-bar">
          <strong style={{ color: '#475569', fontSize: '0.72rem' }}>PARAMETER AKTIF:</strong>
          <span className="yys-param-chip">Tahun Anggaran: 2024/2025 Genap</span>
          <span className="yys-param-chip" style={{ background: '#dbeafe', color: '#1e40af' }}>
            Status: Menunggu Otorisasi Yayasan
          </span>
          <span className="yys-param-chip">Tampil: {filtered.length} Pengajuan</span>
        </div>

        {/* Sub-Header Bar */}
        <div className="yys-sub-header-bar">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filtered.length > 0 && selectedIds.length === filtered.length}
              onChange={handleSelectAll}
            />
            <span>Daftar Pengajuan Pencairan Dana</span>
            <span className="yys-pill-badge blue" style={{ fontSize: '0.67rem', fontWeight: 500 }}>
              Otorisasi Bank Mandiri / BSI Yayasan
            </span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem' }}>
            <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706' }} />
              Menunggu Persetujuan
            </span>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lock size={12} /> SK WR II Terkunci
            </span>
          </div>
        </div>

        {/* 12-Column Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="yys-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}></th>
                <th>NO. PERMINTAAN</th>
                <th>UNIT & FAKULTAS</th>
                <th>NAMA KEGIATAN & KEPERLUAN</th>
                <th>KATEGORI YAYASAN</th>
                <th>NO. SK WR II</th>
                <th>AKSI OTORISASI</th>
                <th>PLAFON DISETUJUI</th>
                <th>NOMINAL DIMINTA</th>
                <th>PENCAIRAN LALU</th>
                <th>SISA ANGGARAN</th>
                <th>TGL. PENGAJUAN</th>
                <th>STATUS BERKAS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr key={p.id} style={{ background: isSelected ? '#fef2f2' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(p.id)}
                      />
                    </td>
                    <td>
                      <span className="yys-row-id">{p.id}</span>
                      <span className="yys-row-ref">{p.rsk}</span>
                    </td>
                    <td>
                      <span className="yys-row-unit">{p.unit}</span>
                      <span className="yys-row-ref">{p.faculty}</span>
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      <span className="yys-row-prog">{p.program}</span>
                      <span className="yys-row-ref">{p.keperluan}</span>
                    </td>
                    <td>
                      <span
                        className="yys-pill-badge"
                        style={{
                          background: p.kategoriPilar === 'Sosial & Pengabdian' ? '#dcfce7' : '#dbeafe',
                          color: p.kategoriPilar === 'Sosial & Pengabdian' ? '#15803d' : '#1e40af',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.kategoriPilar}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.74rem', color: '#334155', display: 'block' }}>{p.skWr2}</strong>
                      <span className="yys-row-ref">{p.ref}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                        <Link
                          to={`${BASE}/menunggu/${p.id}`}
                          className="yys-btn-action"
                        >
                          <PenTool size={13} /> Tinjau
                        </Link>
                        <button
                          type="button"
                          className="yys-btn-more"
                          title="Opsi Lanjutan"
                          onClick={() => navigate(`${BASE}/menunggu/${p.id}`)}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#475569', fontWeight: 600 }}>
                        {new Intl.NumberFormat('id-ID').format(p.paguDisetujui || p.nilaiDiminta)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#7a0c16' }}>{formatRupiah(p.nilaiDiminta)}</strong>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: '#64748b' }}>
                      {p.pencairanLaluLabel || 'Rp 0 (Baru)'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {p.sisaPagu > 0 ? (
                        <div>
                          <strong style={{ color: '#1d4ed8' }}>{formatRupiah(p.sisaPagu)}</strong>
                          <span style={{ display: 'block', fontSize: '0.67rem', color: '#64748b' }}>
                            {p.sisaSubtext || 'Termin 2'}
                          </span>
                        </div>
                      ) : (
                        <strong style={{ color: '#15803d' }}>Rp 0</strong>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.73rem', fontWeight: 600, color: '#334155' }}>{p.date}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{p.time}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="yys-pill-badge cream">
                        ● {p.status || 'Menunggu Otorisasi'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Total Footer Row */}
              <tr className="yys-table-total-row">
                <td></td>
                <td colSpan={5}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800 }}>Σ TOTAL KESELURUHAN ANTREAN PENCAIRAN AKTIF</span>
                    <span className="yys-pill-badge blue" style={{ fontSize: '0.68rem' }}>
                      {filtered.length} Berkas
                    </span>
                  </div>
                </td>
                <td></td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <strong>{formatRupiah(totalPlafon)}</strong>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: '#7a0c16' }}>
                  <strong>{formatRupiah(totalDiminta)}</strong>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: '#64748b' }}>
                  <strong>Rp 0</strong>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: '#1d4ed8' }}>
                  <strong>{formatRupiah(totalSisa)}</strong>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination & Status Footer */}
        <div className="yys-table-foot-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>Menampilkan 1 - {filtered.length} dari {filtered.length} permohonan aktif</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2563eb' }}>
              <RefreshCw size={13} /> Sinkronisasi Buku Kas Otomatis
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button type="button" className="u-btn u-btn-sm u-btn-soft" disabled>
              Sebelumnya
            </button>
            <span
              style={{
                width: 26,
                height: 26,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#7a0c16',
                color: '#fff',
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              1
            </span>
            <button type="button" className="u-btn u-btn-sm u-btn-soft" disabled>
              Selanjutnya
            </button>
          </div>
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
