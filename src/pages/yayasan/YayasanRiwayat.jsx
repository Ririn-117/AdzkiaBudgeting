import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Sliders,
  XCircle,
  Printer,
  FileSpreadsheet,
  Search,
  RotateCcw,
  Eye,
  Check,
  Shield,
  Clock,
  Download,
  Lock,
  X,
  FileCheck,
  Building,
  User,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import {
  RIWAYAT_KPI,
  RIWAYAT_LIST,
  YAYASAN,
} from '../../data/yayasanData';

export default function YayasanRiwayat() {
  const toast = useToast();

  // Search & filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [tahunFilter, setTahunFilter] = useState('Sepanjang 2025');
  const [nominalFilter, setNominalFilter] = useState('Semua');

  // Active filter tags
  const [activeTags, setActiveTags] = useState([
    { id: 'tag-1', label: 'Otorisator: Prof. Dr. Irwan P.' },
    { id: 'tag-2', label: 'Tahun Buku: 2024/2025 Genap' },
  ]);

  // Selected item for modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const removeTag = (tagId) => {
    setActiveTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const resetAllFilters = () => {
    setSearch('');
    setStatusFilter('Semua');
    setKategoriFilter('Semua');
    setTahunFilter('Sepanjang 2025');
    setNominalFilter('Semua');
    setActiveTags([]);
    toast.push('Semua filter riwayat keputusan berhasil direset.', 'info');
  };

  const handleExportAudit = () => {
    toast.push('Mengunduh Arsip Audit Trail Rekapitulasi (XLS/CSV)...');
  };

  const handleCetakRegister = () => {
    toast.push('Mempersiapkan Buku Register Otorisasi Yayasan untuk dicetak...');
  };

  // Filtered rows
  const filteredList = RIWAYAT_LIST.filter((row) => {
    const matchSearch =
      search === '' ||
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.ref.toLowerCase().includes(search.toLowerCase()) ||
      row.program.toLowerCase().includes(search.toLowerCase()) ||
      row.unit.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'Semua' || row.keputusan.includes(statusFilter);

    const matchKategori =
      kategoriFilter === 'Semua' || row.kategori.includes(kategoriFilter);

    return matchSearch && matchStatus && matchKategori;
  });

  return (
    <div className="yys-page">
      {/* 4 KPI Metric Cards */}
      <div className="yys-kpi-grid cols-4">
        {/* Card 1: Total Keputusan 2025 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TOTAL KEPUTUSAN 2025</span>
            <div className="yys-kpi-icon-wrap blue">
              <FileCheck size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>{RIWAYAT_KPI.totalKeputusan}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b', marginLeft: 4 }}>
              Berkas Selesai
            </span>
          </div>
          <div className="yys-kpi-sub">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#15803d' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              Akumulasi: {formatRupiah(RIWAYAT_KPI.totalNominal)}
            </span>
          </div>
        </div>

        {/* Card 2: Disetujui Penuh */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">DISETUJUI PENUH</span>
            <div className="yys-kpi-icon-wrap green">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="yys-kpi-value" style={{ color: '#15803d' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>{RIWAYAT_KPI.disetujuiPenuh}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#15803d', marginLeft: 4 }}>
              ({RIWAYAT_KPI.disetujuiPenuhPct})
            </span>
          </div>
          <div className="yys-kpi-sub">
            <span>{formatRupiah(RIWAYAT_KPI.disetujuiPenuhNominal)} Terealisasi</span>
          </div>
        </div>

        {/* Card 3: Disetujui Bersyarat */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">DISETUJUI BERSYARAT</span>
            <div className="yys-kpi-icon-wrap amber">
              <Sliders size={17} />
            </div>
          </div>
          <div className="yys-kpi-value" style={{ color: '#b45309' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>{RIWAYAT_KPI.disetujuiBersyarat}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#b45309', marginLeft: 4 }}>
              Termin / SPK
            </span>
          </div>
          <div className="yys-kpi-sub">
            <span>Koreksi efisiensi: -{formatRupiah(RIWAYAT_KPI.disetujuiBersyaratKoreksi)}</span>
          </div>
        </div>

        {/* Card 4: Ditolak Yayasan */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">DITOLAK YAYASAN</span>
            <div className="yys-kpi-icon-wrap red">
              <XCircle size={17} />
            </div>
          </div>
          <div className="yys-kpi-value" style={{ color: '#b91c1c' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800 }}>{RIWAYAT_KPI.ditolakYayasan}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#b91c1c', marginLeft: 4 }}>
              ({RIWAYAT_KPI.ditolakYayasanPct})
            </span>
          </div>
          <div className="yys-kpi-sub">
            <span>Dialihkan ke Non-RKA / Evaluasi</span>
          </div>
        </div>
      </div>

      {/* Main Section Card */}
      <section className="yys-table-card">
        {/* Header Banner */}
        <div className="yys-table-head-area" style={{ padding: '1.25rem 1.4rem' }}>
          <div className="yys-table-title-wrap">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: '#7a0c16',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 className="yys-table-title" style={{ fontSize: '1.05rem' }}>
                  Riwayat Keputusan Pencairan Yayasan
                </h2>
                <span className="yys-pill-badge blue">Tahun Buku 2024/2025</span>
              </div>
              <p className="yys-table-sub" style={{ marginTop: '0.2rem' }}>
                Arsip otorisasi digital pencairan dana yayasan berkekuatan hukum, diverifikasi melalui Balai Sertifikasi Elektronik (BSrE) &amp; TTE Pengurus Yayasan.
              </p>
            </div>
          </div>

          <div className="yys-btn-group-header">
            <button
              type="button"
              className="yys-btn-outline"
              onClick={handleCetakRegister}
            >
              <Printer size={14} /> Cetak Buku Register
            </button>
            <button
              type="button"
              className="yys-btn-dark"
              onClick={handleExportAudit}
            >
              <Download size={14} /> Ekspor Audit (XLS/CSV)
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{ padding: '0.85rem 1.4rem', borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1.1fr 1.1fr 1.1fr 1fr',
              gap: '0.65rem',
              alignItems: 'end',
            }}
          >
            <div>
              <label className="yys-filter-label">Pencarian No. Register / Kegiatan / PIC</label>
              <div className="yys-search-wrap">
                <Search size={14} className="icon" />
                <input
                  type="text"
                  className="yys-filter-input"
                  placeholder="Cari: REG-YAY/2025, nama kegiatan, atau peng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="yys-filter-label">Status Keputusan</label>
              <select
                className="yys-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="DISETUJUI PENUH">Disetujui Penuh</option>
                <option value="DISETUJUI BERSYARAT">Disetujui Bersyarat</option>
                <option value="DITOLAK YAYASAN">Ditolak Yayasan</option>
              </select>
            </div>

            <div>
              <label className="yys-filter-label">Kategori Yayasan</label>
              <select
                className="yys-filter-select"
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Pendidikan">Pendidikan &amp; Dev</option>
                <option value="BSDM">Sekretariat / BSDM</option>
                <option value="Sosial">Sosial &amp; Kemasyarakatan</option>
              </select>
            </div>

            <div>
              <label className="yys-filter-label">Tahun/Periode</label>
              <select
                className="yys-filter-select"
                value={tahunFilter}
                onChange={(e) => setTahunFilter(e.target.value)}
              >
                <option>Sepanjang 2025</option>
                <option>Semester Genap 2024/2025</option>
                <option>Semester Ganjil 2024/2025</option>
              </select>
            </div>

            <div>
              <label className="yys-filter-label">Rentang Nominal</label>
              <select
                className="yys-filter-select"
                value={nominalFilter}
                onChange={(e) => setNominalFilter(e.target.value)}
              >
                <option value="Semua">Semua Nominal</option>
                <option value="high">&gt; Rp 100.000.000</option>
                <option value="low">&lt; Rp 100.000.000</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          <div className="yys-active-filters-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>Filter aktif:</span>
              {activeTags.map((tag) => (
                <span key={tag.id} className="yys-filter-tag">
                  {tag.label}
                  <span className="close-btn" onClick={() => removeTag(tag.id)}>
                    ×
                  </span>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#b91c1c',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Reset Semua Filter
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div style={{ overflowX: 'auto' }}>
          <table className="yys-table yys-riwayat-table">
            <thead>
              <tr>
                <th>NO. REGISTER YAYASAN / PERMINTAAN</th>
                <th>UNIT &amp; PENANGGUNG JAWAB</th>
                <th>NAMA PROGRAM / KEGIATAN</th>
                <th>KATEGORI</th>
                <th>NOMINAL DIAJUKAN -&gt; DISETUJUI</th>
                <th>HASIL KEPUTUSAN</th>
                <th>TANGGAL PUTUSAN</th>
                <th>OTORISATOR &amp; DIGITAL TTE</th>
                <th style={{ textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((row) => (
                <tr key={row.id}>
                  {/* Col 1 */}
                  <td>
                    <strong style={{ color: '#7a0c16', fontSize: '0.81rem', display: 'block' }}>
                      {row.id}
                    </strong>
                    <span style={{ color: '#64748b', fontSize: '0.71rem', display: 'block' }}>
                      {row.ref}
                    </span>
                    <span
                      className={`yys-pill-badge ${row.statusBadgeTone}`}
                      style={{ marginTop: 3, fontSize: '0.66rem' }}
                    >
                      {row.statusBadge}
                    </span>
                  </td>

                  {/* Col 2 */}
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.81rem', display: 'block' }}>
                      {row.unit}
                    </strong>
                    <span style={{ color: '#475569', fontSize: '0.71rem', display: 'block' }}>
                      {row.pic}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                      {row.picTitle}
                    </span>
                  </td>

                  {/* Col 3 */}
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.8rem', display: 'block', maxWidth: 210 }}>
                      {row.program}
                    </strong>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                      {row.kodeRek}
                    </span>
                  </td>

                  {/* Col 4 */}
                  <td>
                    <span className="yys-pill-badge blue" style={{ whiteSpace: 'nowrap' }}>
                      {row.kategori}
                    </span>
                  </td>

                  {/* Col 5 */}
                  <td>
                    <span style={{ color: '#64748b', textDecoration: 'line-through', fontSize: '0.72rem', display: 'block' }}>
                      — {formatRupiah(row.nominalDiajukan)}
                    </span>
                    <strong
                      style={{
                        fontSize: '0.85rem',
                        color: row.nominalDisetujui === 0 ? '#b91c1c' : '#0f172a',
                        display: 'block',
                      }}
                    >
                      {formatRupiah(row.nominalDisetujui)}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color:
                          row.persetujuanKetTone === 'green'
                            ? '#15803d'
                            : row.persetujuanKetTone === 'amber'
                            ? '#b45309'
                            : '#b91c1c',
                        fontWeight: 600,
                      }}
                    >
                      {row.persetujuanKet}
                    </span>
                  </td>

                  {/* Col 6 */}
                  <td>
                    <span className={`yys-pill-badge ${row.keputusanTone}`} style={{ whiteSpace: 'nowrap' }}>
                      {row.keputusanTone === 'green' && <Check size={11} />}
                      {row.keputusanTone === 'red' && <X size={11} />}
                      {row.keputusan}
                    </span>
                  </td>

                  {/* Col 7 */}
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.79rem', display: 'block' }}>
                      {row.tglPutusan}
                    </strong>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                      {row.jamPutusan}
                    </span>
                  </td>

                  {/* Col 8 */}
                  <td>
                    <div className="yys-user-cell">
                      <div className="avatar-mini">
                        <User size={14} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>
                          {row.otorisator}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.69rem',
                            color: row.tteValid ? '#15803d' : '#64748b',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          {row.tteValid && <Check size={11} />} {row.tteText}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Col 9 */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="yys-btn-outline"
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                      onClick={() => setSelectedItem(row)}
                      title="Lihat Lembar Putusan Otorisator"
                    >
                      <Eye size={15} color="#1e40af" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Row */}
        <div className="yys-pagination-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>Menampilkan 1 - 5 dari 128 riwayat keputusan</span>
            <select
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: 5,
                fontSize: '0.72rem',
                padding: '0.2rem 0.4rem',
                color: '#334155',
              }}
            >
              <option>5 per halaman</option>
              <option>10 per halaman</option>
              <option>25 per halaman</option>
            </select>
          </div>

          <div className="yys-pagination-btns">
            <button type="button" className="yys-page-btn">
              &lt;
            </button>
            <button type="button" className="yys-page-btn active">
              1
            </button>
            <button type="button" className="yys-page-btn">
              2
            </button>
            <button type="button" className="yys-page-btn">
              3
            </button>
            <span style={{ padding: '0 0.2rem' }}>...</span>
            <button type="button" className="yys-page-btn">
              26
            </button>
            <button type="button" className="yys-page-btn">
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="yys-footer-bar">
        <span>© 2025 Yayasan Pendidikan Adzkia • Universitas Adzkia Padang. Hak Cipta Dilindungi.</span>
        <div className="yys-footer-right">
          <span className="yys-footer-badge">
            <Shield size={14} color="#15803d" /> Audit Trail Keuangan Terverifikasi
          </span>
          <span>v2.4.0-ERP</span>
        </div>
      </footer>

      {/* Lembar Detail Putusan Otorisator Modal */}
      {selectedItem && (
        <Modal
          open={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: '#7a0c16',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{selectedItem.id}</strong>
                  <span className={`yys-pill-badge ${selectedItem.keputusanTone}`}>
                    {selectedItem.keputusan}
                  </span>
                </div>
                <div style={{ fontSize: '0.71rem', color: '#64748b', marginTop: 1 }}>
                  Ref. Permintaan Asal: {selectedItem.ref} • Tgl Masuk: {selectedItem.tglMasuk}
                </div>
              </div>
            </div>
          }
          footer={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '0.73rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={13} /> Dokumen Read-Only (Telah Terkunci di Buku Besar Yayasan)
              </span>
              <button
                type="button"
                className="yys-btn-outline"
                style={{ background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe', fontWeight: 700 }}
                onClick={() => setSelectedItem(null)}
              >
                Tutup Jendela
              </button>
            </div>
          }
        >
          <div className="yys-putusan-modal">
            {/* 1. Ringkasan Putusan Otorisator Card */}
            <div className="yys-putusan-ringkasan-card">
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.69rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', marginBottom: 2 }}>
                  RINGKASAN PUTUSAN OTORISATOR
                </span>
                <span style={{ fontSize: '0.73rem', color: '#64748b', display: 'block' }}>Nominal Diajukan</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'line-through', fontWeight: 600 }}>
                  {formatRupiah(selectedItem.nominalDiajukan)}
                </span>

                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Kegiatan</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                    {selectedItem.programFull || selectedItem.program}
                  </strong>
                </div>

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Unit Pemohon</span>
                    <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>{selectedItem.unit}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Kategori Yayasan</span>
                    <strong style={{ fontSize: '0.78rem', color: '#1e40af' }}>{selectedItem.kategoriLengkap}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '0.73rem', color: '#15803d', fontWeight: 600, display: 'block' }}>
                  Nominal Disetujui Otorisator
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857' }}>
                  {formatRupiah(selectedItem.nominalDisetujui)}
                </div>
              </div>
            </div>

            {/* 2. Catatan Resmi Otorisator */}
            <div className="yys-putusan-catatan-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#7a0c16' }}>
                <FileText size={15} />
                <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  CATATAN RESMI OTORISATOR
                </strong>
              </div>
              <p className="yys-putusan-quote">"{selectedItem.catatanResmi}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.71rem', color: '#78350f', borderTop: '1px dashed #fde68a', paddingTop: '0.45rem' }}>
                <span>Diputuskan pada: <strong>{selectedItem.waktuLengkap}</strong></span>
                <span>IP: <strong>{selectedItem.ipAuth}</strong></span>
              </div>
            </div>

            {/* 3. Validasi Sertifikasi Otorisator Digital (BSrE) */}
            <div className="yys-putusan-bsre-card">
              <span style={{ fontSize: '0.69rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700, display: 'block' }}>
                VALIDASI SERTIFIKASI OTORISATOR DIGITAL (BSRE)
              </span>

              <div className="yys-bsre-grid">
                {/* QR Code */}
                <div className="yys-bsre-qr">
                  <svg width="78" height="78" viewBox="0 0 100 100" style={{ background: '#ffffff', border: '2px solid #7a0c16', padding: 3, borderRadius: 6 }}>
                    <rect x="10" y="10" width="25" height="25" fill="#7a0c16" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#7a0c16" />
                    <rect x="65" y="10" width="25" height="25" fill="#7a0c16" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#7a0c16" />
                    <rect x="10" y="65" width="25" height="25" fill="#7a0c16" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#7a0c16" />
                    <rect x="42" y="15" width="8" height="8" fill="#7a0c16" />
                    <rect x="42" y="42" width="16" height="16" fill="#7a0c16" />
                    <rect x="65" y="65" width="10" height="10" fill="#7a0c16" />
                    <rect x="78" y="78" width="12" height="12" fill="#7a0c16" />
                  </svg>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#64748b' }}>
                    UUID: {selectedItem.uuidBsre}
                  </span>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                    {YAYASAN.name}
                  </strong>
                  <span style={{ fontSize: '0.73rem', color: '#b91c1c', display: 'block', marginBottom: 4 }}>
                    {YAYASAN.role}
                  </span>

                  <div className="yys-bsre-hash-box">
                    SHA256: {selectedItem.sha256}
                  </div>

                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={13} /> Sertifikat Digital Sah &amp; Valid
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Kronologi Riwayat Perjalanan Berkas */}
            <div className="yys-putusan-timeline-card">
              <span style={{ fontSize: '0.69rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700, display: 'block' }}>
                KRONOLOGI RIWAYAT PERJALANAN BERKAS
              </span>

              <div className="yys-kronologi-list">
                {selectedItem.timeline.map((step, idx) => (
                  <div key={step.step} className="yys-kronologi-item">
                    <div className={`yys-kronologi-dot ${step.tone}`}>
                      <Check size={12} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>{step.step}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{step.time}</span>
                      </div>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.73rem', color: '#475569' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Tautan Arsip SK & Dokumen Keuangan */}
            <div className="yys-putusan-arsip-card">
              <span style={{ fontSize: '0.69rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 700, display: 'block' }}>
                TAUTAN ARSIP SK &amp; DOKUMEN KEUANGAN
              </span>

              {selectedItem.documents.map((doc) => (
                <div key={doc.name} className="yys-arsip-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 6,
                        background: doc.type === 'pdf' ? '#fee2e2' : doc.type === 'sp2d' ? '#dcfce7' : '#eff6ff',
                        color: doc.type === 'pdf' ? '#b91c1c' : doc.type === 'sp2d' ? '#15803d' : '#1e40af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.77rem', color: '#0f172a', display: 'block' }}>
                        {doc.name}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{doc.desc}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="yys-btn-outline"
                    style={{ padding: '0.35rem 0.6rem' }}
                    onClick={() => toast.push(`Mengunduh berkas ${doc.name}...`)}
                    title="Unduh Berkas"
                  >
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
