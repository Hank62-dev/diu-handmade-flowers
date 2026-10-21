type MailItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type MailOrder = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
  total: number;
  items: MailItem[];
  paymentProofUrl?: string;
};

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;

const absoluteUrl = (value?: string) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const base = (process.env.PUBLIC_SITE_URL || process.env.CLIENT_URL || '').split(',')[0].trim().replace(/\/$/, '');
  return base ? `${base}${value.startsWith('/') ? value : `/${value}`}` : value;
};

const itemRows = (items: MailItem[]) => items.map((item) => {
  const image = absoluteUrl(item.image);
  return `<tr>
    <td style="padding:16px 0;border-bottom:1px solid #eadbd0;vertical-align:middle">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        ${image ? `<td style="width:64px;padding-right:12px"><img src="${escapeHtml(image)}" width="64" height="64" alt="${escapeHtml(item.name)}" style="display:block;width:64px;height:64px;object-fit:cover;border-radius:12px;background:#f7e9e5"></td>` : ''}
        <td><div style="font-size:15px;font-weight:700;color:#2d3320">${escapeHtml(item.name)}</div><div style="font-size:13px;color:#817267;margin-top:5px">${item.quantity} sản phẩm · ${money(item.price)}</div></td>
      </tr></table>
    </td>
    <td align="right" style="padding:16px 0;border-bottom:1px solid #eadbd0;vertical-align:middle;font-size:15px;font-weight:700;color:#bd285e;white-space:nowrap">${money(item.price * item.quantity)}</td>
  </tr>`;
}).join('');

export async function sendNewOrderEmail(order: MailOrder) {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  const recipient = process.env.SHOP_NOTIFICATION_EMAIL;
  if (!apiKey || !sender || !recipient) return { sent: false, skipped: true };

  const proofUrl = absoluteUrl(order.paymentProofUrl);
  const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f8f0ed;color:#2d3320;font-family:Arial,Helvetica,sans-serif">
  <div style="padding:28px 12px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;margin:0 auto;background:#fffaf7;border:1px solid #eadbd0;border-radius:20px;overflow:hidden">
      <tr><td style="padding:30px 34px;background:#bb285b;color:#fffaf7">
        <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700">Dịu · Handmade Flowers</div>
        <h1 style="margin:18px 0 5px;font-family:Georgia,serif;font-size:30px;line-height:1.15;font-weight:400">Có một đơn hàng mới</h1>
        <div style="font-size:14px;opacity:.9">Mã đơn <strong>${escapeHtml(order.orderNumber)}</strong></div>
      </td></tr>
      <tr><td style="padding:30px 34px">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a78143;font-weight:700;margin-bottom:12px">Thông tin người nhận</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px;line-height:1.65">
          <tr><td style="color:#817267;padding:3px 0;width:110px">Họ tên</td><td style="font-weight:700;padding:3px 0">${escapeHtml(order.customerName)}</td></tr>
          <tr><td style="color:#817267;padding:3px 0">Điện thoại</td><td style="padding:3px 0">${escapeHtml(order.phone)}</td></tr>
          <tr><td style="color:#817267;padding:3px 0">Email</td><td style="padding:3px 0">${escapeHtml(order.email)}</td></tr>
          <tr><td style="color:#817267;padding:3px 0;vertical-align:top">Địa chỉ</td><td style="padding:3px 0">${escapeHtml(order.address)}</td></tr>
        </table>
        ${order.note ? `<div style="margin-top:18px;padding:13px 15px;background:#fff2d9;border-radius:10px;font-size:14px"><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</div>` : ''}

        <div style="height:1px;background:#eadbd0;margin:28px 0"></div>
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a78143;font-weight:700;margin-bottom:4px">Chi tiết đơn hàng</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <thead><tr><th align="left" style="padding:10px 0;color:#817267;font-size:12px;font-weight:400">SẢN PHẨM</th><th align="right" style="padding:10px 0;color:#817267;font-size:12px;font-weight:400">THÀNH TIỀN</th></tr></thead>
          <tbody>${itemRows(order.items)}</tbody>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:18px">
          <tr><td style="padding:4px 0;color:#817267;font-size:14px">Tạm tính</td><td align="right" style="padding:4px 0;font-size:14px">${money(order.total)}</td></tr>
          <tr><td style="padding:13px 0 0;font-size:18px;font-weight:700">Tổng tiền</td><td align="right" style="padding:13px 0 0;font-size:20px;font-weight:700;color:#bd285e">${money(order.total)}</td></tr>
        </table>

        <div style="margin-top:26px;padding:16px;background:#f7e9e5;border-radius:12px;font-size:14px;line-height:1.55"><strong style="color:#bd285e">Chờ xác minh thanh toán</strong><br><span style="color:#817267">Ảnh chuyển khoản là bằng chứng khách cung cấp; shop cần đối soát giao dịch trước khi hoàn thành đơn.</span></div>
        ${proofUrl ? `<div style="text-align:center;margin-top:24px"><a href="${escapeHtml(proofUrl)}" style="display:inline-block;background:#2d3320;color:#fffaf7;text-decoration:none;padding:13px 20px;border-radius:999px;font-size:14px;font-weight:700">Mở ảnh chuyển khoản →</a></div>` : ''}
      </td></tr>
      <tr><td style="padding:20px 34px;background:#2d3320;color:#f8f0ed;text-align:center;font-size:12px;line-height:1.6">Dịu Handmade Flowers · Một chút dịu dàng dành cho bạn</td></tr>
    </table>
  </div>
</body></html>`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ sender: { email: sender, name: process.env.BREVO_SENDER_NAME || 'Dịu Handmade Flowers' }, to: [{ email: recipient }], subject: `Đơn mới ${order.orderNumber} — Dịu`, htmlContent: html }),
  });
  if (!response.ok) throw new Error(`Brevo trả về HTTP ${response.status}`);
  return { sent: true, skipped: false };
}
