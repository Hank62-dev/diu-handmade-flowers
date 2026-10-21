import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../../middleware/auth.js';
import { products } from '../products/product.data.js';
import { Order } from '../orders/order.model.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get('/dashboard', async (_, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB chưa kết nối' });
  const [totalOrders, pendingOrders, processingOrders, completedOrders, revenue] = await Promise.all([Order.countDocuments(), Order.countDocuments({ status: 'PENDING' }), Order.countDocuments({ status: 'PROCESSING' }), Order.countDocuments({ status: 'COMPLETED' }), Order.aggregate([{ $match: { status: 'COMPLETED', paymentStatus: 'VERIFIED' } }, { $group: { _id: null, total: { $sum: '$total' } } }])]);
  return res.json({ data: { totalProducts: products.length, totalOrders, pendingOrders, processingOrders, completedOrders, revenue: revenue[0]?.total || 0 } });
});

adminRouter.get('/products', (_, res) => res.json({ data: products, meta: { page: 1, total: products.length, totalPages: 1 } }));
adminRouter.get('/orders', async (_, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB chưa kết nối' });
  const data = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
  return res.json({ data, meta: { page: 1, total: data.length, totalPages: 1 } });
});

adminRouter.get('/orders/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: 'MongoDB chưa kết nối' });
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  return res.json({ data: order });
});

adminRouter.patch('/orders/:id/status', async (req, res) => {
  const allowed = ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'];
  const { status } = req.body as { status?: string };
  if (!status || !allowed.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  if (status === 'PROCESSING' && order.status !== 'PENDING') return res.status(400).json({ message: 'Chỉ đơn chờ xử lý mới được chuyển sang đang xử lý' });
  if (status === 'COMPLETED' && order.paymentStatus !== 'VERIFIED') return res.status(400).json({ message: 'Chỉ được hoàn thành đơn sau khi xác minh thanh toán' });
  if (status === 'REJECTED' && order.status === 'COMPLETED') return res.status(400).json({ message: 'Không thể từ chối đơn đã hoàn thành' });
  order.status = status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  order.statusHistory.push({ status, at: new Date(), by: res.locals.admin.email });
  await order.save();
  return res.json({ data: order });
});

adminRouter.patch('/orders/:id/payment-status', async (req, res) => {
  const allowed = ['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'];
  const { paymentStatus } = req.body as { paymentStatus?: string };
  if (!paymentStatus || !allowed.includes(paymentStatus)) return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  order.paymentStatus = paymentStatus as 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  await order.save();
  return res.json({ data: order });
});
