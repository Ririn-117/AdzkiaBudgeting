import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from '../config/env.js';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createDiskStorage(subFolder) {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      const target = path.join(env.uploadDir, subFolder);
      ensureDir(target);
      cb(null, target);
    },
    filename(_req, file, cb) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safeName}`);
    },
  });
}

export const uploadPdf = multer({
  storage: createDiskStorage('documents'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      return cb(null, true);
    }
    cb(new Error('Hanya berkas PDF yang diterima (maks. 10 MB).'));
  },
});

export const uploadExcel = multer({
  storage: createDiskStorage('imports'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/\.(xlsx|xls|csv)$/i.test(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error('Format berkas harus .xlsx, .xls, atau .csv (maks. 10 MB).'));
  },
});

export const uploadEvidence = multer({
  storage: createDiskStorage('lpj'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/\.(pdf|png|jpe?g)$/i.test(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error('Berkas bukti harus berupa PDF, PNG, atau JPG (maks. 10 MB).'));
  },
});

export const uploadImage = multer({
  storage: createDiskStorage('profiles'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error('Berkas harus berupa gambar (PNG/JPG/WEBP, maks. 2 MB).'));
  },
});
