import crypto from 'node:crypto';
import type { RequestHandler } from 'express';

const secret = () => process.env.JWT_SECRET || 'development-only-change-me';
export function signAdminToken(email: string) { const payload = Buffer.from(JSON.stringify({ email, role: 'ADMIN', exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url'); const signature = crypto.createHmac('sha256', secret()).update(payload).digest('base64url'); return `${payload}.${signature}`; }
export function verifyAdminToken(token: string | undefined) { if (!token) return null; const [payload, signature] = token.split('.'); if (!payload || !signature) return null; const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url'); if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email: string; role: string; exp: number }; return data.exp > Date.now() && data.role === 'ADMIN' ? data : null; } catch { return null; } }
export const requireAdmin: RequestHandler = (req, res, next) => { const data = verifyAdminToken(req.headers.authorization?.replace(/^Bearer\s+/i, '')); if (!data) return res.status(401).json({ message: 'Phiên quản trị không hợp lệ hoặc đã hết hạn' }); res.locals.admin = data; return next(); };
