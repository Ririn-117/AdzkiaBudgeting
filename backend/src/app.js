import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import masterRoutes from './routes/master.routes.js';
import submissionsRoutes from './routes/submissions.routes.js';
import importsRoutes from './routes/imports.routes.js';
import disbursementsRoutes from './routes/disbursements.routes.js';
import lpjsRoutes from './routes/lpjs.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminRoutes from './routes/admin.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(path.resolve(env.uploadDir)));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Adzkia E-Budgeting Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/master', masterRoutes);
  app.use('/api/submissions', submissionsRoutes);
  app.use('/api/imports', importsRoutes);
  app.use('/api/disbursements', disbursementsRoutes);
  app.use('/api/lpjs', lpjsRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
