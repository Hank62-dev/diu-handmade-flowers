const base=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
const token=()=>sessionStorage.getItem('diu_admin_token')||'';
async function request<T>(path:string,options:RequestInit={}):Promise<T>{const r=await fetch(`${base}${path}`,{...options,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`,...options.headers}});const data=await r.json();if(!r.ok)throw new Error(data.message||'Admin API error');return data.data;}
export function adminLogin(password:string){return request<{token:string;email:string}>('/admin/auth/login',{method:'POST',body:JSON.stringify({password})});}
export function adminMe(){return request<{email:string;role:string}>('/admin/auth/me');}
export function getDashboard(){return request<{totalProducts:number;totalOrders:number;pendingOrders:number;processingOrders:number;completedOrders:number;revenue:number}>('/admin/dashboard');}
export function getAdminProducts(){return request<any[]>('/admin/products');}
export function getAdminOrders(){return request<any[]>('/admin/orders');}
export function getAdminOrder(id:string){return request<any>(`/admin/orders/${id}`);}
export function updateAdminOrderStatus(id:string,status:string){return request<any>(`/admin/orders/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});}
export function updateAdminPaymentStatus(id:string,paymentStatus:string){return request<any>(`/admin/orders/${id}/payment-status`,{method:'PATCH',body:JSON.stringify({paymentStatus})});}
