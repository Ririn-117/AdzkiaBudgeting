import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });

export const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'adzkia_ebudgeting_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'adzkia_ebudgeting',
  dbPath: path.resolve(rootDir, process.env.DB_PATH || './data/ebudgeting.sqlite'),
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR || './uploads'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
