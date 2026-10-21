import { useEffect, useState } from 'react';
import { ClipboardList, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminOrders } from '../api';
import { AdminPagination } from '../components/AdminPagination';

const statusLabel: Record<string, string> = { PENDING: 'Chờ xử lý', PROCESSING: 'Đang xử lý', COMPLETED: 'Hoàn thành', REJECTED: 'Từ chối' };
const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); const [error, setError] = useState(''); const [page, setPage] = useState(1); const navigate = useNavigate(); const pageSize = 10;
  useEffect(() => { getAdminOrders().then(setOrders).catch((e) => setError(e.message)); }, []);
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize)); const visible = orders.slice((page - 1) * pageSize, page * pageSize);
  return <div className="admin-page"><Link to="/admin" className="back admin-back-top">← Về tổng quan</Link><div className="admin-topbar"><div><p className="eyebrow">OPERATIONS</p><h1>Đơn hàng</h1></div><span className="admin-chip">{orders.length} đơn</span></div>{error && <div className="admin-notice"><p>{error}</p></div>}{!orders.length && !error && <div className="admin-empty-state"><ClipboardList size={34}/><h2>Chưa có đơn hàng</h2><p>Khi khách gửi đơn hoa, thông tin sẽ xuất hiện ở đây.</p><Link className="button primary" to="/flowers">Xem website</Link></div>}{orders.length > 0 && <div className="admin-order-list">{visible.map((order) => <button className="admin-order-card" key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`, { state: { order } })}><div className="order-card-main"><span className="order-number">{order.orderNumber}</span><strong>{order.customerName}</strong><small>{order.phone} · {order.items?.length || 0} sản phẩm</small></div><div className="order-card-side"><strong>{money(order.total)}</strong><em className={`order-status ${String(order.status).toLowerCase()}`}>{statusLabel[order.status] || order.status}</em><Eye size={17}/></div></button>)}</div>}<AdminPagination page={page} totalPages={totalPages} onChange={setPage}/></div>;
}
