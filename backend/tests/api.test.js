import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { env } from '../src/config/env.js';
import { closeDb } from '../src/database/db.js';
import { seedIfEmpty } from '../src/database/seed.js';
import { createApp } from '../src/app.js';

let server;
let baseUrl;
const testDbPath = path.resolve(path.dirname(env.dbPath), 'test-ebudgeting.sqlite');

async function api(urlPath, { method = 'GET', token, body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !formData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${baseUrl}${urlPath}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function loginAs(identifier, role) {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: { identifier, password: 'password123', role },
  });
  assert.equal(res.status, 200, `Login failed for ${identifier}: ${JSON.stringify(res.data)}`);
  return res.data.token;
}

describe('Adzkia E-Budgeting Backend API (Tahap 4 & Tahap 5)', () => {
  before(async () => {
    env.dbPath = testDbPath;
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    seedIfEmpty({ force: true });
    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    closeDb();
    for (const suffix of ['', '-wal', '-shm']) {
      const f = `${testDbPath}${suffix}`;
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  });

  it('GET /api/health returns ok', async () => {
    const res = await api('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'ok');
  });

  it('Auth: login, register, forgot-password, and /me work', async () => {
    const token = await loginAs('unit', 'unit_prodi');
    const me = await api('/api/auth/me', { token });
    assert.equal(me.status, 200);
    assert.equal(me.data.user.username, 'unit');
    assert.ok(Array.isArray(me.data.permissions));

    const reg = await api('/api/auth/register', {
      method: 'POST',
      body: { fullName: 'Dosen Baru', email: 'dosen.baru@adzkia.ac.id', unit: 'prodi-pgmi', role: 'unit_prodi', password: 'password123' },
    });
    assert.equal(reg.status, 201);

    const fp = await api('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: 'unit@adzkia.ac.id' },
    });
    assert.equal(fp.status, 200);
  });

  it('Core Workflow: Draft -> Submit -> BKPU Revisi -> Resubmit -> BKPU Approve -> WR2 Approve', async () => {
    const unitToken = await loginAs('unit', 'unit_prodi');
    const bkpuToken = await loginAs('bkpu', 'bkpu');
    const wr2Token = await loginAs('wr2', 'wakil_rektor_2');

    // Create draft
    const created = await api('/api/submissions', {
      method: 'POST',
      token: unitToken,
      body: {
        title: 'Pelatihan Kurikulum Merdeka PGMI',
        category: 'Akademik & Kurikulum',
        pic: 'Dr. Rahmat Hidayat, M.Pd',
        start_date: '2025-05-01',
        end_date: '2025-05-02',
        background: 'Penguatan kompetensi dosen dalam implementasi kurikulum merdeka.',
        items: [
          { name: 'Honorarium Pemateri', spend_category: 'Honorarium', qty: 2, unit: 'Org', price: 1500000 },
          { name: 'Konsumsi Peserta', spend_category: 'Konsumsi', qty: 40, unit: 'Kotak', price: 45000 },
        ],
      },
    });
    assert.equal(created.status, 201);
    const subCode = created.data.submission.code;
    assert.equal(created.data.submission.total_amount, 4800000);
    assert.equal(created.data.submission.status, 'draft');

    // Submit to BKPU
    const submitted = await api(`/api/submissions/${subCode}/submit`, { method: 'POST', token: unitToken });
    assert.equal(submitted.status, 200);
    assert.equal(submitted.data.submission.status, 'verifikasi');
    assert.equal(submitted.data.submission.locked, 1);

    // BKPU sends back for revisi
    const rev = await api(`/api/submissions/${subCode}/verify`, {
      method: 'POST',
      token: bkpuToken,
      body: { decision: 'revisi', note: 'Lengkapi spesifikasi konsumsi.' },
    });
    assert.equal(rev.status, 200);
    assert.equal(rev.data.submission.status, 'revisi');
    assert.equal(rev.data.submission.locked, 0);

    // Unit resubmits
    const resub = await api(`/api/submissions/${subCode}/submit`, { method: 'POST', token: unitToken });
    assert.equal(resub.status, 200);
    assert.equal(resub.data.submission.status, 'verifikasi');

    // BKPU approves -> WR2 review
    const bkpuOk = await api(`/api/submissions/${subCode}/verify`, {
      method: 'POST',
      token: bkpuToken,
      body: { decision: 'approve', note: 'Sesuai SBM.' },
    });
    assert.equal(bkpuOk.status, 200);
    assert.equal(bkpuOk.data.submission.workflow_stage, 'wr2_review');

    // WR2 approves -> disetujui & phase cairkan
    const wr2Ok = await api(`/api/submissions/${subCode}/approve`, {
      method: 'POST',
      token: wr2Token,
      body: { decision: 'approve', note: 'Disetujui penuh.' },
    });
    assert.equal(wr2Ok.status, 200);
    assert.equal(wr2Ok.data.submission.status, 'disetujui');
    assert.equal(wr2Ok.data.submission.phase, 'cairkan');
  });

  it('Excel Import: parse .xlsx with valid, error, warning rows and confirm import', async () => {
    const unitToken = await loginAs('unit', 'unit_prodi');

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Kode Akun', 'Nama Item Belanja', 'Volume (Angka)', 'Satuan Unit', 'Harga Satuan (Rp)', 'Keterangan / Spek'],
      ['5.2.1.01', 'Honor Pemateri', 2, 'Org', 1500000, 'Eksternal'],
      ['', 'Spanduk', 2, 'Buah', 'dua ratus ribu', 'Format salah'],
      ['5.2.2.03', 'Cetak Panduan', 0, 'Eks', 35000, 'Volume nol'],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'RAB');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const formData = new FormData();
    formData.append('file', new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'test_rab.xlsx');

    const parsed = await api('/api/imports/parse', { method: 'POST', token: unitToken, formData });
    assert.equal(parsed.status, 200);
    assert.equal(parsed.data.stats.total, 3);
    assert.equal(parsed.data.stats.valid, 1);
    assert.equal(parsed.data.stats.errors, 1);
    assert.equal(parsed.data.stats.warnings, 1);
    assert.equal(parsed.data.stats.sum, 3000000);

    const confirmed = await api(`/api/imports/${parsed.data.importId}/confirm`, {
      method: 'POST',
      token: unitToken,
      body: { title: 'Usulan Hasil Import Excel' },
    });
    assert.equal(confirmed.status, 200);
    assert.ok(confirmed.data.submissionId);
  });

  it('Disbursement & LPJ Flow: Termin 1 -> Cair -> LPJ -> Verifikasi SPI -> Termin 2', async () => {
    const unitToken = await loginAs('unit', 'unit_prodi');
    const yayasanToken = await loginAs('yayasan', 'yayasan');
    const bkpuToken = await loginAs('bkpu', 'bkpu');

    // Request Termin 1 on approved PGMI-2025-006 (total 41,500,000)
    const req1 = await api('/api/disbursements', {
      method: 'POST',
      token: unitToken,
      body: { submission_code: 'PGMI-2025-006', termin: 'Termin 1 - Uang Muka 50%', amount: 20000000 },
    });
    assert.equal(req1.status, 201);
    const disb1Code = req1.data.disbursement.code;

    // Yayasan processes SP2D -> cair
    const proc1 = await api(`/api/disbursements/${disb1Code}/process`, {
      method: 'POST',
      token: yayasanToken,
      body: { decision: 'cair' },
    });
    assert.equal(proc1.status, 200);
    assert.equal(proc1.data.disbursement.status, 'cair');

    // Termin 2 before LPJ is verified should be blocked
    const req2Blocked = await api('/api/disbursements', {
      method: 'POST',
      token: unitToken,
      body: { submission_code: 'PGMI-2025-006', termin: 'Termin 2 - Pelunasan 50%', amount: 21500000 },
    });
    assert.equal(req2Blocked.status, 400);

    // Create LPJ for PGMI-2025-006, update realisasi, submit, and verify by BKPU
    const lpjCreated = await api('/api/lpjs', {
      method: 'POST',
      token: unitToken,
      body: { submission_code: 'PGMI-2025-006' },
    });
    assert.equal(lpjCreated.status, 201);
    const lpjCode = lpjCreated.data.lpj.code;

    await api(`/api/lpjs/${lpjCode}`, {
      method: 'PUT',
      token: unitToken,
      body: { realisasi_belanja: 20000000 },
    });
    await api(`/api/lpjs/${lpjCode}/submit`, { method: 'POST', token: unitToken });

    const lpjVerified = await api(`/api/lpjs/${lpjCode}/verify`, {
      method: 'POST',
      token: bkpuToken,
      body: { decision: 'approve' },
    });
    assert.equal(lpjVerified.status, 200);
    assert.equal(lpjVerified.data.lpj.status, 'disetujui');

    // Now Termin 2 succeeds
    const req2Ok = await api('/api/disbursements', {
      method: 'POST',
      token: unitToken,
      body: { submission_code: 'PGMI-2025-006', termin: 'Termin 2 - Pelunasan 50%', amount: 21500000 },
    });
    assert.equal(req2Ok.status, 201);
  });

  it('Dashboards for all 6 roles & Admin endpoints work', async () => {
    const roles = [
      ['unit', 'unit_prodi'],
      ['bkpu', 'bkpu'],
      ['wr2', 'wakil_rektor_2'],
      ['yayasan', 'yayasan'],
      ['rektor', 'rektor'],
      ['admin', 'administrator'],
    ];
    for (const [id, role] of roles) {
      const token = await loginAs(id, role);
      const dash = await api('/api/dashboard', { token });
      assert.equal(dash.status, 200);
      assert.equal(dash.data.role, role);
    }

    const adminToken = await loginAs('admin', 'administrator');
    const users = await api('/api/admin/users', { token: adminToken });
    assert.equal(users.status, 200);
    assert.ok(users.data.users.length >= 6);

    const logs = await api('/api/admin/audit-logs', { token: adminToken });
    assert.equal(logs.status, 200);
    assert.ok(logs.data.logs.length > 0);
  });
});
