# Adzkia E-Budgeting Backend API

Backend REST API untuk **Sistem Informasi E-Budgeting Universitas Adzkia Padang** yang mencakup fitur **Tahap 4 (Fitur Inti)** dan **Tahap 5 (Fitur Lanjutan & Integrasi)** tanpa mengubah frontend yang sudah ada.

## Menjalankan Server

```bash
cd backend
npm install
npm run seed    # opsional, seed otomatis berjalan saat server start jika DB kosong
npm run dev     # atau npm start
```

Server berjalan pada `http://localhost:5000` (konfigurasi di `.env`).

## Pengujian

```bash
cd backend
npm test
```

## Akun Default (Password: `password123`)

| Username | Email | Role |
|---|---|---|
| `unit` | `unit@adzkia.ac.id` | `unit_prodi` |
| `bkpu` | `bkpu@adzkia.ac.id` | `bkpu` |
| `wr2` | `wr2@adzkia.ac.id` | `wakil_rektor_2` |
| `yayasan` | `yayasan@adzkia.ac.id` | `yayasan` |
| `rektor` | `rektor@adzkia.ac.id` | `rektor` |
| `admin` | `admin@adzkia.ac.id` | `administrator` |

## Ringkasan Endpoint

- **Auth & Profil (`/api/auth`)**: `POST /login`, `POST /register`, `POST /forgot-password`, `POST /reset-password`, `POST /logout`, `GET /me`, `PUT /profile`, `POST /profile/photo`, `POST /profile/signature`, `PUT /change-password`, `GET /sessions`, `DELETE /sessions/:id`
- **Data Dasar / Master (`/api/master`)**: `GET/POST/PUT/DELETE /units`, `GET/POST/PUT /periods`, `GET/POST/PUT /categories`, `GET/POST /sbm`
- **Pengajuan Anggaran & Alur Verifikasi/Persetujuan (`/api/submissions`)**: `GET /`, `GET /summary`, `GET /:idOrCode`, `POST /`, `PUT /:idOrCode`, `DELETE /:idOrCode`, `POST /:idOrCode/documents`, `POST /:idOrCode/submit`, `POST /:idOrCode/verify` (BKPU), `POST /:idOrCode/approve` (WR2/Yayasan/Rektor)
- **Import Anggaran Excel (`/api/imports`)**: `GET /template`, `POST /parse`, `POST /:id/confirm`
- **Pencairan Dana (`/api/disbursements`)**: `GET /`, `GET /:idOrCode`, `POST /`, `POST /:idOrCode/process`
- **Laporan Pertanggungjawaban / LPJ (`/api/lpjs`)**: `GET /`, `GET /:idOrCode`, `POST /`, `PUT /:idOrCode`, `POST /:idOrCode/documents`, `POST /:idOrCode/submit`, `POST /:idOrCode/verify`
- **Dashboard Setiap Peran (`/api/dashboard`)**: `GET /` (otomatis menyesuaikan data untuk `unit_prodi`, `bkpu`, `wakil_rektor_2`, `yayasan`, `rektor`, `administrator`)
- **Notifikasi (`/api/notifications`)**: `GET /`, `PUT /read-all`, `PUT /:id/read`, `DELETE /:id`
- **Administrasi & Audit (`/api/admin`)**: `GET/POST/PUT/DELETE /users`, `GET/PUT /roles`, `GET/PUT /configs`, `GET /audit-logs`
