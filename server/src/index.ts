import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

connectDatabase(env.mongoUri)
  .then(() => createApp().listen(env.port, () => console.log(`Dịu API listening on ${env.port}`)))
  .catch((error) => { console.error('MongoDB connection failed', error); process.exit(1); });
