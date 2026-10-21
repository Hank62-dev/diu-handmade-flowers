import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../state/CartContext';

const navClass = ({ isActive }: { isActive: boolean }) => isActive ? 'active' : undefined;

export function StorefrontLayout() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const close = () => setOpen(false);
  return <div className="storefront-shell">
    <header className="site-header"><div className="nav wrap"><Link to="/" className="brand" onClick={close}><span>Dịu</span><small>HANDMADE FLOWERS</small></Link><nav className={open ? 'nav-links open' : 'nav-links'}><NavLink className={navClass} to="/" end onClick={close}>Trang chủ</NavLink><NavLink className={navClass} to="/about" onClick={close}>Về Dịu</NavLink><NavLink className={navClass} to="/flowers" onClick={close}>Hoa của Dịu</NavLink><NavLink className={navClass} to="/process" onClick={close}>Quy trình</NavLink><NavLink className={navClass} to="/faq" onClick={close}>FAQ</NavLink><NavLink className={navClass} to="/custom" onClick={close}>Custom</NavLink></nav><div className="nav-actions"><Link className="cart-button" to="/cart" aria-label={`Giỏ hàng có ${count} sản phẩm`}><ShoppingBag size={19}/><b>{count}</b></Link><button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Mở menu">{open ? <X/> : <Menu/>}</button></div></div></header>
    <main className="route-enter"><Outlet/></main>
    <footer><div className="wrap footer-grid"><div><Link to="/" className="brand inverse"><span>Dịu</span><small>HANDMADE FLOWERS</small></Link><p>Gửi chút Dịu dàng, ở lại cùng thời gian.</p></div><div><p className="footer-label">KHÁM PHÁ</p><Link to="/">Trang chủ</Link><Link to="/about">Câu chuyện của Dịu</Link><Link to="/flowers">Hoa của Dịu</Link><Link to="/process">Quy trình</Link><Link to="/faq">Câu hỏi thường gặp</Link></div><div><p className="footer-label">LIÊN HỆ</p><a href="tel:0949075900">0949 075 900</a><a href="https://instagram.com/diufloral">Instagram · @diufloral</a><p>482 Nơ Trang Long,<br/>P.13, Bình Thạnh</p></div></div><div className="wrap copyright">© 2026 DỊU · Handmade Flowers</div></footer>
  </div>;
}
