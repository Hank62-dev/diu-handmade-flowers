import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import mongoose from 'mongoose';
import { products } from '../products/product.data.js';
import { Order } from './order.model.js';
import { uploadPaymentProof } from '../../services/cloudinary.service.js';
import { sendNewOrderEmail } from '../../services/brevo.service.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });
export const orderRouter = Router();

orderRouter.post('/', rateLimit({ windowMs: 60_000, max: 10 }), upload.single('paymentProof'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Vui lòng tải ảnh xác nhận chuyển khoản' });
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'Cơ sở dữ liệu chưa sẵn sàng' });
    const idempotencyKey = String(req.headers['idempotency-key'] || '');
    if (!idempotencyKey) return res.status(400).json({ message: 'Thiếu idempotency key' });
    const existing = await Order.findOne({ idempotencyKey });
    if (existing) return res.status(200).json({ data: { orderNumber: existing.orderNumber, status: existing.status, replayed: true } });
    const { customerName, phone, email, address, note } = req.body;
    if (!customerName || !phone || !email || !address) return res.status(400).json({ message: 'Vui lòng điền đủ họ tên, email, số điện thoại và địa chỉ' });
    const requested = JSON.parse(req.body.items || '[]') as { productId: string; quantity: number }[];
    if (!requested.length) return res.status(400).json({ message: 'Giỏ hàng đang trống' });
    const lines = requested.map((item) => {
      const product = products.find((entry) => entry._id === item.productId && entry.isPublished && entry.stock > 0);
      if (!product || item.quantity < 1 || item.quantity > product.stock) throw new Error('Sản phẩm không còn đủ số lượng');
      return { ...product, quantity: item.quantity };
    });
    const subtotal = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `DIU-${Date.now().toString(36).toUpperCase()}`;
    const proof = await uploadPaymentProof(req.file);
    const order = await Order.create({ orderNumber, idempotencyKey, customerName, phone, email, address, note, subtotal, total: subtotal, paymentProofUrl: proof.url, paymentProofPublicId: proof.publicId, emailDelivery: { status: process.env.BREVO_API_KEY ? 'PENDING' : 'NOT_CONFIGURED', attempts: 0 }, items: lines.map((item) => ({ productId: item._id, name: item.name, price: item.price, quantity: item.quantity, image: item.image })), statusHistory: [{ status: 'PENDING', at: new Date(), by: 'customer' }] });
    try {
      const mail = await sendNewOrderEmail({ orderNumber, customerName, phone, address, total: subtotal, items: lines, paymentProofUrl: proof.url });
      await Order.updateOne({ _id: order._id }, { $set: { 'emailDelivery.status': mail.skipped ? 'NOT_CONFIGURED' : 'SENT', 'emailDelivery.sentAt': mail.sent ? new Date() : undefined }, $inc: { 'emailDelivery.attempts': 1 } });
    } catch (error) {
      await Order.updateOne({ _id: order._id }, { $set: { 'emailDelivery.status': 'FAILED', 'emailDelivery.lastError': error instanceof Error ? error.message : 'Unknown email error' }, $inc: { 'emailDelivery.attempts': 1 } });
    }
    return res.status(201).json({ data: { orderNumber: order.orderNumber, status: order.status } });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : 'Dữ liệu đơn hàng không hợp lệ' });
  }
});
