import { Schema, model } from 'mongoose';

export const OrderSchema = new Schema({
  orderNumber: { type: String, unique: true }, customerName: String, phone: String, email: String,
  address: String, note: String,
  items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
  subtotal: Number, shippingFee: { type: Number, default: 0 }, total: Number, paymentProofUrl: String, paymentProofPublicId: String, idempotencyKey: { type: String, unique: true, sparse: true }, emailDelivery: { status: { type: String, enum: ['NOT_CONFIGURED', 'PENDING', 'SENT', 'FAILED'], default: 'NOT_CONFIGURED' }, attempts: { type: Number, default: 0 }, lastError: String, sentAt: Date },
  paymentStatus: { type: String, enum: ['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'], default: 'PENDING_VERIFICATION' },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'], default: 'PENDING' },
  statusHistory: [{ status: String, at: Date, by: String }],
}, { timestamps: true });

export const Order = model('Order', OrderSchema);
