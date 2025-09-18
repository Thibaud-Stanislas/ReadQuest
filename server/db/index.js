// server/db/index.js
import 'dotenv/config';
import { Pool } from 'pg';

const { DATABASE_URL, PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL, ssl: false })
  : new Pool({
      host: PGHOST || 'localhost',
      port: Number(PGPORT) || 5432,
      database: PGDATABASE || 'readquest',
      user: PGUSER || 'postgres',
      password: PGPASSWORD || '',
      ssl: false
    });

export async function initDb() {
  await pool.query('SELECT 1');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Utilisateur" (
      id_utilisateur SERIAL PRIMARY KEY,
      pseudo VARCHAR(50),
      email VARCHAR(100) UNIQUE,
      mot_de_passe VARCHAR(255),
      avatar_url TEXT,
      date_inscription TIMESTAMP DEFAULT NOW(),
      niveau INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0
    );
  `);
  console.log('DB OK');
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id_utilisateur, email, mot_de_passe, pseudo, niveau, xp
       FROM "Utilisateur" WHERE email=$1`,
    [email]
  );
  return rows[0] || null;
}

export async function createUser({ email, passwordHash, pseudo = null, avatarUrl = null }) {
  const { rows } = await pool.query(
    `INSERT INTO "Utilisateur" (email, mot_de_passe, pseudo, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id_utilisateur, email, pseudo, date_inscription`,
    [email, passwordHash, pseudo, avatarUrl]
  );
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id_utilisateur, email, pseudo, date_inscription, niveau, xp
       FROM "Utilisateur" WHERE id_utilisateur=$1`,
    [id]
  );
  return rows[0] || null;
}