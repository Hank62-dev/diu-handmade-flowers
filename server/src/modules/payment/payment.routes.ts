import { Router } from 'express'; import { getPaymentConfig, getVietQrUrl } from '../../services/payment.service.js';
export const paymentRouter=Router();
paymentRouter.get('/config',(_,res)=>res.json({data:getPaymentConfig()}));
paymentRouter.get('/qr',(req,res)=>{const amount=Number(req.query.amount||0);const reference=String(req.query.reference||'');const url=getVietQrUrl(amount,reference);if(!url)return res.status(503).json({message:'Thông tin tài khoản nhận tiền chưa được cấu hình'});return res.json({data:{url}})});
