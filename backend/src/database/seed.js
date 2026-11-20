import bcrypt from 'bcryptjs';
import { getDb, runTransaction } from './db.js';
import { initSchema } from './schema.js';
import { ROLES } from '../config/constants.js';

export function seedIfEmpty({ force = false } = {}) {
  initSchema();
  const db = getDb();

  if (!force) {
    const existing = db.prepare('SELECT COUNT(*) AS cnt FROM users').get();
    if (existing.cnt > 0) return false;
  }

  runTransaction((tx) => {
    if (force) {
      const tables = [
        'password_resets',
        'audit_logs',
        'notifications',
        'excel_imports',
        'lpj_documents',
        'lpjs',
        'disbursements',
        'submission_timelines',
        'submission_documents',
        'submission_items',
        'submissions',
        'sbm_tariffs',
        'budget_categories',
        'budget_periods',
        'role_permissions',
        'user_sessions',
        'users',
        'units',
        'system_configs',
      ];
      for (const t of tables) {
        tx.exec(`DELETE FROM ${t};`);
      }
    }

    // 1. Units
    const insertUnit = tx.prepare(`
      INSERT INTO units (code, name, parent_faculty, type, head_name, bsi_account, bsi_bank_name, pagu_allocated, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const unitsData = [
      ['prodi-pgmi', 'Program Studi Pendidikan Guru Madrasah Ibtidaiyah (PGMI)', 'Fakultas Tarbiyah & Keguruan', 'Program Studi', 'Dr. Rahmat Hidayat, M.Pd', '8871092831', 'BSI Virtual Account Operasional PGMI', 450000000, 'aktif'],
      ['prodi-informatika', 'Program Studi Informatika', 'Fakultas Sains & Teknologi', 'Program Studi', 'Dr. Budi Santoso, M.Kom', '8871092832', 'BSI Virtual Account Operasional Informatika', 400000000, 'aktif'],
      ['prodi-sistem-informasi', 'Program Studi Sistem Informasi', 'Fakultas Sains & Teknologi', 'Program Studi', 'Siti Rahma, M.Kom', '8871092833', 'BSI Virtual Account Operasional SI', 350000000, 'aktif'],
      ['prodi-manajemen', 'Program Studi Manajemen', 'Fakultas Ekonomi & Bisnis', 'Program Studi', 'Hendri Pratama, M.M', '8871092834', 'BSI Virtual Account Operasional Manajemen', 380000000, 'aktif'],
      ['prodi-akuntansi', 'Program Studi Akuntansi', 'Fakultas Ekonomi & Bisnis', 'Program Studi', 'Nurul Hasanah, M.Ak', '8871092835', 'BSI Virtual Account Operasional Akuntansi', 360000000, 'aktif'],
      ['unit-bapk', 'Biro Administrasi Perencanaan & Keuangan (BAPK)', 'Rektorat', 'Biro', 'Ahmad Zaky, S.E.', '8871092840', 'BSI Virtual Account BAPK', 500000000, 'aktif'],
      ['unit-perpustakaan', 'Perpustakaan', 'Rektorat', 'Lembaga', 'Dra. Halimah', '8871092841', 'BSI Virtual Account Perpustakaan', 250000000, 'aktif'],
    ];
    for (const u of unitsData) insertUnit.run(...u);

    const pgmiUnit = tx.prepare('SELECT id FROM units WHERE code = ?').get('prodi-pgmi');
    const bapkUnit = tx.prepare('SELECT id FROM units WHERE code = ?').get('unit-bapk');

    // 2. Users (matching authService.js MOCK_USERS)
    const passwordHash = bcrypt.hashSync('password123', 10);
    const insertUser = tx.prepare(`
      INSERT INTO users (username, email, password_hash, name, nidn, rank, employment_status, phone, role, unit_id, status, twofa_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const usersData = [
      ['unit', 'unit@adzkia.ac.id', passwordHash, 'Dr. Rahmat Hidayat, M.Pd', '1024088501 / 198508242011011002', 'Pembina (IV/a) / Lektor Kepala', 'Dosen Tetap Yayasan (TMT: 01-01-2011)', '+62 812-6789-0123', ROLES.UNIT_PRODI, pgmiUnit.id, 'aktif', 1],
      ['bkpu', 'bkpu@adzkia.ac.id', passwordHash, 'Staf BKPU', '198803152015011001', 'Penata (III/c) / Verifikator Keuangan', 'Pegawai Tetap Yayasan', '+62 812-3456-7890', ROLES.BKPU, bapkUnit.id, 'aktif', 1],
      ['wr2', 'wr2@adzkia.ac.id', passwordHash, 'Wakil Rektor II', '197804122005011003', 'Pembina Utama Muda (IV/c)', 'Dosen Tetap Yayasan', '+62 811-6677-8899', ROLES.WAKIL_REKTOR_2, null, 'aktif', 1],
      ['yayasan', 'yayasan@adzkia.ac.id', passwordHash, 'Pengurus Yayasan', '197001012000011001', 'Bendahara Yayasan', 'Pengurus Yayasan Adzkia', '+62 811-2233-4455', ROLES.YAYASAN, null, 'aktif', 1],
      ['rektor', 'rektor@adzkia.ac.id', passwordHash, 'Rektor', '196905201998031002', 'Guru Besar (IV/e)', 'Rektor Universitas Adzkia', '+62 811-1122-3344', ROLES.REKTOR, null, 'aktif', 1],
      ['admin', 'admin@adzkia.ac.id', passwordHash, 'Administrator', '199007182018011005', 'Super Admin Tier 1', 'Staf Sistem Informasi (BPSI)', '+62 812-9988-7766', ROLES.ADMINISTRATOR, null, 'aktif', 1],
    ];
    for (const u of usersData) insertUser.run(...u);

    const unitUser = tx.prepare('SELECT id FROM users WHERE username = ?').get('unit');
    const bkpuUser = tx.prepare('SELECT id FROM users WHERE username = ?').get('bkpu');
    const wr2User = tx.prepare('SELECT id FROM users WHERE username = ?').get('wr2');
    const adminUser = tx.prepare('SELECT id FROM users WHERE username = ?').get('admin');

    // 3. Role Permissions Matrix
    const modules = [
      'Usulan RKAT',
      'Verifikasi Dokumen',
      'Persetujuan SK',
      'Permintaan Pencairan',
      'LPJ & Pajak',
      'Manajemen Akun',
    ];
    const matrix = {
      [ROLES.UNIT_PRODI]: {
        'Usulan RKAT': [1, 1, 1, 1, 0, 0],
        'Verifikasi Dokumen': [1, 0, 0, 0, 0, 0],
        'Persetujuan SK': [1, 0, 0, 0, 0, 0],
        'Permintaan Pencairan': [1, 1, 0, 0, 0, 0],
        'LPJ & Pajak': [1, 1, 1, 0, 0, 0],
        'Manajemen Akun': [0, 0, 0, 0, 0, 0],
      },
      [ROLES.BKPU]: {
        'Usulan RKAT': [1, 0, 0, 0, 1, 0],
        'Verifikasi Dokumen': [1, 1, 1, 0, 1, 0],
        'Persetujuan SK': [1, 0, 0, 0, 0, 0],
        'Permintaan Pencairan': [1, 0, 1, 0, 1, 0],
        'LPJ & Pajak': [1, 0, 0, 0, 1, 0],
        'Manajemen Akun': [0, 0, 0, 0, 0, 0],
      },
      [ROLES.WAKIL_REKTOR_2]: {
        'Usulan RKAT': [1, 0, 0, 0, 1, 1],
        'Verifikasi Dokumen': [1, 0, 0, 0, 1, 1],
        'Persetujuan SK': [1, 1, 1, 0, 1, 1],
        'Permintaan Pencairan': [1, 0, 0, 0, 1, 1],
        'LPJ & Pajak': [1, 0, 0, 0, 1, 1],
        'Manajemen Akun': [0, 0, 0, 0, 0, 0],
      },
      [ROLES.YAYASAN]: {
        'Usulan RKAT': [1, 0, 0, 0, 0, 1],
        'Verifikasi Dokumen': [1, 0, 0, 0, 0, 0],
        'Persetujuan SK': [1, 0, 0, 0, 0, 1],
        'Permintaan Pencairan': [1, 0, 1, 0, 1, 1],
        'LPJ & Pajak': [1, 0, 0, 0, 1, 0],
        'Manajemen Akun': [0, 0, 0, 0, 0, 0],
      },
      [ROLES.REKTOR]: {
        'Usulan RKAT': [1, 0, 0, 0, 0, 1],
        'Verifikasi Dokumen': [1, 0, 0, 0, 0, 0],
        'Persetujuan SK': [1, 1, 0, 0, 0, 1],
        'Permintaan Pencairan': [1, 0, 0, 0, 0, 1],
        'LPJ & Pajak': [1, 0, 0, 0, 0, 0],
        'Manajemen Akun': [0, 0, 0, 0, 0, 0],
      },
      [ROLES.ADMINISTRATOR]: {
        'Usulan RKAT': [1, 0, 0, 0, 0, 0],
        'Verifikasi Dokumen': [1, 0, 0, 0, 0, 0],
        'Persetujuan SK': [1, 0, 0, 0, 0, 0],
        'Permintaan Pencairan': [1, 0, 0, 0, 0, 0],
        'LPJ & Pajak': [1, 0, 0, 0, 0, 0],
        'Manajemen Akun': [1, 1, 1, 1, 1, 1],
      },
    };
    const insertPerm = tx.prepare(`
      INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete, can_verify, can_approve)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const [role, mods] of Object.entries(matrix)) {
      for (const mod of modules) {
        const flags = mods[mod] || [0, 0, 0, 0, 0, 0];
        insertPerm.run(role, mod, ...flags);
      }
    }

    // 4. Budget Periods
    const insertPeriod = tx.prepare(`
      INSERT INTO budget_periods (code, academic_year, semester, label, status, start_date, end_date, rkat_deadline, lpj_deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPeriod.run('TA-2024-2-GENAP', '2024/2025', 'Genap', 'TA 2024/2025 Genap', 'aktif', '2025-01-01', '2025-06-30', '2025-04-30', '2025-05-10');
    insertPeriod.run('TA-2023-1-GANJIL', '2023/2024', 'Ganjil', 'TA 2023/2024 Ganjil', 'diarsipkan', '2023-09-01', '2024-02-28', '2023-11-30', '2024-01-31');

    const activePeriod = tx.prepare('SELECT id FROM budget_periods WHERE code = ?').get('TA-2024-2-GENAP');

    // 5. Budget Categories
    const insertCat = tx.prepare(`
      INSERT INTO budget_categories (code, name, pillar, spend_category, plafon, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const cats = [
      ['5.2.1.01', 'Akademik & Kurikulum', 'Pilar Pendidikan', 'Honorarium', 150000000, 'aktif'],
      ['5.2.1.02', 'Kemahasiswaan', 'Sosial & Kemaslahatan', 'Konsumsi', 100000000, 'aktif'],
      ['5.2.2.01', 'Penelitian & Publikasi', 'Pilar Pendidikan', 'ATK & Bahan', 120000000, 'aktif'],
      ['5.2.3.01', 'Sarpras & Lab', 'Sekretariat / BSDM', 'Sewa Alat', 200000000, 'aktif'],
      ['5.2.4.01', 'Pengabdian Masyarakat', 'Sosial & Kemaslahatan', 'Perjalanan', 80000000, 'aktif'],
    ];
    for (const c of cats) insertCat.run(...c);

    // 6. SBM Tariffs
    const insertSbm = tx.prepare(`
      INSERT INTO sbm_tariffs (component, unit, max_rate, spend_category, year)
      VALUES (?, ?, ?, ?, ?)
    `);
    const sbms = [
      ['Honorarium narasumber eksternal', 'per jam', 1500000, 'Honorarium', '2024'],
      ['Honorarium moderator', 'per sesi', 750000, 'Honorarium', '2024'],
      ['Konsumsi makan siang', 'per kotak', 45000, 'Konsumsi', '2024'],
      ['Snack / coffee break', 'per kotak', 25000, 'Konsumsi', '2024'],
      ['Sewa ruang pertemuan', 'per hari', 1500000, 'Sewa Alat', '2024'],
      ['Transport lokal panitia', 'per orang', 150000, 'Perjalanan', '2024'],
    ];
    for (const s of sbms) insertSbm.run(...s);

    // 7. Submissions (matching unitData.js)
    const insertSub = tx.prepare(`
      INSERT INTO submissions (
        code, period_id, unit_id, user_id, title, pic, category, source,
        start_date, end_date, background, total_amount, status, workflow_stage,
        locked, phase, position_label, revision_note, sk_number, completeness, completeness_note,
        submitted_at, approved_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const submissionsData = [
      [
        'PGMI-2025-004', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI untuk Guru Madrasah',
        'Dr. Rahmat Hidayat, M.Pd', 'Akademik & Kurikulum', 'Pagu Prodi PGMI',
        '2025-05-10', '2025-05-12',
        'Peningkatan kompetensi guru madrasah dalam menyusun modul ajar digital dan asesmen autentik berbasis kecerdasan buatan.',
        25000000, 'revisi', 'revisi_unit', 0, null,
        'Dikembalikan oleh BKPU (Perlu Revisi)',
        'Sesuaikan honorarium narasumber eksternal dengan SBM Kemendikbudristek TA 2024 (maks. Rp 1.500.000/jam).',
        '', 100, '', '2025-04-18 09:00:00', null, '2025-04-18 08:30:00',
      ],
      [
        'PGMI-2025-003', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Praktek Pengalaman Lapangan (PPL) Mahasiswa PGMI',
        'Siti Aminah, M.Pd', 'Kemahasiswaan', 'Pagu Terpusat FTK',
        '2025-05-20', '2025-06-20',
        'Pelaksanaan PPL mahasiswa PGMI semester genap pada madrasah mitra di Kota Padang.',
        40500000, 'verifikasi', 'wr2_review', 1, null,
        'BKPU Disetujui (16 Apr) • Antrean Telaah WR2',
        '', '', 100, '', '2025-04-15 10:00:00', null, '2025-04-15 09:15:00',
      ],
      [
        'PGMI-2025-002', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Pengadaan Media Pembelajaran Microteaching Lab',
        'Nurul Hasanah, M.Pd', 'Sarpras & Lab', 'Pagu Investasi Sarpras',
        '2025-04-10', '2025-04-25',
        'Pengadaan perangkat audio visual dan media pembelajaran interaktif untuk laboratorium microteaching PGMI.',
        65000000, 'disetujui', 'approved', 0, 'cairkan',
        'SK: 088/UN-ADZ/KU/2025 • Siap Pencairan T1',
        '', '088/UN-ADZ/KU/2025', 100, '', '2025-04-04 08:00:00', '2025-04-15 09:00:00', '2025-04-04 07:45:00',
      ],
      [
        'PGMI-2025-001', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Seminar Nasional Pendidikan Islam & Publikasi Bereputasi',
        'Ahmad Fauzan, M.Ag', 'Penelitian & Publikasi', 'Pagu Prodi + Mitra',
        '2025-03-28', '2025-03-29',
        'Seminar nasional tahunan bidang pendidikan Islam serta pendampingan publikasi artikel ilmiah bereputasi.',
        85000000, 'disetujui', 'approved', 0, 'lpj',
        'SK: 042/UN-ADZ/KU/2025 • Realisasi 100%',
        '', '042/UN-ADZ/KU/2025', 100, '', '2025-03-28 08:00:00', '2025-04-01 10:00:00', '2025-03-28 07:30:00',
      ],
      [
        'PGMI-2025-005', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Review Kurikulum Berbasis OBE',
        'Dr. Rahmat Hidayat, M.Pd', 'Akademik & Kurikulum', 'Pagu Prodi PGMI',
        '2025-03-20', '2025-03-21',
        'Lokakarya peninjauan kurikulum Prodi PGMI berbasis Outcome-Based Education (OBE).',
        18500000, 'disetujui', 'approved', 0, 'lpj',
        'SK: 051/UN-ADZ/KU/2025 • Realisasi 100%',
        '', '051/UN-ADZ/KU/2025', 100, '', '2025-03-20 09:00:00', '2025-03-25 11:00:00', '2025-03-20 08:30:00',
      ],
      [
        'PGMI-2025-006', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Seminar Nasional Pendidikan Dasar',
        'Ahmad Fauzan, M.Ag', 'Penelitian & Publikasi', 'Pagu Prodi + Mitra',
        '2025-03-12', '2025-03-13',
        'Forum ilmiah nasional inovasi pembelajaran pendidikan dasar abad 21.',
        41500000, 'disetujui', 'approved', 0, 'cairkan',
        'SK: 060/UN-ADZ/KU/2025 • Siap Pencairan T1',
        '', '060/UN-ADZ/KU/2025', 100, '', '2025-03-12 08:30:00', '2025-03-18 14:00:00', '2025-03-12 08:00:00',
      ],
      [
        'PGMI-2025-D02', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Pengadaan Media Pembelajaran Kelas',
        'Nurul Hasanah, M.Pd', 'Sarpras & Lab', 'Pagu Investasi Sarpras',
        '2025-05-05', '2025-05-15',
        'Pengadaan proyektor dan papan tulis interaktif ruang kuliah PGMI.',
        22000000, 'draft', 'draft', 0, null,
        'Draft Tersimpan', '', '', 75, '', null, null, '2025-04-19 10:00:00',
      ],
      [
        'PGMI-2025-D01', activePeriod.id, pgmiUnit.id, unitUser.id,
        'Kuliah Pakar: Inovasi Pembelajaran',
        'Hendri Pratama, M.Pd', 'Akademik & Kurikulum', 'Pagu Prodi PGMI',
        '2025-05-18', '2025-05-18',
        'Kuliah pakar menghadirkan praktisi pendidikan nasional.',
        13000000, 'draft', 'draft', 0, null,
        'Draft Tersimpan', '', '', 40, '(RAB Kosong)', null, null, '2025-04-17 11:00:00',
      ],
    ];
    for (const s of submissionsData) insertSub.run(...s);

    // RAB items & timelines for each submission
    const insertItem = tx.prepare(`
      INSERT INTO submission_items (submission_id, account_code, name, spec, spend_category, qty, unit, price, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertTimeline = tx.prepare(`
      INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const allSubs = tx.prepare('SELECT id, code, total_amount, status, revision_note, position_label, completeness FROM submissions').all();
    for (const sub of allSubs) {
      const parts = [
        ['5.2.1.01', 'Honorarium narasumber & pemateri', 'Sesuai SBM', 'Honorarium', 1, 'Paket', Math.round(sub.total_amount * 0.4)],
        ['5.2.1.02', 'Konsumsi kegiatan', 'Snack & makan siang', 'Konsumsi', 1, 'Paket', Math.round(sub.total_amount * 0.3)],
        ['5.2.2.01', 'ATK, modul & sertifikat', 'Paket peserta', 'ATK & Bahan', 1, 'Paket', Math.round(sub.total_amount * 0.2)],
        ['5.2.3.01', 'Sewa perangkat & dokumentasi', 'Audio visual', 'Sewa Alat', 1, 'Paket', Math.round(sub.total_amount * 0.1)],
      ];
      for (const [acc, name, spec, cat, qty, unit, price] of parts) {
        insertItem.run(sub.id, acc, name, spec, cat, qty, unit, price, qty * price);
      }

      if (sub.status === 'revisi') {
        insertTimeline.run(sub.id, unitUser.id, ROLES.UNIT_PRODI, 'submit', 'Diajukan ke BKPU', 'Usulan diajukan oleh Kaprodi dan masuk antrean verifikasi.', 'slate', '2025-04-18 09:00:00');
        insertTimeline.run(sub.id, bkpuUser.id, ROLES.BKPU, 'revisi', 'Catatan Revisi Ditambahkan', `Verifikator BKPU: ${sub.revision_note}`, 'amber', '2025-04-19 10:15:00');
      } else if (sub.status === 'verifikasi') {
        insertTimeline.run(sub.id, unitUser.id, ROLES.UNIT_PRODI, 'submit', 'Diajukan ke BKPU', 'Usulan diajukan oleh Kaprodi.', 'slate', '2025-04-15 10:00:00');
        insertTimeline.run(sub.id, bkpuUser.id, ROLES.BKPU, 'verify', 'Menunggu Telaah WR II', sub.position_label, 'slate', '2025-04-16 11:00:00');
      } else if (sub.status === 'disetujui') {
        insertTimeline.run(sub.id, unitUser.id, ROLES.UNIT_PRODI, 'submit', 'Diajukan ke BKPU', 'Usulan diajukan oleh Kaprodi.', 'slate', '2025-04-04 08:00:00');
        insertTimeline.run(sub.id, bkpuUser.id, ROLES.BKPU, 'verify', 'Verifikasi BKPU Selesai', 'Rincian RAB sesuai SBM Universitas Adzkia.', 'slate', '2025-04-10 10:00:00');
        insertTimeline.run(sub.id, wr2User.id, ROLES.WAKIL_REKTOR_2, 'approve', 'Persetujuan WR II', `Usulan disetujui penuh. ${sub.position_label}.`, 'green', '2025-04-15 09:00:00');
      } else {
        insertTimeline.run(sub.id, unitUser.id, ROLES.UNIT_PRODI, 'draft', 'Draft Disimpan', `Kelengkapan data ${sub.completeness}%. Lengkapi sebelum diajukan.`, 'slate', '2025-04-17 11:00:00');
      }
    }

    const sub001 = tx.prepare('SELECT id FROM submissions WHERE code = ?').get('PGMI-2025-001');
    const sub002 = tx.prepare('SELECT id FROM submissions WHERE code = ?').get('PGMI-2025-002');
    const sub004 = tx.prepare('SELECT id FROM submissions WHERE code = ?').get('PGMI-2025-004');

    // 8. Disbursements (matching unitData.js)
    const insertDisb = tx.prepare(`
      INSERT INTO disbursements (
        code, submission_id, unit_id, requested_by, termin, termin_note, amount,
        receipt_no, bank_name, bank_account, sp2d_number, status, status_label, status_note, requested_at, disbursed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertDisb.run('PC-2025-006', sub002.id, pgmiUnit.id, unitUser.id, 'Termin 1', 'Uang Muka 70%', 45500000, 'Kuitansi No. 104', 'BSI Virtual Account Operasional PGMI', '8871092831', '0108/SP2D-KU/ADZ/2025', 'proses', 'Proses Kasir / SP2D Terbit', 'Est. Cair: 21 Apr 2025', '2025-04-17 09:00:00', null);
    insertDisb.run('PC-2025-003', sub001.id, pgmiUnit.id, unitUser.id, 'Termin 2', 'Pelunasan 50%', 42500000, 'Kuitansi No. 062', 'BSI Virtual Account Operasional PGMI', '8871092831', '0092/SP2D-KU/ADZ/2025', 'cair', 'Telah Dicairkan', 'Realisasi Kas: 04 Feb 2025', '2025-02-02 09:00:00', '2025-02-04 14:00:00');
    insertDisb.run('PC-2025-001', sub001.id, pgmiUnit.id, unitUser.id, 'Termin 1', 'Uang Muka 50%', 42500000, 'Kuitansi No. 011', 'BSI Virtual Account Operasional PGMI', '8871092831', '0031/SP2D-KU/ADZ/2025', 'cair', 'Telah Dicairkan', 'Realisasi Kas: 20 Jan 2025', '2025-01-18 09:00:00', '2025-01-20 11:00:00');

    const disb003 = tx.prepare('SELECT id FROM disbursements WHERE code = ?').get('PC-2025-003');
    const disb006 = tx.prepare('SELECT id FROM disbursements WHERE code = ?').get('PC-2025-006');

    // 9. LPJs (matching unitData.js)
    const insertLpj = tx.prepare(`
      INSERT INTO lpjs (
        code, submission_id, disbursement_id, unit_id, user_id, title, extra_label,
        dana_dicairkan, realisasi_belanja, silpa_amount, docs_summary, progress, doc_note, doc_warn, status, bap_number, submitted_at, verified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertLpj.run('LPJ-2025-004', sub004.id, null, pgmiUnit.id, unitUser.id, 'Workshop Pengembangan Modul Digital & Asesmen Autentik', 'Termin Tunggal', 21000000, 20850000, 150000, '4 dari 6 Berkas', 66, '2 Kuitansi belum diunggah', 0, 'draft', '', null, null);
    insertLpj.run('LPJ-2025-003', sub001.id, disb003.id, pgmiUnit.id, unitUser.id, 'Seminar Nasional Pendidikan Islam & Publikasi', 'Deadline 10 Mei 2025', 42500000, 42500000, 0, '14 Dokumen Lengkap', 100, 'Kuitansi + Faktur + Berita Acara', 0, 'verifikasi', '', '2025-04-12 14:15:00', null);
    insertLpj.run('LPJ-2025-002', sub002.id, disb006.id, pgmiUnit.id, unitUser.id, 'Pengadaan Media Pembelajaran Microteaching Lab', 'Sarpras Kampus', 45500000, 44900000, 600000, '8 Dokumen (Ada Catatan)', 83, 'Bukti potong PPh 21 belum distempel mitra percetakan', 1, 'revisi', '', '2025-02-28 16:30:00', null);
    insertLpj.run('LPJ-2025-001', sub001.id, disb003.id, pgmiUnit.id, unitUser.id, 'Pelatihan Penulisan Jurnal Bereputasi', 'BAP: 042/BAP-LPJ/ADZ/2025', 35000000, 35000000, 0, '12 Dokumen Lengkap', 100, 'Arsip Disahkan SPI & WR II', 0, 'disetujui', '042/BAP-LPJ/ADZ/2025', '2025-02-08 10:00:00', '2025-02-10 11:05:00');

    // 10. Notifications
    const insertNotif = tx.prepare(`
      INSERT INTO notifications (user_id, role_target, category, tag, tag_tone, ref_code, title, body, footnote, accent, icon, critical, is_read, actions_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertNotif.run(
      unitUser.id, ROLES.UNIT_PRODI, 'tindakan', 'PERLU TINDAKAN', 'maroon', 'Ref: PGMI-2025-004',
      'Catatan Revisi dari BKPU: Pengajuan Workshop Pengembangan Modul Digital',
      'Verifikator Anggaran (Ahmad Zaky, S.E.) meminta penyesuaian komponen **honorarium narasumber eksternal** agar merujuk ke SBM Kemendikbudristek TA 2024. Pagu usulan melebihi standar Rp 1.500.000/jam. Batas submit revisi: **25 April 2025**.',
      '', 'maroon', 'alert', 0, 0,
      JSON.stringify([{ label: 'Buka & Perbaiki Revisi', to: '/dashboard/unit/pengajuan/PGMI-2025-004', primary: 'maroon' }]),
      '2025-04-19 10:15:00'
    );
    insertNotif.run(
      unitUser.id, ROLES.UNIT_PRODI, 'keuangan', 'PENCAIRAN KASIR', 'navy', 'SP2D: 0092/SP2D-KU/ADZ/2025',
      'Pencairan Dana Termin 2 Berhasil Ditransfer (Kasir Rektorat)',
      'Dana pelaksanaan kegiatan **Seminar Nasional Pendidikan Islam & Publikasi Bereputasi (Ref: PGMI-2025-001)** sebesar **Rp 42.500.000** telah didelegasikan dan masuk ke BSI Virtual Account Operasional PGMI (VA: 8871092831).',
      '', 'slate', 'wallet', 0, 0,
      JSON.stringify([{ label: 'Lihat Bukti Transfer & SP2D', to: '/dashboard/unit/pencairan/PC-2025-003', primary: 'navy' }]),
      '2025-04-19 08:00:00'
    );
    insertNotif.run(
      unitUser.id, ROLES.UNIT_PRODI, 'tindakan', 'BATAS WAKTU LPJ', 'red', 'Kegiatan Selesai: 28 Maret 2025',
      'Pengingat Batas Akhir Unggah LPJ: Sisa 22 Hari',
      'Sesuai Standar Operasional Keuangan No. 04/UN-ADZ/PR/2024, kegiatan **Seminar Nasional Pendidikan Islam** wajib melengkapi kuitansi asli bermeterai, BAP, serta daftar hadir peserta maksimal tanggal **10 Mei 2025**.',
      '', 'red', 'calendar', 1, 0,
      JSON.stringify([{ label: 'Unggah Dokumen LPJ Sekarang', to: '/dashboard/unit/laporan-spj/LPJ-2025-003', primary: 'navy' }]),
      '2025-04-19 08:15:00'
    );
    insertNotif.run(
      unitUser.id, ROLES.UNIT_PRODI, 'keuangan', 'DISETUJUI WR II', 'sky', 'SK No: 088/UN-ADZ/KU/2025',
      'Persetujuan Usulan Anggaran oleh Wakil Rektor II Bidang Keuangan',
      'Usulan **Pengadaan Media Pembelajaran Microteaching Lab (PGMI-2025-002)** telah ditandatangani secara elektronik dan disetujui penuh senilai **Rp 65.000.000**.',
      '', 'navy', 'badge', 0, 1,
      JSON.stringify([{ label: 'Lihat Salinan SK', to: '/dashboard/unit/pengajuan/PGMI-2025-002' }]),
      '2025-04-18 14:20:00'
    );

    // 11. System Configs
    const insertCfg = tx.prepare(`
      INSERT INTO system_configs (key, tab, label, value)
      VALUES (?, ?, ?, ?)
    `);
    const configs = [
      ['app_name', 'Umum & Institusi', 'Nama Aplikasi', 'E-Budgeting Universitas Adzkia Padang'],
      ['currency', 'Umum & Institusi', 'Mata Uang', 'Rupiah Indonesia (IDR)'],
      ['version', 'Umum & Institusi', 'Versi Sistem', 'v2.4.0-ERP'],
      ['office_address', 'Umum & Institusi', 'Lokasi Tata Usaha', 'Gedung Rektorat Lt. 2, Kampus Universitas Adzkia Padang'],
      ['min_password_length', 'Keamanan & Password', 'Panjang Minimal Password', '8'],
      ['require_2fa_high_value', 'Keamanan & Password', 'Wajib 2FA di atas nominal (Rp)', '10000000'],
      ['bsi_va_prefix', 'Integrasi Gateway', 'Prefix BSI Virtual Account', '887109'],
      ['lpj_termin2_threshold', 'Notifikasi & Scheduler', 'Minimal Verifikasi LPJ Termin 1 (%)', '80'],
    ];
    for (const c of configs) insertCfg.run(...c);

    // 12. Audit Logs
    const insertAudit = tx.prepare(`
      INSERT INTO audit_logs (user_id, user_name, user_role, module, action, title, detail, ip_address, status, tone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAudit.run(unitUser.id, 'Dr. Rahmat Hidayat, M.Pd', ROLES.UNIT_PRODI, 'Profil', 'update', 'Pembaruan Rekening Virtual Prodi', 'Rekening BSI Virtual Account PGMI diverifikasi', '10.15.22.45', 'success', 'maroon', '2025-04-02 14:20:00');
    insertAudit.run(bkpuUser.id, 'Staf BKPU', ROLES.BKPU, 'Pengajuan', 'revisi', 'Catatan Revisi PGMI-2025-004', 'Penyesuaian honorarium narasumber eksternal sesuai SBM', '10.15.22.12', 'success', 'amber', '2025-04-19 10:15:00');
    insertAudit.run(wr2User.id, 'Wakil Rektor II', ROLES.WAKIL_REKTOR_2, 'Persetujuan', 'approve', 'Persetujuan WR2 PGMI-2025-002', 'SK: 088/UN-ADZ/KU/2025 diterbitkan', '10.15.22.10', 'success', 'green', '2025-04-15 09:00:00');
    insertAudit.run(adminUser.id, 'Administrator', ROLES.ADMINISTRATOR, 'Sistem', 'seed', 'Inisialisasi Basis Data E-Budgeting', 'Seed data awal sistem berhasil dijalankan', '127.0.0.1', 'success', 'slate', '2025-04-01 08:00:00');
  });

  return true;
}

// Allow running directly: node src/database/seed.js
const isDirectRun = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirectRun) {
  const force = process.argv.includes('--force');
  const seeded = seedIfEmpty({ force });
  console.log(seeded ? 'Database seeded successfully.' : 'Database already contains data (use --force to reset).');
}
