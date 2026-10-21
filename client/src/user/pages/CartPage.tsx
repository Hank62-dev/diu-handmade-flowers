import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useCart } from '../state/CartContext';

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';

export function CartPage() {
  const { items, selectedIds, selectedTotal, update, toggleSelected, selectAll } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return <div className="wrap cart-page">
    <div className="cart-hero">
      <div className="cart-hero-index"><span>01</span><i /> <span>GIỎ HOA</span></div>
      <div className="cart-hero-copy"><p className="eyebrow">MỘT GÓC NHỎ CỦA DỊU</p><h1>Một chút Dịu dàng<br /><em>đang chờ bạn.</em></h1><p>Những món hoa bạn chọn đã sẵn sàng được gói ghém thành một điều thật riêng.</p></div>
      <div className="cart-hero-note"><Heart size={19} /><strong>{count} {count === 1 ? 'món hoa' : 'món hoa'}</strong><span>được bạn lưu lại</span></div>
    </div>
    <div className="cart-trust"><div><ShieldCheck size={18} /><span>Đặt hoa thủ công<br /><small>Dịu chăm chút từng chi tiết</small></span></div><div><span className="trust-number">02</span><span>Xem lại lựa chọn<br /><small>Trước khi gửi thông tin</small></span></div><div><span className="trust-number">03</span><span>Nhận xác nhận từ Dịu<br /><small>Shop sẽ liên hệ với bạn</small></span></div></div>
    {!items.length ? <div className="cart-empty"><p>Giỏ hoa đang trống.</p><Link className="button primary" to="/flowers">Khám phá hoa</Link></div> : <div className="cart-layout">
      <div><div className="cart-list-heading"><span>LỰA CHỌN CỦA BẠN</span><button className="select-all" onClick={selectAll}>{selectedIds.length === items.length ? 'Đã chọn tất cả' : 'Chọn tất cả'}</button></div>{items.map((item) => <div className={`cart-line ${selectedIds.includes(item._id) ? 'is-selected' : ''}`} key={item._id}><label className="cart-check"><input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleSelected(item._id)} aria-label={`Chọn ${item.name}`} /><span /></label><img src={item.image} alt={item.name} /><div><h2>{item.name}</h2><p>{money(item.price)}</p><div className="quantity"><button aria-label="Giảm số lượng" onClick={() => update(item._id, item.quantity - 1)}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label="Tăng số lượng" onClick={() => update(item._id, item.quantity + 1)}><Plus size={14} /></button><button className="remove" aria-label={`Xóa ${item.name}`} onClick={() => update(item._id, 0)}><Trash2 size={15} /></button></div></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
      <aside className="cart-summary"><p className="eyebrow">TÓM TẮT</p><div><span>Đã chọn</span><strong>{selectedIds.length}/{items.length} món</strong></div><div><span>Tạm tính</span><strong>{money(selectedTotal)}</strong></div><p>Chỉ những sản phẩm được tick mới được đưa sang bước đặt hoa. Phí giao hàng sẽ được Dịu xác nhận theo khu vực.</p><Link className={`button primary full ${!selectedIds.length ? 'disabled-button' : ''}`} to={selectedIds.length ? '/checkout' : '#'} onClick={(event) => { if (!selectedIds.length) event.preventDefault(); }}>Đặt hoa <ArrowRight size={17} /></Link><Link className="continue-shopping" to="/flowers">← Tiếp tục chọn hoa</Link></aside>
    </div>}
  </div>;
}
