// server/routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById, createUser } from '../db/index.js';

const router = Router();

const COOKIE_NAME = process.env.COOKIE_NAME || 'rq_token';
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const IS_PROD = process.env.NODE_ENV === 'production';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    path: '/',
  });
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Non authentifié' });
    const decoded = jwt.verify(token, JWT_SECRET); // { id }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

/** REGISTER — garde si tu veux ton message "Compte créé." */
router.post('/register', async (req, res) => {
  try {
    const { email, password, pseudo } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const exists = await getUserByEmail(email);
    if (exists) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash, pseudo });

    // Auto-login
    const token = signToken({ id: user.id_utilisateur });
    setAuthCookie(res, token);

    // Réponse simple (compatible avec ton retour précédent)
    return res.status(201).json({ message: 'Compte créé.', id: user.id_utilisateur });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/** LOGIN */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }
    const existing = await getUserByEmail(email);
    if (!existing) return res.status(401).json({ error: 'Identifiants invalides.' });

    const ok = await bcrypt.compare(password, existing.mot_de_passe);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides.' });

    const token = signToken({ id: existing.id_utilisateur });
    setAuthCookie(res, token);

    return res.json({ message: 'Connecté.' });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

/** ME (profil courant) */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const me = await getUserById(req.user.id);
    if (!me) return res.status(404).json({ error: 'Utilisateur introuvable' });
    return res.json({ user: me });
  } catch (err) {
    console.error('[ME ERROR]', err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

/** LOGOUT */
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

export default router;