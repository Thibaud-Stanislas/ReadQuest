import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const token = req.cookies?.rq_token;
  if (!token) return res.status(401).json({ message: 'Non authentifié.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Session expirée.' });
  }
}
