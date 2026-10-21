import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { productRouter } from './modules/products/product.routes.js';
import { orderRouter } from './modules/orders/order.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { paymentRouter } from './modules/payment/payment.routes.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl.split(',').map((origin) => origin.trim()) }));
  app.use(express.json({ limit: '1mb' }));
  app.get('/health', (_, res) => res.json({ ok: true, service: 'diu-api' }));
  app.use('/api/products', productRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/admin/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/payment', paymentRouter);
  app.use((_, res) => res.status(404).json({ message: 'Không tìm thấy endpoint' }));
  return app;
}
