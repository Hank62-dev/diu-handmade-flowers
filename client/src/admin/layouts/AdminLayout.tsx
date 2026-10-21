import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Flower2, LogOut, ShoppingCart } from 'lucide-react';
import { adminMe } from '../api';
import { LoginPage } from '../pages/LoginPage';
import '../admin.css'; import '../admin-login.css'; import '../admin-orders.css'; import '../admin-order-detail.css'; import '../payment-status.css';

export function AdminLayout() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => { adminMe().then(() => setAuthenticated(true)).catch(() => { sessionStorage.removeItem('diu_admin_token'); setAuthenticated(false); }).finally(() => setChecking(false)); }, []);
  if (checking) return <main className="admin-login"><div className="admin-login-card"><p className="eyebrow">DỊU · ADMIN</p><h1>Đang mở<br /><em>khu quản trị.</em></h1></div></main>;
  if (!authenticated) return <LoginPage onAuthenticated={() => setAuthenticated(true)} />;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link to="/admin" className="admin-brand">Dịu <small>ADMIN</small></Link><nav><Link className={location.pathname === '/admin' ? 'active' : ''} to="/admin"><BarChart3 size={17}/> Tổng quan</Link><Link className={location.pathname.includes('products') ? 'active' : ''} to="/admin/products"><Flower2 size={17}/> Sản phẩm</Link><Link className={location.pathname.includes('orders') ? 'active' : ''} to="/admin/orders"><ShoppingCart size={17}/> Đơn hàng</Link></nav><button className="admin-exit" onClick={() => { sessionStorage.removeItem('diu_admin_token'); setAuthenticated(false); }}><LogOut size={16}/> Đăng xuất</button></aside><main className="admin-content"><Outlet/></main></div>;
}
