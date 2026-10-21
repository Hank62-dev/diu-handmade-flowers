export type Product={_id:string;name:string;slug:string;price:number;shortDescription:string;description?:string;image:string;category:string;stock:number;isPublished:boolean;materials?:string[]};
export type PaymentConfig={configured:boolean;bankCode:string;accountNumber:string;accountName:string};
const base=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
export async function getProducts():Promise<Product[]>{const r=await fetch(`${base}/products`);if(!r.ok)throw new Error('Không thể tải danh sách hoa');return(await r.json()).data}
export async function createOrder(body:FormData){const r=await fetch(`${base}/orders`,{method:'POST',body,headers:{'Idempotency-Key':crypto.randomUUID()}});const j=await r.json();if(!r.ok)throw new Error(j.message||'Không thể tạo đơn');return j.data}
export async function getPaymentConfig():Promise<PaymentConfig>{const r=await fetch(`${base}/payment/config`);if(!r.ok)throw new Error('Chưa có cấu hình thanh toán');return(await r.json()).data}
export async function getPaymentQr(amount:number,reference:string):Promise<string>{const r=await fetch(`${base}/payment/qr?amount=${amount}&reference=${encodeURIComponent(reference)}`);if(!r.ok)throw new Error('Chưa thể tạo mã QR');return(await r.json()).data.url}
