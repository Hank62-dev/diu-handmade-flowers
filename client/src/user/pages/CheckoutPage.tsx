import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Copy, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createOrder, getPaymentConfig, getPaymentQr, type PaymentConfig } from '../../shared/api/client';
import { useCart } from '../state/CartContext';

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';

export function CheckoutPage() {
  const { selectedItems, selectedTotal, clearSelected } = useCart();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('');
  const [payment, setPayment] = useState<PaymentConfig | null>(null);
  const [qr, setQr] = useState('');
  const [qrError, setQrError] = useState('');

  useEffect(() => {
    getPaymentConfig().then((config) => {
      setPayment(config);
      if (config.configured && selectedTotal > 0) { setQrError(''); getPaymentQr(selectedTotal, 'DIU-PREVIEW').then(setQr).catch((error) => setQrError(error instanceof Error ? error.message : 'Không thể tạo mã QR')); }
      else if (config.configured) setQrError('Hãy chọn sản phẩm trước khi thanh toán');
    }).catch(() => setPayment(null));
  }, [selectedTotal]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    data.append('items', JSON.stringify(selectedItems.map((item) => ({ productId: item._id, quantity: item.quantity }))));
    try {
      const result = await createOrder(data);
      setOrder(result.orderNumber);
      clearSelected();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể gửi đơn');
    } finally {
      setLoading(false);
    }
  }

  if (order) return <div className="wrap success-page"><p className="eyebrow">ĐÃ TIẾP NHẬN</p><h1>Cảm ơn bạn đã chọn<br /><em>một chút Dịu dàng.</em></h1><p>Mã đơn: <strong>{order}</strong>. Dịu sẽ liên hệ để xác nhận.</p><Link className="button primary" to="/">Về trang chủ</Link></div>;

  return <div className="wrap checkout-page">
    <Link to="/cart" className="back">← Quay lại giỏ hàng</Link>
    <div className="checkout-layout">
      <form onSubmit={submit}>
        <p className="eyebrow">ĐẶT HOA</p><h1>Gửi thông tin<br /><em>cho Dịu.</em></h1>
        {payment?.configured && <div className="payment-box"><div><p className="eyebrow">THÔNG TIN CHUYỂN KHOẢN</p><h2>Chuyển khoản trước khi gửi đơn</h2><p>Vui lòng chuyển đúng tổng tiền hoa. Phí giao hàng sẽ được Dịu xác nhận theo khu vực.</p><div className="bank-detail"><span>Ngân hàng</span><strong>{payment.bankCode}</strong><span>Số tài khoản</span><strong>{payment.accountNumber} <button type="button" onClick={() => navigator.clipboard?.writeText(payment.accountNumber)} aria-label="Sao chép số tài khoản"><Copy size={14} /></button></strong><span>Chủ tài khoản</span><strong>{payment.accountName}</strong><span>Số tiền hoa</span><strong className="payment-amount">{money(selectedTotal)}</strong></div></div><div className="qr-wrap">{qr ? <><QrCode size={18} /><img src={qr} alt="Mã QR chuyển khoản" /></> : <><QrCode size={25} /><span>{qrError || 'Đang tạo mã QR…'}</span></>}</div></div>}
        <label>Họ và tên<input required name="customerName" /></label>
        <label>Số điện thoại<input required name="phone" pattern="[0-9 +().-]{8,20}" /></label>
        <label>Địa chỉ nhận hàng<textarea required name="address" /></label>
        <label>Email<input required type="email" name="email" /></label>
        <label>Ghi chú <span>(không bắt buộc)</span><textarea name="note" /></label>
        <label>Ảnh xác nhận chuyển khoản<input required type="file" name="paymentProof" accept="image/jpeg,image/png,image/webp" /></label>
        <button disabled={loading || !selectedItems.length} className="button primary full">{loading ? 'Đang gửi…' : 'Xác nhận đơn hàng'} <ArrowRight size={17} /></button>
      </form>
      <aside className="cart-summary"><p className="eyebrow">TÓM TẮT</p>{selectedItems.map((item) => <div className="summary-row" key={item._id}><span className="checkout-summary-product"><img src={item.image} alt="" />{item.name} × {item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="summary-total"><span>Tổng tiền hoa</span><strong>{money(selectedTotal)}</strong></div><p>Đơn mới ở trạng thái chờ shop xác minh thanh toán.</p></aside>
    </div>
  </div>;
}
