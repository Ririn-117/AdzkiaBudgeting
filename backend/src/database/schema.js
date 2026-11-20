import { getDb } from './db.js';

export function initSchema() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      parent_faculty TEXT DEFAULT '',
      type TEXT NOT NULL DEFAULT 'Program Studi',
      head_name TEXT DEFAULT '',
      bsi_account TEXT DEFAULT '',
      bsi_bank_name TEXT DEFAULT 'BSI Virtual Account Operasional',
      pagu_allocated REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'aktif',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      nidn TEXT DEFAULT '',
      rank TEXT DEFAULT '',
      employment_status TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      role TEXT NOT NULL,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'aktif',
      twofa_enabled INTEGER NOT NULL DEFAULT 0,
      whatsapp_notif INTEGER NOT NULL DEFAULT 1,
      revisi_notif INTEGER NOT NULL DEFAULT 1,
      photo_url TEXT DEFAULT NULL,
      signature_url TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_jti TEXT NOT NULL UNIQUE,
      device TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      location TEXT DEFAULT 'Jaringan Kampus',
      is_active INTEGER NOT NULL DEFAULT 1,
      last_active_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      module TEXT NOT NULL,
      can_view INTEGER NOT NULL DEFAULT 0,
      can_create INTEGER NOT NULL DEFAULT 0,
      can_edit INTEGER NOT NULL DEFAULT 0,
      can_delete INTEGER NOT NULL DEFAULT 0,
      can_verify INTEGER NOT NULL DEFAULT 0,
      can_approve INTEGER NOT NULL DEFAULT 0,
      UNIQUE(role, module)
    );

    CREATE TABLE IF NOT EXISTS budget_periods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      academic_year TEXT NOT NULL,
      semester TEXT NOT NULL,
      label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draf',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      rkat_deadline TEXT NOT NULL,
      lpj_deadline TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS budget_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      pillar TEXT NOT NULL DEFAULT 'Pilar Pendidikan',
      spend_category TEXT NOT NULL DEFAULT 'Lain-lain',
      plafon REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'aktif',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sbm_tariffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component TEXT NOT NULL,
      unit TEXT NOT NULL,
      max_rate REAL NOT NULL,
      spend_category TEXT NOT NULL,
      year TEXT NOT NULL DEFAULT '2024'
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      period_id INTEGER REFERENCES budget_periods(id) ON DELETE SET NULL,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      pic TEXT NOT NULL,
      category TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'Pagu Unit',
      start_date TEXT DEFAULT '',
      end_date TEXT DEFAULT '',
      background TEXT DEFAULT '',
      total_amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      workflow_stage TEXT NOT NULL DEFAULT 'draft',
      locked INTEGER NOT NULL DEFAULT 0,
      phase TEXT DEFAULT NULL,
      position_label TEXT DEFAULT '',
      revision_note TEXT DEFAULT '',
      sk_number TEXT DEFAULT '',
      completeness INTEGER NOT NULL DEFAULT 0,
      completeness_note TEXT DEFAULT '',
      submitted_at TEXT DEFAULT NULL,
      approved_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submission_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      account_code TEXT DEFAULT '',
      name TEXT NOT NULL,
      spec TEXT DEFAULT '',
      spend_category TEXT NOT NULL DEFAULT 'Lain-lain',
      qty REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'Paket',
      price REAL NOT NULL DEFAULT 0,
      subtotal REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS submission_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      doc_type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      mime_type TEXT DEFAULT 'application/pdf',
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submission_timelines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      actor_role TEXT DEFAULT '',
      action TEXT NOT NULL,
      title TEXT NOT NULL,
      note TEXT DEFAULT '',
      tone TEXT NOT NULL DEFAULT 'slate',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS disbursements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      requested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      termin TEXT NOT NULL,
      termin_note TEXT DEFAULT '',
      amount REAL NOT NULL,
      receipt_no TEXT DEFAULT 'Kuitansi menunggu nomor',
      bank_name TEXT DEFAULT 'BSI Virtual Account Operasional',
      bank_account TEXT DEFAULT '',
      sp2d_number TEXT DEFAULT 'Belum terbit',
      status TEXT NOT NULL DEFAULT 'proses',
      status_label TEXT NOT NULL DEFAULT 'Menunggu Verifikasi Kasir',
      status_note TEXT DEFAULT '',
      transfer_proof_path TEXT DEFAULT NULL,
      requested_at TEXT NOT NULL DEFAULT (datetime('now')),
      disbursed_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lpjs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      disbursement_id INTEGER REFERENCES disbursements(id) ON DELETE SET NULL,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      extra_label TEXT DEFAULT 'Termin Tunggal',
      dana_dicairkan REAL NOT NULL DEFAULT 0,
      realisasi_belanja REAL NOT NULL DEFAULT 0,
      silpa_amount REAL NOT NULL DEFAULT 0,
      silpa_proof_path TEXT DEFAULT NULL,
      docs_summary TEXT DEFAULT '0 dari 6 Berkas',
      progress INTEGER NOT NULL DEFAULT 0,
      doc_note TEXT DEFAULT 'Belum ada bukti diunggah',
      doc_warn INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      bap_number TEXT DEFAULT '',
      submitted_at TEXT DEFAULT NULL,
      verified_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lpj_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lpj_id INTEGER NOT NULL REFERENCES lpjs(id) ON DELETE CASCADE,
      checklist_item TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      is_verified INTEGER NOT NULL DEFAULT 0,
      note TEXT DEFAULT '',
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS excel_imports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
      file_name TEXT NOT NULL,
      total_rows INTEGER NOT NULL DEFAULT 0,
      valid_rows INTEGER NOT NULL DEFAULT 0,
      error_rows INTEGER NOT NULL DEFAULT 0,
      warning_rows INTEGER NOT NULL DEFAULT 0,
      total_valid_amount REAL NOT NULL DEFAULT 0,
      parsed_rows_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'parsed',
      submission_id INTEGER REFERENCES submissions(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role_target TEXT DEFAULT NULL,
      category TEXT NOT NULL DEFAULT 'info',
      tag TEXT NOT NULL DEFAULT 'INFO',
      tag_tone TEXT NOT NULL DEFAULT 'sky',
      ref_code TEXT DEFAULT '',
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      footnote TEXT DEFAULT '',
      accent TEXT NOT NULL DEFAULT 'navy',
      icon TEXT NOT NULL DEFAULT 'megaphone',
      critical INTEGER NOT NULL DEFAULT 0,
      is_read INTEGER NOT NULL DEFAULT 0,
      actions_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_name TEXT DEFAULT 'System',
      user_role TEXT DEFAULT '',
      module TEXT NOT NULL,
      action TEXT NOT NULL,
      title TEXT NOT NULL,
      detail TEXT DEFAULT '',
      ip_address TEXT DEFAULT '127.0.0.1',
      status TEXT NOT NULL DEFAULT 'success',
      tone TEXT NOT NULL DEFAULT 'slate',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS system_configs (
      key TEXT PRIMARY KEY,
      tab TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
