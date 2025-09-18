// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import { initDb, pool } from './db/index.js';

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const allowed = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

// Middlewares
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Routes API
app.use('/api/auth', authRoutes);

// Healthcheck (avec infos DB)
app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT current_database() AS db, current_user AS "user"');
    res.json({ ok: true, db: rows[0].db, user: rows[0].user });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// (Optionnel) Debug DB en dev uniquement
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/db', async (_req, res) => {
    const { rows } = await pool.query('SELECT current_database() AS db, current_user AS "user"');
    res.json({ ok: true, ...rows[0] });
  });
}

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Gestion d'erreurs
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrage robuste : on écoute même si initDb échoue (pour voir l'erreur)
initDb()
  .then(() => console.log('DB init OK'))
  .catch(err => console.error('DB init FAILED:', err.message))
  .finally(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API prête sur http://localhost:${PORT}`);
    });
  });