import { env } from './config/env.js';
import { seedIfEmpty } from './database/seed.js';
import { createApp } from './app.js';

seedIfEmpty();

const app = createApp();
app.listen(env.port, () => {
  console.log(`Adzkia E-Budgeting Backend listening on http://localhost:${env.port}`);
});
