# Deployment

1. Tạo MongoDB Atlas database/user quyền tối thiểu và lấy connection string.
2. Tạo Render Web Service cho `server`, đặt `MONGODB_URI`, `CLIENT_URL` và biến Brevo; dùng `pnpm install --prod` và start command phù hợp.
3. Tạo Vercel project cho `client`, build `pnpm build`, output `dist`, đặt `VITE_API_URL` trỏ API Render.
4. Kiểm tra CORS và `/health`.
5. Chỉ sau khi chủ shop cung cấp tài khoản ngân hàng, cấu hình `BANK_*` và tích hợp QR; không commit credentials.
6. Kiểm thử đơn staging, document MongoDB và email Brevo trước production.

Upload hiện kiểm tra MIME/kích thước nhưng chưa có object storage; không dùng filesystem ephemeral của Render cho dữ liệu thật. Cần hoàn tất Cloudinary/S3 private upload và Brevo outbox trước production.
