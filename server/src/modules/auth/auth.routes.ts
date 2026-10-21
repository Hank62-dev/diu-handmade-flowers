import { Router } from 'express';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { signAdminToken, requireAdmin } from '../../middleware/auth.js';

export const authRouter = Router();
const hash = (value: string, salt: string) => crypto.scryptSync(value, salt, 64).toString('hex');

authRouter.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
  const { password } = req.body as { password?: string };
  const identity = process.env.ADMIN_EMAIL || 'admin';
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!password || (!expectedHash && !expectedPassword)) return res.status(503).json({ message: 'Admin auth chưa được cấu hình đầy đủ' });
  const salt = process.env.ADMIN_PASSWORD_SALT || 'diu-admin-salt';
  const valid = expectedHash ? hash(password, salt) === expectedHash : password === expectedPassword;
  if (!valid) return res.status(401).json({ message: 'Mật khẩu không đúng' });
  return res.json({ data: { token: signAdminToken(identity), email: identity, role: 'ADMIN' } });
});

authRouter.get('/me', requireAdmin, (req, res) => res.json({ data: res.locals.admin }));
