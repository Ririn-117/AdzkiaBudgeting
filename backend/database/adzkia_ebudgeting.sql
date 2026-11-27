-- ============================================================================
-- Sistem Informasi E-Budgeting Universitas Adzkia Padang
-- Database : adzkia_ebudgeting (MySQL / MariaDB - XAMPP / phpMyAdmin)
-- Total    : 19 Tabel Lengkap beserta Relasi Foreign Key & Data Awal (Seed)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `adzkia_ebudgeting`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `adzkia_ebudgeting`;
-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: adzkia_ebudgeting
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL DEFAULT 'System',
  `user_role` varchar(64) NOT NULL DEFAULT '',
  `module` varchar(120) NOT NULL,
  `action` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text DEFAULT NULL,
  `ip_address` varchar(64) NOT NULL DEFAULT '127.0.0.1',
  `status` varchar(32) NOT NULL DEFAULT 'success',
  `tone` varchar(32) NOT NULL DEFAULT 'slate',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'Dr. Rahmat Hidayat, M.Pd','unit_prodi','Profil','update','Pembaruan Rekening Virtual Prodi','Rekening BSI Virtual Account PGMI diverifikasi','10.15.22.45','success','maroon','2025-04-02 14:20:00'),(2,2,'Staf BKPU','bkpu','Pengajuan','revisi','Catatan Revisi PGMI-2025-004','Penyesuaian honorarium narasumber eksternal sesuai SBM','10.15.22.12','success','amber','2025-04-19 10:15:00'),(3,3,'Wakil Rektor II','wakil_rektor_2','Persetujuan','approve','Persetujuan WR2 PGMI-2025-002','SK: 088/UN-ADZ/KU/2025 diterbitkan','10.15.22.10','success','green','2025-04-15 09:00:00'),(4,6,'Administrator','administrator','Sistem','seed','Inisialisasi Basis Data E-Budgeting','Seed data awal sistem berhasil dijalankan','127.0.0.1','success','slate','2025-04-01 08:00:00');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_categories`
--

DROP TABLE IF EXISTS `budget_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budget_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pillar` varchar(150) NOT NULL DEFAULT 'Pilar Pendidikan',
  `spend_category` varchar(100) NOT NULL DEFAULT 'Lain-lain',
  `plafon` double NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'aktif',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_categories`
--

