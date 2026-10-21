# Environment setup

## Backend (`server/.env`)

| Biến | Bắt buộc | Mục đích |
|---|---|---|
| `PORT` | Không | Cổng Express, mặc định 4000 |
| `NODE_ENV` | Không | Môi trường chạy |
| `MONGODB_URI` | Production | MongoDB Atlas; API từ chối tạo đơn nếu chưa kết nối |
| `CLIENT_URL` | Nên có | Origin frontend, nhiều origin ngăn cách bằng dấu phẩy |
| `BREVO_API_KEY` | Khi bật email | Secret Brevo, chỉ backend |
| `BREVO_SENDER_EMAIL` | Khi bật email | Email sender đã verify |
| `BREVO_SENDER_NAME` | Khi bật email | Tên hiển thị |
| `SHOP_NOTIFICATION_EMAIL` | Khi bật email | Email nhận thông báo đơn |
| `ADMIN_EMAIL` | Khi tạo admin | Email bootstrap admin |
| `ADMIN_PASSWORD_HASH` | Khi bật admin | Hash scrypt của mật khẩu admin; không commit mật khẩu plain text |
| `ADMIN_PASSWORD_SALT` | Khi bật admin | Salt ngẫu nhiên dùng để tạo hash |
| `JWT_SECRET` | Khi bật admin | Secret dài, ngẫu nhiên |
| `BANK_CODE`, `BANK_ACCOUNT_NUMBER`, `BANK_ACCOUNT_NAME` | Khi bật QR | Thông tin do chủ shop cung cấp |

## Frontend (`client/.env`)

`VITE_API_URL` là URL API public, ví dụ `http://localhost:4000/api`. Biến `VITE_*` là public, không được chứa secret. Render cấu hình backend; Vercel cấu hình `VITE_API_URL`, sau đó redeploy.
