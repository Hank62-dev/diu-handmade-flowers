# Test report

## Đã kiểm tra

- Audit repository/Git và HTTP content website hiện tại.
- Frontend có route trang chủ, chi tiết sản phẩm, giỏ hàng và checkout.
- Backend có health check, public product API, multipart upload validation và order validation.

## Chưa thể xác minh

- Dependency chưa được cài nên build/lint/integration test chưa chạy.
- MongoDB, Brevo, QR ngân hàng, object storage và email thật thiếu credentials.
- Admin auth/dashboard chưa triển khai; không tuyên bố đã hoàn tất.

## Việc trước production

- Hoàn tất admin module, Cloudinary/S3 private upload, Brevo retry/outbox, idempotency persistence và seed MongoDB.
- Thay ảnh remote bằng asset CDN/ảnh sản phẩm thật được cấp phép của Dịu.
