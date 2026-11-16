import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, Check, CheckCircle2, CloudUpload, Download, FileSpreadsheet, Info, Landmark,
  ListOrdered, Banknote, RefreshCw, Trash2, UserSquare, XCircle, Lightbulb,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv, formatBytes } from '../../utils/csv';
import { BASE, IMPORT_COLUMNS, IMPORT_ROWS } from '../../data/unitData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../components/ui/Toast';

const PAGE_SIZE = 5;
const MAX_FILE = 10 * 1024 * 1024;
const STEPS = ['Unduh', 'Upload', 'Validasi', 'Selesai'];

const levelOf = (r) => r.level ?? 'valid';
const subtotal = (r) => (levelOf(r) === 'valid' ? r.qty * r.price : 0);
const num = (n) => new Intl.NumberFormat('id-ID').format(n);

export default function PengajuanImport() {
  const toast = useToast();
  const fileRef = useRef(null);

  const [phase, setPhase] = useState('idle'); // idle | parsing | parsed | done
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const [dragging, setDragging] = useState(false);

  const stats = useMemo(() => {
    const valid = IMPORT_ROWS.filter((r) => levelOf(r) === 'valid');
    return {
      total: IMPORT_ROWS.length,
      valid: valid.length,
      issues: IMPORT_ROWS.length - valid.length,
      errors: IMPORT_ROWS.filter((r) => r.level === 'error').length,
      warnings: IMPORT_ROWS.filter((r) => r.level === 'warning').length,
      sum: valid.reduce((a, r) => a + r.qty * r.price, 0),
    };
  }, []);

  const rows = IMPORT_ROWS.filter((r) => tab === 'all' || (tab === 'issue' ? levelOf(r) !== 'valid' : levelOf(r) === 'valid'));
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const view = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const step = phase === 'done' ? 4 : phase === 'parsed' ? 3 : 2;

  const handleFile = (f) => {
    setError('');
    if (!f) return;
    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      setError('Format berkas harus .xlsx atau .xls.');
      return;
    }
    if (f.size > MAX_FILE) {
      setError('Ukuran berkas melebihi 10 MB.');
      return;
    }
    setFile({ name: f.name, size: f.size });
    setPhase('parsing');
    setTab('all');
    setPage(1);
    // SIMULASI: isi berkas tidak dibaca. Data contoh dipakai sampai parser backend tersedia.
    setTimeout(() => setPhase('parsed'), 900);
  };

  const reset = () => {
    setPhase('idle');
    setFile(null);
    setError('');
  };

  const downloadTemplate = () => {
    downloadCsv('Template_RKAT_2024.2.csv', [
      IMPORT_COLUMNS.map(([, label]) => label),
      ['5.2.1.01', 'Honor Pemateri Pelatihan Guru', 2, 'Org', 2500000, 'Contoh: pemateri eksternal'],
    ]);
    toast.push('Template diunduh. Buka di Excel lalu simpan sebagai .xlsx sebelum diunggah.');
  };

  const confirmImport = () => {
    setPhase('done');
    toast.push(`${stats.valid} item valid diimpor (simulasi, belum tersimpan di server).`);
  };

  const pick = () => fileRef.current?.click();

  return (
    <div className="upage">
      <div className="u-ph">
        <div>
          <p className="u-eyebrow"><span>Modul RKAT Online</span> Batch Data Processor</p>
          <h1 style={{ fontSize: '1.7rem' }}>Import Rencana Anggaran dari File Excel</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 520, fontSize: '0.92rem' }}>
            Unggah berkas spreadsheet RKAT / RAB untuk mempercepat input item anggaran secara massal.
          </p>
        </div>
        <ol className="u-stepper" aria-label="Langkah import">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = n < step ? 'done' : n === step ? 'now' : '';
            return (
              <li key={label} className={state}>
                <b>{state === 'done' ? <Check size={13} /> : n}</b>
                {label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="u-note u-note-warn">
        <Info size={18} />
        <div>
          <strong>Mode simulasi</strong>
          <p>Isi berkas Excel belum dibaca oleh server. Setelah berkas dipilih, hasil validasi di bawah memakai data contoh.</p>
        </div>
      </div>

      <div className="u-grid-2" style={{ alignItems: 'stretch' }}>
        <section className="card">
          <div className="u-step-head"><h2><b>01</b> Panduan & Template Resmi</h2><span className="u-badge u-badge-sky">Wajib Dipakai</span></div>
          <div className="u-note" style={{ borderLeft: 'none', margin: '0.8rem 0' }}>
            <Info size={18} />
            <p style={{ margin: 0 }}>
              Gunakan template resmi <b>versi 2024.2</b> agar kolom terbaca dengan tepat oleh parser sistem E-Budgeting. Format di luar standar akan otomatis ditolak.
            </p>
          </div>
          <p className="u-mini-title">Pemetaan kolom spreadsheet</p>
          <div className="u-colmap">
            {IMPORT_COLUMNS.map(([c, label]) => (
              <div key={c}><b>{c}</b>{label}</div>
            ))}
          </div>
          <div className="u-template">
            <FileSpreadsheet size={26} />
            <div>
              <strong>Template_RKAT_2024.2.csv</strong>
              <span>Format standar • contoh isian</span>
            </div>
            <button type="button" className="u-btn u-btn-navy" onClick={downloadTemplate}><Download size={15} /> Unduh Template</button>
          </div>
        </section>

        <section className="card">
          <div className="u-step-head"><h2><b>02</b> Unggah Berkas Spreadsheet</h2><span className="u-hint">Maksimal 10 MB (.xlsx, .xls)</span></div>

          {!file ? (
            <div
              className={`u-drop ${dragging ? 'on' : ''}`}
              style={{ marginTop: '0.8rem' }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <CloudUpload size={34} />
              <strong>Tarik & lepaskan berkas Excel ke sini</strong>
              <span>atau <button type="button" className="u-link" onClick={pick}>pilih file dari komputer</button></span>
            </div>
          ) : (
            <>
              <div className="u-uploaded">
                <FileSpreadsheet size={30} />
                <div className="u-file-main">
                  <strong>{file.name}</strong>
                  <span>
                    {formatBytes(file.size)} • Microsoft Excel Worksheet •{' '}
                    {phase === 'parsing' ? 'Memproses...' : <><CheckCircle2 size={12} /> 100% Terunggah & Selesai Diparsing</>}
                  </span>
                </div>
                <button type="button" className="u-iconbtn" aria-label="Hapus berkas" onClick={reset}><XCircle size={18} /></button>
              </div>
              <div className="u-bar green" style={{ margin: '0.6rem 0 0.4rem' }}><i style={{ width: phase === 'parsing' ? '55%' : '100%', transition: 'width .8s' }} /></div>
              <div className="u-parse-meta"><span>Waktu pembacaan: 0.84 detik</span><b>{stats.total} baris terdeteksi</b></div>
              <div className="u-grid-2" style={{ marginTop: '0.8rem' }}>
                <div className="u-meta-box"><Landmark size={20} /><div><span>Alokasi Biaya</span><b>BOPTN Penelitian / PkM</b></div></div>
                <div className="u-meta-box"><UserSquare size={20} /><div><span>Pengunggah</span><b>Kaprodi PGMI - FTK</b></div></div>
              </div>
              <button type="button" className="u-link" style={{ marginTop: '1rem', float: 'right' }} onClick={pick}>
                <RefreshCw size={13} /> Ganti file dengan berkas lain
              </button>
            </>
          )}
          {error && <p className="u-err" role="alert" style={{ marginTop: '0.6rem' }}>{error}</p>}
          <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ''; }} />
        </section>
      </div>

      {phase === 'done' && (
        <div className="u-note u-note-success">
          <CheckCircle2 size={20} />
          <div>
            <strong>Import selesai</strong>
            <p>{stats.valid} item valid senilai {formatRupiah(stats.sum)} siap dimasukkan ke formulir pengajuan. {stats.issues} baris bermasalah diabaikan.</p>
            <Link to={`${BASE}/pengajuan/baru`} className="u-link">Lanjut ke Buat Pengajuan</Link>
          </div>
        </div>
      )}

      {(phase === 'parsed' || phase === 'done') && (
        <>
          <section>
            <div className="u-step-head" style={{ marginBottom: '0.7rem' }}>
              <h2><b>03</b> Ringkasan Validasi Parsing Sistem</h2>
              <span className="u-hint">Pemeriksaan integritas sintaks data</span>
            </div>
            <div className="u-sum-grid cols-4">
              <SummaryCard tone="slate" label="Total Baris Terbaca" icon={ListOrdered} value={`${stats.total} Baris Data`} sub="Rentang Excel baris 4 sampai 15" />
              <SummaryCard tone="green" label="Baris Siap Diimpor" icon={CheckCircle2} value={`${stats.valid} Baris Valid (${((stats.valid / stats.total) * 100).toFixed(1).replace('.', ',')}%)`} sub="Sesuai format kode akun & kalkulasi" />
              <SummaryCard tone="maroon" label="Baris Bermasalah" icon={AlertCircle} value={`${stats.issues} Perlu Tindakan`} sub={`${stats.errors} Galat Kritis • ${stats.warnings} Peringatan Nol`} />
              <SummaryCard tone="maroon" label="Total Nilai Anggaran Valid" icon={Banknote} value={formatRupiah(stats.sum)} sub={`Hanya mengakumulasi ${stats.valid} baris valid`} />
            </div>
          </section>

          <section className="card">
            <div className="u-step-head">
              <div>
                <h2><b>04</b> Preview Hasil Parsing Spreadsheet & Diagnosa</h2>
                <p className="u-hint" style={{ marginTop: '0.25rem' }}>Menampilkan item terdeteksi lengkap dengan status integritas data sebelum dieksekusi ke basis data</p>
              </div>
              <div className="u-tabs" role="tablist">
                {[['all', `Semua (${stats.total})`], ['issue', `Galat / Warning (${stats.issues})`], ['valid', `Hanya Valid (${stats.valid})`]].map(([k, label]) => (
                  <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => { setTab(k); setPage(1); }}>{label}</button>
                ))}
              </div>
            </div>

            <div className="u-scroll" style={{ marginTop: '0.8rem' }}>
              <table className="u-table" style={{ minWidth: 900 }}>
                <thead>
                  <tr><th>No. Baris</th><th>Kode Akun</th><th>Nama Item Belanja</th><th className="num">Volume</th><th>Satuan</th><th className="num">Harga Satuan</th><th className="num">Subtotal</th><th>Status Validasi</th><th>Keterangan Error / Diagnosa</th></tr>
                </thead>
                <tbody>
                  {view.map((r) => {
                    const lv = levelOf(r);
                    return (
                      <tr key={r.row} className={lv === 'error' ? 'row-err' : lv === 'warning' ? 'row-warn' : ''}>
                        <td className={lv === 'valid' ? '' : 'strong'} style={lv === 'error' ? { color: '#b4121f' } : lv === 'warning' ? { color: '#92400e' } : undefined}>Baris {r.row}</td>
                        <td>{r.code ? <span className="u-mono">{r.code}</span> : <span className="u-mono u-flag red">[KOSONG]</span>}</td>
                        <td className="u-cell-title">{r.name}</td>
                        <td className="num">{r.qty === 0 ? <span className="u-flag amber">[0]</span> : r.qty}</td>
                        <td>{r.unit}</td>
                        <td className="num">{r.price == null ? <span className="u-mono u-flag red">{r.rawPrice}</span> : formatRupiah(r.price)}</td>
                        <td className="num strong">{lv === 'valid' ? formatRupiah(subtotal(r)) : 'Rp 0'}</td>
                        <td>
                          {lv === 'valid' && <span className="u-badge u-badge-green"><CheckCircle2 size={12} /> Valid</span>}
                          {lv === 'error' && <span className="u-badge u-badge-red"><XCircle size={12} /> Error</span>}
                          {lv === 'warning' && <span className="u-badge u-badge-amber"><AlertCircle size={12} /> Warning</span>}
                        </td>
                        <td style={{ maxWidth: 280, color: lv === 'error' ? '#b4121f' : '#92400e' }}>{r.message ?? <span style={{ color: '#94a3b8' }}>-</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr><td colSpan={6} className="num">Total nilai bersih yang dapat diproses:</td><td className="num">{formatRupiah(stats.sum)}</td><td colSpan={2} style={{ fontWeight: 500 }}>Dari {stats.valid} item valid dalam berkas</td></tr>
                </tfoot>
              </table>
            </div>

            <div className="u-tfoot-bar">
              <span>Menampilkan {view.length} dari {rows.length} baris {tab === 'all' ? 'keseluruhan spreadsheet' : 'pada filter ini'}</span>
              <Pagination page={current} pageCount={pageCount} onChange={setPage} />
            </div>
          </section>

          <div className="u-note">
            <Lightbulb size={20} />
            <div>
              <strong>Pilihan Penanganan Galat Data</strong>
              <p>Sistem dapat mengabaikan <b style={{ color: '#b4121f' }}>{stats.issues} baris bermasalah</b> dan hanya mengimpor <b style={{ color: '#0b6b44' }}>{stats.valid} baris valid</b>, atau Anda dapat memperbaiki file Excel tersebut lalu mengunggah ulang tanpa kehilangan data.</p>
            </div>
          </div>

          <div className="card u-form-foot">
            <button type="button" className="u-btn u-btn-danger" onClick={() => { reset(); toast.push('Import dibatalkan dan berkas dibersihkan.'); }}><Trash2 size={15} /> Batalkan Import & Bersihkan</button>
            <div className="u-foot-actions">
              <button type="button" className="u-btn u-btn-soft" onClick={pick}><RefreshCw size={15} /> Unggah Ulang File Koreksi</button>
              <button type="button" className="u-btn u-btn-primary" onClick={confirmImport} disabled={phase === 'done' || stats.valid === 0}>
                <Download size={15} /> Konfirmasi & Lanjutkan Import ({stats.valid} Item Valid)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
