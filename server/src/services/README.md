# Services boundary

Các integration side-effect như Brevo email, object storage, QR/payment và outbox đặt tại đây. Controller/route chỉ parse request và gọi service, không chứa logic tích hợp trực tiếp.
