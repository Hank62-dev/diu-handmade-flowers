# Kiến trúc source code

## Frontend

```text
client/src/
├─ app/                 # composition root, router, application shell
├─ features/
│  ├─ catalog/          # product/catalog boundary
│  └─ cart/             # cart domain types and state boundary
├─ pages/               # page-level screens theo route
├─ shared/
│  ├─ api/              # HTTP client và response types
│  └─ styles/           # design tokens/global styles
├─ user/                # customer-facing boundary
├─ admin/               # admin-facing boundary
└─ main.tsx             # bootstrap duy nhất
```

## Backend

```text
server/src/
├─ config/              # env và database bootstrap
├─ middleware/          # middleware dùng chung
├─ modules/
│  ├─ products/         # product data, routes, domain logic
│  └─ orders/           # order model và routes
├─ services/            # Brevo, upload, QR, outbox integrations
├─ app.ts               # express composition, không khởi động process
└─ index.ts             # process bootstrap duy nhất
```

Nguyên tắc: `index.ts` chỉ khởi động; `app.ts` chỉ compose Express; module sở hữu route/model của mình; integration side-effect đi qua `services`; frontend `app` không chứa API implementation.
