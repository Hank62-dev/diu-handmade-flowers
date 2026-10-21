# Dịu — Handmade Flowers

Website thương mại cho Dịu, gồm frontend React/Vite và backend Express/MongoDB. Catalog seed trong backend được trích từ website hiện tại để làm dữ liệu khởi tạo; production cần MongoDB và upload/email credentials.

## Chạy local

```bash
pnpm install
copy server/.env.example server/.env
copy client/.env.example client/.env
pnpm dev
```

Frontend `http://localhost:5173` · API `http://localhost:4000/health`.

## Scripts

`pnpm build` build frontend · `pnpm lint` typecheck hai app · `pnpm test` chạy test backend.

## Tài liệu

- [Kiến trúc source code](docs/ARCHITECTURE.md)
- [Audit](docs/PROJECT_AUDIT.md)
- [Cấu hình môi trường](docs/ENV_SETUP.md)
- [Hướng dẫn khách hàng](docs/USER_GUIDE.md)
- [Hướng dẫn admin](docs/ADMIN_GUIDE.md)
- [Triển khai](docs/DEPLOYMENT.md)
- [Test report](docs/TEST_REPORT.md)

## Trạng thái

Đã hoàn thiện nền tảng public catalog, detail, giỏ hàng, checkout multipart và backend order validation. Email Brevo, upload lưu trữ bền vững, xác thực admin, dashboard và MongoDB production cần cấu hình/tích hợp tiếp; không có credential thật trong repository.