LOCK TABLES `budget_categories` WRITE;
/*!40000 ALTER TABLE `budget_categories` DISABLE KEYS */;
INSERT INTO `budget_categories` VALUES (1,'5.2.1.01','Akademik & Kurikulum','Pilar Pendidikan','Honorarium',150000000,'aktif','2026-11-27 15:00:42'),(2,'5.2.1.02','Kemahasiswaan','Sosial & Kemaslahatan','Konsumsi',100000000,'aktif','2026-11-27 15:00:42'),(3,'5.2.2.01','Penelitian & Publikasi','Pilar Pendidikan','ATK & Bahan',120000000,'aktif','2026-11-27 15:00:42'),(4,'5.2.3.01','Sarpras & Lab','Sekretariat / BSDM','Sewa Alat',200000000,'aktif','2026-11-27 15:00:42'),(5,'5.2.4.01','Pengabdian Masyarakat','Sosial & Kemaslahatan','Perjalanan',80000000,'aktif','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `budget_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_periods`
--

DROP TABLE IF EXISTS `budget_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budget_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `academic_year` varchar(32) NOT NULL,
  `semester` varchar(32) NOT NULL,
  `label` varchar(150) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'draf',
  `start_date` varchar(32) NOT NULL,
  `end_date` varchar(32) NOT NULL,
  `rkat_deadline` varchar(32) NOT NULL,
  `lpj_deadline` varchar(32) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_periods`
--

LOCK TABLES `budget_periods` WRITE;
/*!40000 ALTER TABLE `budget_periods` DISABLE KEYS */;
INSERT INTO `budget_periods` VALUES (1,'TA-2024-2-GENAP','2024/2025','Genap','TA 2024/2025 Genap','aktif','2025-01-01','2025-06-30','2025-04-30','2025-05-10','2026-11-27 15:00:42'),(2,'TA-2023-1-GANJIL','2023/2024','Ganjil','TA 2023/2024 Ganjil','diarsipkan','2023-09-01','2024-02-28','2023-11-30','2024-01-31','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `budget_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disbursements`
--

DROP TABLE IF EXISTS `disbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disbursements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `termin` varchar(100) NOT NULL,
  `termin_note` varchar(255) NOT NULL DEFAULT '',
  `amount` double NOT NULL,
  `receipt_no` varchar(120) NOT NULL DEFAULT 'Kuitansi menunggu nomor',
  `bank_name` varchar(255) NOT NULL DEFAULT 'BSI Virtual Account Operasional',
  `bank_account` varchar(64) NOT NULL DEFAULT '',
  `sp2d_number` varchar(120) NOT NULL DEFAULT 'Belum terbit',
  `status` varchar(32) NOT NULL DEFAULT 'proses',
  `status_label` varchar(150) NOT NULL DEFAULT 'Menunggu Verifikasi Kasir',
  `status_note` varchar(255) NOT NULL DEFAULT '',
  `transfer_proof_path` varchar(500) DEFAULT NULL,
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `disbursed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_disb_sub` (`submission_id`),
  KEY `fk_disb_unit` (`unit_id`),
  KEY `fk_disb_user` (`requested_by`),
  CONSTRAINT `fk_disb_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_disb_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_disb_user` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disbursements`
--

LOCK TABLES `disbursements` WRITE;
/*!40000 ALTER TABLE `disbursements` DISABLE KEYS */;
INSERT INTO `disbursements` VALUES (1,'PC-2025-006',3,1,1,'Termin 1','Uang Muka 70%',45500000,'Kuitansi No. 104','BSI Virtual Account Operasional PGMI','8871092831','0108/SP2D-KU/ADZ/2025','proses','Proses Kasir / SP2D Terbit','Est. Cair: 21 Apr 2025',NULL,'2025-04-17 09:00:00',NULL,'2026-11-27 15:00:42'),(2,'PC-2025-003',4,1,1,'Termin 2','Pelunasan 50%',42500000,'Kuitansi No. 062','BSI Virtual Account Operasional PGMI','8871092831','0092/SP2D-KU/ADZ/2025','cair','Telah Dicairkan','Realisasi Kas: 04 Feb 2025',NULL,'2025-02-02 09:00:00','2025-02-04 14:00:00','2026-11-27 15:00:42'),(3,'PC-2025-001',4,1,1,'Termin 1','Uang Muka 50%',42500000,'Kuitansi No. 011','BSI Virtual Account Operasional PGMI','8871092831','0031/SP2D-KU/ADZ/2025','cair','Telah Dicairkan','Realisasi Kas: 20 Jan 2025',NULL,'2025-01-18 09:00:00','2025-01-20 11:00:00','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `disbursements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `excel_imports`
--

DROP TABLE IF EXISTS `excel_imports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `excel_imports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `total_rows` int(11) NOT NULL DEFAULT 0,
  `valid_rows` int(11) NOT NULL DEFAULT 0,
  `error_rows` int(11) NOT NULL DEFAULT 0,
  `warning_rows` int(11) NOT NULL DEFAULT 0,
  `total_valid_amount` double NOT NULL DEFAULT 0,
  `parsed_rows_json` longtext NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'parsed',
  `submission_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_imp_user` (`user_id`),
  KEY `fk_imp_unit` (`unit_id`),
  KEY `fk_imp_sub` (`submission_id`),
  CONSTRAINT `fk_imp_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_imp_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_imp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excel_imports`
--

LOCK TABLES `excel_imports` WRITE;
/*!40000 ALTER TABLE `excel_imports` DISABLE KEYS */;
/*!40000 ALTER TABLE `excel_imports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lpj_documents`
--

DROP TABLE IF EXISTS `lpj_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lpj_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lpj_id` int(11) NOT NULL,
  `checklist_item` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL DEFAULT 0,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `note` varchar(255) NOT NULL DEFAULT '',
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_lpj_docs_lpj` (`lpj_id`),
  CONSTRAINT `fk_lpj_docs_lpj` FOREIGN KEY (`lpj_id`) REFERENCES `lpjs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lpj_documents`
--

LOCK TABLES `lpj_documents` WRITE;
/*!40000 ALTER TABLE `lpj_documents` DISABLE KEYS */;
INSERT INTO `lpj_documents` VALUES (1,4,'Kuitansi asli bermeterai','Kuitansi_Bermeterai_LPJ_001.pdf','/uploads/lpj/Kuitansi_Bermeterai_LPJ_001.pdf',840000,1,'Sah & bermeterai Rp 10.000','2025-02-08 09:30:00'),(2,4,'Faktur / nota pembelian','Faktur_Pembelian_LPJ_001.pdf','/uploads/lpj/Faktur_Pembelian_LPJ_001.pdf',620000,1,'Sesuai RAB','2025-02-08 09:35:00'),(3,4,'Berita acara kegiatan','BAP_Kegiatan_LPJ_001.pdf','/uploads/lpj/BAP_Kegiatan_LPJ_001.pdf',510000,1,'Terverifikasi SPI','2025-02-08 09:40:00'),(4,2,'Kuitansi asli bermeterai','Kuitansi_Semnas_LPJ_003.pdf','/uploads/lpj/Kuitansi_Semnas_LPJ_003.pdf',910000,0,'Menunggu verifikasi BKPU','2025-04-12 14:00:00');
/*!40000 ALTER TABLE `lpj_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lpjs`
--

DROP TABLE IF EXISTS `lpjs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lpjs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `disbursement_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(500) NOT NULL,
  `extra_label` varchar(150) NOT NULL DEFAULT 'Termin Tunggal',
  `dana_dicairkan` double NOT NULL DEFAULT 0,
  `realisasi_belanja` double NOT NULL DEFAULT 0,
  `silpa_amount` double NOT NULL DEFAULT 0,
  `silpa_proof_path` varchar(500) DEFAULT NULL,
  `docs_summary` varchar(150) NOT NULL DEFAULT '0 dari 6 Berkas',
  `progress` int(11) NOT NULL DEFAULT 0,
  `doc_note` varchar(255) NOT NULL DEFAULT 'Belum ada bukti diunggah',
  `doc_warn` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'draft',
  `bap_number` varchar(120) NOT NULL DEFAULT '',
  `submitted_at` datetime DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_lpj_sub` (`submission_id`),
  KEY `fk_lpj_disb` (`disbursement_id`),
  KEY `fk_lpj_unit` (`unit_id`),
  KEY `fk_lpj_user` (`user_id`),
  CONSTRAINT `fk_lpj_disb` FOREIGN KEY (`disbursement_id`) REFERENCES `disbursements` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_lpj_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lpj_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_lpj_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lpjs`
--

LOCK TABLES `lpjs` WRITE;
/*!40000 ALTER TABLE `lpjs` DISABLE KEYS */;
INSERT INTO `lpjs` VALUES (1,'LPJ-2025-004',1,NULL,1,1,'Workshop Pengembangan Modul Digital & Asesmen Autentik','Termin Tunggal',21000000,20850000,150000,NULL,'4 dari 6 Berkas',66,'2 Kuitansi belum diunggah',0,'draft','',NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(2,'LPJ-2025-003',4,2,1,1,'Seminar Nasional Pendidikan Islam & Publikasi','Deadline 10 Mei 2025',42500000,42500000,0,NULL,'14 Dokumen Lengkap',100,'Kuitansi + Faktur + Berita Acara',0,'verifikasi','','2025-04-12 14:15:00',NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(3,'LPJ-2025-002',3,1,1,1,'Pengadaan Media Pembelajaran Microteaching Lab','Sarpras Kampus',45500000,44900000,600000,NULL,'8 Dokumen (Ada Catatan)',83,'Bukti potong PPh 21 belum distempel mitra percetakan',1,'revisi','','2025-02-28 16:30:00',NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(4,'LPJ-2025-001',4,2,1,1,'Pelatihan Penulisan Jurnal Bereputasi','BAP: 042/BAP-LPJ/ADZ/2025',35000000,35000000,0,NULL,'12 Dokumen Lengkap',100,'Arsip Disahkan SPI & WR II',0,'disetujui','042/BAP-LPJ/ADZ/2025','2025-02-08 10:00:00','2025-02-10 11:05:00','2026-11-27 15:00:42','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `lpjs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `role_target` varchar(64) DEFAULT NULL,
  `category` varchar(64) NOT NULL DEFAULT 'info',
  `tag` varchar(100) NOT NULL DEFAULT 'INFO',
  `tag_tone` varchar(32) NOT NULL DEFAULT 'sky',
  `ref_code` varchar(120) NOT NULL DEFAULT '',
  `title` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `footnote` varchar(500) NOT NULL DEFAULT '',
  `accent` varchar(32) NOT NULL DEFAULT 'navy',
  `icon` varchar(64) NOT NULL DEFAULT 'megaphone',
  `critical` tinyint(1) NOT NULL DEFAULT 0,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `actions_json` varchar(2000) NOT NULL DEFAULT '[]',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_notif_user` (`user_id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'unit_prodi','tindakan','PERLU TINDAKAN','maroon','Ref: PGMI-2025-004','Catatan Revisi dari BKPU: Pengajuan Workshop Pengembangan Modul Digital','Verifikator Anggaran (Ahmad Zaky, S.E.) meminta penyesuaian komponen **honorarium narasumber eksternal** agar merujuk ke SBM Kemendikbudristek TA 2024. Pagu usulan melebihi standar Rp 1.500.000/jam. Batas submit revisi: **25 April 2025**.','','maroon','alert',0,0,'[{\"label\":\"Buka & Perbaiki Revisi\",\"to\":\"/dashboard/unit/pengajuan/PGMI-2025-004\",\"primary\":\"maroon\"}]','2025-04-19 10:15:00'),(2,1,'unit_prodi','keuangan','PENCAIRAN KASIR','navy','SP2D: 0092/SP2D-KU/ADZ/2025','Pencairan Dana Termin 2 Berhasil Ditransfer (Kasir Rektorat)','Dana pelaksanaan kegiatan **Seminar Nasional Pendidikan Islam & Publikasi Bereputasi (Ref: PGMI-2025-001)** sebesar **Rp 42.500.000** telah didelegasikan dan masuk ke BSI Virtual Account Operasional PGMI (VA: 8871092831).','','slate','wallet',0,0,'[{\"label\":\"Lihat Bukti Transfer & SP2D\",\"to\":\"/dashboard/unit/pencairan/PC-2025-003\",\"primary\":\"navy\"}]','2025-04-19 08:00:00'),(3,1,'unit_prodi','tindakan','BATAS WAKTU LPJ','red','Kegiatan Selesai: 28 Maret 2025','Pengingat Batas Akhir Unggah LPJ: Sisa 22 Hari','Sesuai Standar Operasional Keuangan No. 04/UN-ADZ/PR/2024, kegiatan **Seminar Nasional Pendidikan Islam** wajib melengkapi kuitansi asli bermeterai, BAP, serta daftar hadir peserta maksimal tanggal **10 Mei 2025**.','','red','calendar',1,0,'[{\"label\":\"Unggah Dokumen LPJ Sekarang\",\"to\":\"/dashboard/unit/laporan-spj/LPJ-2025-003\",\"primary\":\"navy\"}]','2025-04-19 08:15:00'),(4,1,'unit_prodi','keuangan','DISETUJUI WR II','sky','SK No: 088/UN-ADZ/KU/2025','Persetujuan Usulan Anggaran oleh Wakil Rektor II Bidang Keuangan','Usulan **Pengadaan Media Pembelajaran Microteaching Lab (PGMI-2025-002)** telah ditandatangani secara elektronik dan disetujui penuh senilai **Rp 65.000.000**.','','navy','badge',0,1,'[{\"label\":\"Lihat Salinan SK\",\"to\":\"/dashboard/unit/pengajuan/PGMI-2025-002\"}]','2025-04-18 14:20:00');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `token` varchar(128) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `fk_pwreset_user` (`user_id`),
  CONSTRAINT `fk_pwreset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(64) NOT NULL,
  `module` varchar(120) NOT NULL,
  `can_view` tinyint(1) NOT NULL DEFAULT 0,
  `can_create` tinyint(1) NOT NULL DEFAULT 0,
  `can_edit` tinyint(1) NOT NULL DEFAULT 0,
  `can_delete` tinyint(1) NOT NULL DEFAULT 0,
  `can_verify` tinyint(1) NOT NULL DEFAULT 0,
  `can_approve` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_role_module` (`role`,`module`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,'unit_prodi','Usulan RKAT',1,1,1,1,0,0),(2,'unit_prodi','Verifikasi Dokumen',1,0,0,0,0,0),(3,'unit_prodi','Persetujuan SK',1,0,0,0,0,0),(4,'unit_prodi','Permintaan Pencairan',1,1,0,0,0,0),(5,'unit_prodi','LPJ & Pajak',1,1,1,0,0,0),(6,'unit_prodi','Manajemen Akun',0,0,0,0,0,0),(7,'bkpu','Usulan RKAT',1,0,0,0,1,0),(8,'bkpu','Verifikasi Dokumen',1,1,1,0,1,0),(9,'bkpu','Persetujuan SK',1,0,0,0,0,0),(10,'bkpu','Permintaan Pencairan',1,0,1,0,1,0),(11,'bkpu','LPJ & Pajak',1,0,0,0,1,0),(12,'bkpu','Manajemen Akun',0,0,0,0,0,0),(13,'wakil_rektor_2','Usulan RKAT',1,0,0,0,1,1),(14,'wakil_rektor_2','Verifikasi Dokumen',1,0,0,0,1,1),(15,'wakil_rektor_2','Persetujuan SK',1,1,1,0,1,1),(16,'wakil_rektor_2','Permintaan Pencairan',1,0,0,0,1,1),(17,'wakil_rektor_2','LPJ & Pajak',1,0,0,0,1,1),(18,'wakil_rektor_2','Manajemen Akun',0,0,0,0,0,0),(19,'yayasan','Usulan RKAT',1,0,0,0,0,1),(20,'yayasan','Verifikasi Dokumen',1,0,0,0,0,0),(21,'yayasan','Persetujuan SK',1,0,0,0,0,1),(22,'yayasan','Permintaan Pencairan',1,0,1,0,1,1),(23,'yayasan','LPJ & Pajak',1,0,0,0,1,0),(24,'yayasan','Manajemen Akun',0,0,0,0,0,0),(25,'rektor','Usulan RKAT',1,0,0,0,0,1),(26,'rektor','Verifikasi Dokumen',1,0,0,0,0,0),(27,'rektor','Persetujuan SK',1,1,0,0,0,1),(28,'rektor','Permintaan Pencairan',1,0,0,0,0,1),(29,'rektor','LPJ & Pajak',1,0,0,0,0,0),(30,'rektor','Manajemen Akun',0,0,0,0,0,0),(31,'administrator','Usulan RKAT',1,0,0,0,0,0),(32,'administrator','Verifikasi Dokumen',1,0,0,0,0,0),(33,'administrator','Persetujuan SK',1,0,0,0,0,0),(34,'administrator','Permintaan Pencairan',1,0,0,0,0,0),(35,'administrator','LPJ & Pajak',1,0,0,0,0,0),(36,'administrator','Manajemen Akun',1,1,1,1,1,1);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbm_tariffs`
--

DROP TABLE IF EXISTS `sbm_tariffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sbm_tariffs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component` varchar(255) NOT NULL,
  `unit` varchar(64) NOT NULL,
  `max_rate` double NOT NULL,
  `spend_category` varchar(100) NOT NULL,
  `year` varchar(16) NOT NULL DEFAULT '2024',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbm_tariffs`
--

LOCK TABLES `sbm_tariffs` WRITE;
/*!40000 ALTER TABLE `sbm_tariffs` DISABLE KEYS */;
INSERT INTO `sbm_tariffs` VALUES (1,'Honorarium narasumber eksternal','per jam',1500000,'Honorarium','2024'),(2,'Honorarium moderator','per sesi',750000,'Honorarium','2024'),(3,'Konsumsi makan siang','per kotak',45000,'Konsumsi','2024'),(4,'Snack / coffee break','per kotak',25000,'Konsumsi','2024'),(5,'Sewa ruang pertemuan','per hari',1500000,'Sewa Alat','2024'),(6,'Transport lokal panitia','per orang',150000,'Perjalanan','2024');
/*!40000 ALTER TABLE `sbm_tariffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_documents`
--

DROP TABLE IF EXISTS `submission_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submission_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `doc_type` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL DEFAULT 0,
  `mime_type` varchar(100) NOT NULL DEFAULT 'application/pdf',
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_sub_docs_sub` (`submission_id`),
  CONSTRAINT `fk_sub_docs_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_documents`
--

LOCK TABLES `submission_documents` WRITE;
/*!40000 ALTER TABLE `submission_documents` DISABLE KEYS */;
INSERT INTO `submission_documents` VALUES (1,4,'Proposal','Proposal_Semnas_Pendidikan_Islam_2025.pdf','/uploads/docs/Proposal_Semnas_Pendidikan_Islam_2025.pdf',1420800,'application/pdf','2025-03-28 07:45:00'),(2,4,'KAK/TOR','TOR_KAK_Semnas_PGMI_2025.pdf','/uploads/docs/TOR_KAK_Semnas_PGMI_2025.pdf',892400,'application/pdf','2025-03-28 07:46:00'),(3,4,'Surat Permohonan','Surat_Permohonan_Kaprodi_PGMI_001.pdf','/uploads/docs/Surat_Permohonan_Kaprodi_PGMI_001.pdf',412000,'application/pdf','2025-03-28 07:47:00'),(4,3,'Proposal','Proposal_Pengadaan_Microteaching_Lab.pdf','/uploads/docs/Proposal_Pengadaan_Microteaching_Lab.pdf',1650000,'application/pdf','2025-04-04 07:50:00'),(5,3,'KAK/TOR','TOR_Spesifikasi_Teknis_Microteaching.pdf','/uploads/docs/TOR_Spesifikasi_Teknis_Microteaching.pdf',980000,'application/pdf','2025-04-04 07:52:00'),(6,1,'Proposal','Proposal_Workshop_Modul_Digital_AI.pdf','/uploads/docs/Proposal_Workshop_Modul_Digital_AI.pdf',1245000,'application/pdf','2025-04-18 08:45:00');
/*!40000 ALTER TABLE `submission_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_items`
--

DROP TABLE IF EXISTS `submission_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submission_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `account_code` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `spec` varchar(500) NOT NULL DEFAULT '',
  `spend_category` varchar(100) NOT NULL DEFAULT 'Lain-lain',
  `qty` double NOT NULL DEFAULT 1,
  `unit` varchar(64) NOT NULL DEFAULT 'Paket',
  `price` double NOT NULL DEFAULT 0,
  `subtotal` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_sub_items_sub` (`submission_id`),
  CONSTRAINT `fk_sub_items_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_items`
--

LOCK TABLES `submission_items` WRITE;
/*!40000 ALTER TABLE `submission_items` DISABLE KEYS */;
INSERT INTO `submission_items` VALUES (1,1,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',10000000,10000000),(2,1,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',7500000,7500000),(3,1,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',5000000,5000000),(4,1,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',2500000,2500000),(5,2,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',16200000,16200000),(6,2,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',12150000,12150000),(7,2,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',8100000,8100000),(8,2,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',4050000,4050000),(9,3,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',26000000,26000000),(10,3,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',19500000,19500000),(11,3,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',13000000,13000000),(12,3,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',6500000,6500000),(13,4,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',34000000,34000000),(14,4,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',25500000,25500000),(15,4,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',17000000,17000000),(16,4,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',8500000,8500000),(17,5,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',7400000,7400000),(18,5,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',5550000,5550000),(19,5,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',3700000,3700000),(20,5,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',1850000,1850000),(21,6,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',16600000,16600000),(22,6,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',12450000,12450000),(23,6,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',8300000,8300000),(24,6,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',4150000,4150000),(25,7,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',8800000,8800000),(26,7,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',6600000,6600000),(27,7,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',4400000,4400000),(28,7,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',2200000,2200000),(29,8,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',5200000,5200000),(30,8,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',3900000,3900000),(31,8,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',2600000,2600000),(32,8,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',1300000,1300000),(33,9,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',23200000,23200000),(34,9,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',17400000,17400000),(35,9,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',11600000,11600000),(36,9,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',5800000,5800000),(37,10,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',13000000,13000000),(38,10,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',9750000,9750000),(39,10,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',6500000,6500000),(40,10,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',3250000,3250000),(41,11,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',18000000,18000000),(42,11,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',13500000,13500000),(43,11,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',9000000,9000000),(44,11,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',4500000,4500000),(45,12,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',7280000,7280000),(46,12,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',5460000,5460000),(47,12,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',3640000,3640000),(48,12,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',1820000,1820000),(49,13,'5.2.1.01','Honorarium narasumber & pemateri','Sesuai SBM','Honorarium',1,'Paket',2200000,2200000),(50,13,'5.2.1.02','Konsumsi kegiatan','Snack & makan siang','Konsumsi',1,'Paket',1650000,1650000),(51,13,'5.2.2.01','ATK, modul & sertifikat','Paket peserta','ATK & Bahan',1,'Paket',1100000,1100000),(52,13,'5.2.3.01','Sewa perangkat & dokumentasi','Audio visual','Sewa Alat',1,'Paket',550000,550000);
/*!40000 ALTER TABLE `submission_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_timelines`
--

DROP TABLE IF EXISTS `submission_timelines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submission_timelines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `actor_role` varchar(64) NOT NULL DEFAULT '',
  `action` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `tone` varchar(32) NOT NULL DEFAULT 'slate',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_sub_tl_sub` (`submission_id`),
  KEY `fk_sub_tl_actor` (`actor_id`),
  CONSTRAINT `fk_sub_tl_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_tl_sub` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_timelines`
--

LOCK TABLES `submission_timelines` WRITE;
/*!40000 ALTER TABLE `submission_timelines` DISABLE KEYS */;
INSERT INTO `submission_timelines` VALUES (1,1,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi dan masuk antrean verifikasi.','slate','2025-04-18 09:00:00'),(2,1,2,'bkpu','revisi','Catatan Revisi Ditambahkan','Verifikator BKPU: Sesuaikan honorarium narasumber eksternal dengan SBM Kemendikbudristek TA 2024 (maks. Rp 1.500.000/jam).','amber','2025-04-19 10:15:00'),(3,2,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(4,2,2,'bkpu','verify','Menunggu Telaah WR II','BKPU Disetujui (16 Apr) • Antrean Telaah WR2','slate','2025-04-16 11:00:00'),(5,3,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-04 08:00:00'),(6,3,2,'bkpu','verify','Verifikasi BKPU Selesai','Rincian RAB sesuai SBM Universitas Adzkia.','slate','2025-04-10 10:00:00'),(7,3,3,'wakil_rektor_2','approve','Persetujuan WR II','Usulan disetujui penuh. SK: 088/UN-ADZ/KU/2025 • Siap Pencairan T1.','green','2025-04-15 09:00:00'),(8,4,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-04 08:00:00'),(9,4,2,'bkpu','verify','Verifikasi BKPU Selesai','Rincian RAB sesuai SBM Universitas Adzkia.','slate','2025-04-10 10:00:00'),(10,4,3,'wakil_rektor_2','approve','Persetujuan WR II','Usulan disetujui penuh. SK: 042/UN-ADZ/KU/2025 • Realisasi 100%.','green','2025-04-15 09:00:00'),(11,5,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-04 08:00:00'),(12,5,2,'bkpu','verify','Verifikasi BKPU Selesai','Rincian RAB sesuai SBM Universitas Adzkia.','slate','2025-04-10 10:00:00'),(13,5,3,'wakil_rektor_2','approve','Persetujuan WR II','Usulan disetujui penuh. SK: 051/UN-ADZ/KU/2025 • Realisasi 100%.','green','2025-04-15 09:00:00'),(14,6,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-04 08:00:00'),(15,6,2,'bkpu','verify','Verifikasi BKPU Selesai','Rincian RAB sesuai SBM Universitas Adzkia.','slate','2025-04-10 10:00:00'),(16,6,3,'wakil_rektor_2','approve','Persetujuan WR II','Usulan disetujui penuh. SK: 060/UN-ADZ/KU/2025 • Siap Pencairan T1.','green','2025-04-15 09:00:00'),(17,7,1,'unit_prodi','draft','Draft Disimpan','Kelengkapan data 75%. Lengkapi sebelum diajukan.','slate','2025-04-17 11:00:00'),(18,8,1,'unit_prodi','draft','Draft Disimpan','Kelengkapan data 40%. Lengkapi sebelum diajukan.','slate','2025-04-17 11:00:00'),(19,9,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(20,9,2,'bkpu','verify','Menunggu Telaah WR II','Antrean Verifikasi BKPU','slate','2025-04-16 11:00:00'),(21,10,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(22,10,2,'bkpu','verify','Menunggu Telaah WR II','Antrean Verifikasi BKPU','slate','2025-04-16 11:00:00'),(23,11,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(24,11,2,'bkpu','verify','Menunggu Telaah WR II','Sedang Ditelaah BKPU','slate','2025-04-16 11:00:00'),(25,12,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(26,12,2,'bkpu','verify','Menunggu Telaah WR II','Antrean Verifikasi BKPU','slate','2025-04-16 11:00:00'),(27,13,1,'unit_prodi','submit','Diajukan ke BKPU','Usulan diajukan oleh Kaprodi.','slate','2025-04-15 10:00:00'),(28,13,2,'bkpu','verify','Menunggu Telaah WR II','Antrean Verifikasi BKPU','slate','2025-04-16 11:00:00');
/*!40000 ALTER TABLE `submission_timelines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `period_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(500) NOT NULL,
  `pic` varchar(255) NOT NULL,
  `category` varchar(150) NOT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'Pagu Unit',
  `start_date` varchar(32) NOT NULL DEFAULT '',
  `end_date` varchar(32) NOT NULL DEFAULT '',
  `background` text DEFAULT NULL,
  `total_amount` double NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'draft',
  `workflow_stage` varchar(64) NOT NULL DEFAULT 'draft',
  `locked` tinyint(1) NOT NULL DEFAULT 0,
  `phase` varchar(32) DEFAULT NULL,
  `position_label` varchar(255) NOT NULL DEFAULT '',
  `revision_note` text DEFAULT NULL,
  `sk_number` varchar(120) NOT NULL DEFAULT '',
  `completeness` int(11) NOT NULL DEFAULT 0,
  `completeness_note` varchar(255) NOT NULL DEFAULT '',
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_sub_period` (`period_id`),
  KEY `fk_sub_unit` (`unit_id`),
  KEY `fk_sub_user` (`user_id`),
  CONSTRAINT `fk_sub_period` FOREIGN KEY (`period_id`) REFERENCES `budget_periods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (1,'PGMI-2025-004',1,1,1,'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI untuk Guru Madrasah','Dr. Rahmat Hidayat, M.Pd','Akademik & Kurikulum','Pagu Prodi PGMI','2025-05-10','2025-05-12','Peningkatan kompetensi guru madrasah dalam menyusun modul ajar digital dan asesmen autentik berbasis kecerdasan buatan.',25000000,'revisi','revisi_unit',0,NULL,'Dikembalikan oleh BKPU (Perlu Revisi)','Sesuaikan honorarium narasumber eksternal dengan SBM Kemendikbudristek TA 2024 (maks. Rp 1.500.000/jam).','',100,'','2025-04-18 09:00:00',NULL,'2025-04-18 08:30:00','2026-11-27 15:00:42'),(2,'PGMI-2025-003',1,1,1,'Praktek Pengalaman Lapangan (PPL) Mahasiswa PGMI','Siti Aminah, M.Pd','Kemahasiswaan','Pagu Terpusat FTK','2025-05-20','2025-06-20','Pelaksanaan PPL mahasiswa PGMI semester genap pada madrasah mitra di Kota Padang.',40500000,'verifikasi','wr2_review',1,NULL,'BKPU Disetujui (16 Apr) • Antrean Telaah WR2','','',100,'','2025-04-15 10:00:00',NULL,'2025-04-15 09:15:00','2026-11-27 15:00:42'),(3,'PGMI-2025-002',1,1,1,'Pengadaan Media Pembelajaran Microteaching Lab','Nurul Hasanah, M.Pd','Sarpras & Lab','Pagu Investasi Sarpras','2025-04-10','2025-04-25','Pengadaan perangkat audio visual dan media pembelajaran interaktif untuk laboratorium microteaching PGMI.',65000000,'disetujui','approved',0,'cairkan','SK: 088/UN-ADZ/KU/2025 • Siap Pencairan T1','','088/UN-ADZ/KU/2025',100,'','2025-04-04 08:00:00','2025-04-15 09:00:00','2025-04-04 07:45:00','2026-11-27 15:00:42'),(4,'PGMI-2025-001',1,1,1,'Seminar Nasional Pendidikan Islam & Publikasi Bereputasi','Ahmad Fauzan, M.Ag','Penelitian & Publikasi','Pagu Prodi + Mitra','2025-03-28','2025-03-29','Seminar nasional tahunan bidang pendidikan Islam serta pendampingan publikasi artikel ilmiah bereputasi.',85000000,'disetujui','approved',0,'lpj','SK: 042/UN-ADZ/KU/2025 • Realisasi 100%','','042/UN-ADZ/KU/2025',100,'','2025-03-28 08:00:00','2025-04-01 10:00:00','2025-03-28 07:30:00','2026-11-27 15:00:42'),(5,'PGMI-2025-005',1,1,1,'Review Kurikulum Berbasis OBE','Dr. Rahmat Hidayat, M.Pd','Akademik & Kurikulum','Pagu Prodi PGMI','2025-03-20','2025-03-21','Lokakarya peninjauan kurikulum Prodi PGMI berbasis Outcome-Based Education (OBE).',18500000,'disetujui','approved',0,'lpj','SK: 051/UN-ADZ/KU/2025 • Realisasi 100%','','051/UN-ADZ/KU/2025',100,'','2025-03-20 09:00:00','2025-03-25 11:00:00','2025-03-20 08:30:00','2026-11-27 15:00:42'),(6,'PGMI-2025-006',1,1,1,'Seminar Nasional Pendidikan Dasar','Ahmad Fauzan, M.Ag','Penelitian & Publikasi','Pagu Prodi + Mitra','2025-03-12','2025-03-13','Forum ilmiah nasional inovasi pembelajaran pendidikan dasar abad 21.',41500000,'disetujui','approved',0,'cairkan','SK: 060/UN-ADZ/KU/2025 • Siap Pencairan T1','','060/UN-ADZ/KU/2025',100,'','2025-03-12 08:30:00','2025-03-18 14:00:00','2025-03-12 08:00:00','2026-11-27 15:00:42'),(7,'PGMI-2025-D02',1,1,1,'Pengadaan Media Pembelajaran Kelas','Nurul Hasanah, M.Pd','Sarpras & Lab','Pagu Investasi Sarpras','2025-05-05','2025-05-15','Pengadaan proyektor dan papan tulis interaktif ruang kuliah PGMI.',22000000,'draft','draft',0,NULL,'Draft Tersimpan','','',75,'',NULL,NULL,'2025-04-19 10:00:00','2026-11-27 15:00:42'),(8,'PGMI-2025-D01',1,1,1,'Kuliah Pakar: Inovasi Pembelajaran','Hendri Pratama, M.Pd','Akademik & Kurikulum','Pagu Prodi PGMI','2025-05-18','2025-05-18','Kuliah pakar menghadirkan praktisi pendidikan nasional.',13000000,'draft','draft',0,NULL,'Draft Tersimpan','','',40,'(RAB Kosong)',NULL,NULL,'2025-04-17 11:00:00','2026-11-27 15:00:42'),(9,'TI-2025-008',1,2,1,'Pengadaan Upgrade Node Server Lab Komputer','Fauzan Hakim, M.Kom','Sarpras & Lab','Pagu Investasi Sarpras','2025-05-01','2025-05-15','Upgrade kapasitas node server laboratorium komputer Prodi Informatika.',58000000,'verifikasi','bkpu_review',1,NULL,'Antrean Verifikasi BKPU','','',100,'','2025-04-16 11:20:00',NULL,'2025-04-16 11:00:00','2026-11-27 15:00:42'),(10,'MNJ-2025-012',1,4,1,'Benchmarking Kurikulum MBKM ke Universitas Mitra','Rina Anggraini, S.E., M.M.','Akademik & Kurikulum','Pagu Prodi Manajemen','2025-05-12','2025-05-14','Kunjungan benchmarking kurikulum MBKM dan kolaborasi industri.',32500000,'verifikasi','bkpu_review',1,NULL,'Antrean Verifikasi BKPU','','',100,'','2025-04-17 15:40:00',NULL,'2025-04-17 15:00:00','2026-11-27 15:00:42'),(11,'LPPM-2025-003',1,9,1,'Hibah Penelitian Dosen Pemula (PDP)','Prof. Hendra Saputra, M.Sc.','Penelitian & Publikasi','Pagu Riset Internal','2025-05-01','2025-08-30','Pendanaan hibah penelitian dosen pemula tingkat universitas.',45000000,'verifikasi','bkpu_review',1,NULL,'Sedang Ditelaah BKPU','','',100,'','2025-04-17 10:11:00',NULL,'2025-04-17 09:50:00','2026-11-27 15:00:42'),(12,'BAAK-2025-002',1,10,1,'Wisuda Sarjana & Magister Periode XI','M. Ilham, S.Kom.','Kemahasiswaan','Pagu Operasional Rektorat','2025-06-10','2025-06-11','Penyelenggaraan rapat senat terbuka wisuda sarjana dan magister.',18200000,'verifikasi','bkpu_review',1,NULL,'Antrean Verifikasi BKPU','','',100,'','2025-04-18 08:30:00',NULL,'2025-04-18 08:00:00','2026-11-27 15:00:42'),(13,'PAI-2025-009',1,8,1,'Pelatihan Metodologi Tafsir Tematik','Ust. Zulkifli, M.Ag.','Akademik & Kurikulum','Pagu Prodi PAI','2025-05-22','2025-05-23','Pelatihan metodologi tafsir tematik bagi dosen dan mahasiswa PAI.',5500000,'verifikasi','bkpu_review',1,NULL,'Antrean Verifikasi BKPU','','',100,'','2025-04-18 09:05:00',NULL,'2025-04-18 08:45:00','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_configs`
--

DROP TABLE IF EXISTS `system_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_configs` (
  `key` varchar(120) NOT NULL,
  `tab` varchar(120) NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_configs`
--

LOCK TABLES `system_configs` WRITE;
/*!40000 ALTER TABLE `system_configs` DISABLE KEYS */;
INSERT INTO `system_configs` VALUES ('app_name','Umum & Institusi','Nama Aplikasi','E-Budgeting Universitas Adzkia Padang','2026-11-27 15:00:42'),('bsi_va_prefix','Integrasi Gateway','Prefix BSI Virtual Account','887109','2026-11-27 15:00:42'),('currency','Umum & Institusi','Mata Uang','Rupiah Indonesia (IDR)','2026-11-27 15:00:42'),('lpj_termin2_threshold','Notifikasi & Scheduler','Minimal Verifikasi LPJ Termin 1 (%)','80','2026-11-27 15:00:42'),('min_password_length','Keamanan & Password','Panjang Minimal Password','8','2026-11-27 15:00:42'),('office_address','Umum & Institusi','Lokasi Tata Usaha','Gedung Rektorat Lt. 2, Kampus Universitas Adzkia Padang','2026-11-27 15:00:42'),('require_2fa_high_value','Keamanan & Password','Wajib 2FA di atas nominal (Rp)','10000000','2026-11-27 15:00:42'),('version','Umum & Institusi','Versi Sistem','v2.4.0-ERP','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `system_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_faculty` varchar(255) NOT NULL DEFAULT '',
  `type` varchar(64) NOT NULL DEFAULT 'Program Studi',
  `head_name` varchar(255) NOT NULL DEFAULT '',
  `bsi_account` varchar(64) NOT NULL DEFAULT '',
  `bsi_bank_name` varchar(255) NOT NULL DEFAULT 'BSI Virtual Account Operasional',
  `pagu_allocated` double NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'aktif',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'prodi-pgmi','Program Studi Pendidikan Guru Madrasah Ibtidaiyah (PGMI)','Fakultas Tarbiyah & Keguruan','Program Studi','Dr. Rahmat Hidayat, M.Pd','8871092831','BSI Virtual Account Operasional PGMI',450000000,'aktif','2026-11-27 15:00:42'),(2,'prodi-informatika','Program Studi Informatika','Fakultas Sains & Teknologi','Program Studi','Dr. Budi Santoso, M.Kom','8871092832','BSI Virtual Account Operasional Informatika',400000000,'aktif','2026-11-27 15:00:42'),(3,'prodi-sistem-informasi','Program Studi Sistem Informasi','Fakultas Sains & Teknologi','Program Studi','Siti Rahma, M.Kom','8871092833','BSI Virtual Account Operasional SI',350000000,'aktif','2026-11-27 15:00:42'),(4,'prodi-manajemen','Program Studi Manajemen','Fakultas Ekonomi & Bisnis','Program Studi','Hendri Pratama, M.M','8871092834','BSI Virtual Account Operasional Manajemen',380000000,'aktif','2026-11-27 15:00:42'),(5,'prodi-akuntansi','Program Studi Akuntansi','Fakultas Ekonomi & Bisnis','Program Studi','Nurul Hasanah, M.Ak','8871092835','BSI Virtual Account Operasional Akuntansi',360000000,'aktif','2026-11-27 15:00:42'),(6,'unit-bapk','Biro Administrasi Perencanaan & Keuangan (BAPK)','Rektorat','Biro','Ahmad Zaky, S.E.','8871092840','BSI Virtual Account BAPK',500000000,'aktif','2026-11-27 15:00:42'),(7,'unit-perpustakaan','Perpustakaan','Rektorat','Lembaga','Dra. Halimah','8871092841','BSI Virtual Account Perpustakaan',250000000,'aktif','2026-11-27 15:00:42'),(8,'prodi-pai','Program Studi Pendidikan Agama Islam (PAI)','Fakultas Tarbiyah & Keguruan','Program Studi','Ust. Zulkifli, M.Ag.','8871092842','BSI Virtual Account Operasional PAI',320000000,'aktif','2026-11-27 15:00:42'),(9,'unit-lppm','Lembaga Penelitian & Pengabdian Masyarakat (LPPM)','Rektorat','Lembaga','Prof. Hendra Saputra, M.Sc.','8871092843','BSI Virtual Account LPPM',450000000,'aktif','2026-11-27 15:00:42'),(10,'unit-baak','Biro Administrasi Akademik & Kemahasiswaan (BAAK)','Rektorat','Biro','M. Ilham, S.Kom.','8871092844','BSI Virtual Account BAAK',300000000,'aktif','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token_jti` varchar(128) NOT NULL,
  `device` varchar(255) NOT NULL,
  `ip_address` varchar(64) NOT NULL DEFAULT '127.0.0.1',
  `location` varchar(150) NOT NULL DEFAULT 'Jaringan Kampus',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_active_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_jti` (`token_jti`),
  KEY `fk_sessions_user` (`user_id`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nidn` varchar(100) NOT NULL DEFAULT '',
  `rank` varchar(150) NOT NULL DEFAULT '',
  `employment_status` varchar(150) NOT NULL DEFAULT '',
  `phone` varchar(64) NOT NULL DEFAULT '',
  `role` varchar(64) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'aktif',
  `twofa_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `whatsapp_notif` tinyint(1) NOT NULL DEFAULT 1,
  `revisi_notif` tinyint(1) NOT NULL DEFAULT 1,
  `photo_url` varchar(500) DEFAULT NULL,
  `signature_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_unit` (`unit_id`),
  CONSTRAINT `fk_users_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'unit','unit@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Dr. Rahmat Hidayat, M.Pd','1024088501 / 198508242011011002','Pembina (IV/a) / Lektor Kepala','Dosen Tetap Yayasan (TMT: 01-01-2011)','+62 812-6789-0123','unit_prodi',1,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(2,'bkpu','bkpu@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Staf BKPU','198803152015011001','Penata (III/c) / Verifikator Keuangan','Pegawai Tetap Yayasan','+62 812-3456-7890','bkpu',6,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(3,'wr2','wr2@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Wakil Rektor II','197804122005011003','Pembina Utama Muda (IV/c)','Dosen Tetap Yayasan','+62 811-6677-8899','wakil_rektor_2',NULL,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(4,'yayasan','yayasan@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Pengurus Yayasan','197001012000011001','Bendahara Yayasan','Pengurus Yayasan Adzkia','+62 811-2233-4455','yayasan',NULL,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(5,'rektor','rektor@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Rektor','196905201998031002','Guru Besar (IV/e)','Rektor Universitas Adzkia','+62 811-1122-3344','rektor',NULL,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42'),(6,'admin','admin@adzkia.ac.id','$2b$10$D2QZ9wvsMi.J5YrZeNZe8eYVsUB9AP99MDeEjdEGpqap/t1tcqZf6','Administrator','199007182018011005','Super Admin Tier 1','Staf Sistem Informasi (BPSI)','+62 812-9988-7766','administrator',NULL,'aktif',1,1,1,NULL,NULL,'2026-11-27 15:00:42','2026-11-27 15:00:42');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'adzkia_ebudgeting'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-27 15:00:47
SET FOREIGN_KEY_CHECKS = 1;
