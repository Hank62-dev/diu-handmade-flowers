# Project audit — Dịu Handmade Flowers

## Nguồn đã khảo sát

- Repository ban đầu chỉ có `README.md`, `LICENSE`, một commit đầu tiên và không có ứng dụng trong source.
- `https://diufloral.netlify.app/` trả HTML thành công ngày 21/10/2026 bằng HTTP request; công cụ duyệt trực tiếp không mở được.

## Nhận diện đã xác minh

- Tên: Dịu — Handmade Flowers. Màu rose `#b32a5b`, rose đậm, olive, blush/cream, gold; font Playfair Display và Be Vietnam Pro.
- Thông điệp: “Gửi chút Dịu dàng, ở lại cùng thời gian.”
- Sản phẩm/giá: Dịu Kiêu Sa 149.000 VNĐ; Dịu Nàng Thơ 189.000 VNĐ; Dịu Ngọt Ngào 59.000 VNĐ; Dịu Tinh Khôi 119.000 VNĐ.
- Chất liệu: hoa handmade từ vải/nhựa mềm, ren, ruy-băng, hạt ngọc trai và phụ kiện.
- Quy trình: chọn, tạo, phối, hoàn thiện, gói; nên đặt trước 3–4 ngày.
- Giao hàng: khu vực TP. Hồ Chí Minh, phí tùy khu vực. Thanh toán: đặt cọc 50%, 50% còn lại sau khi nhận hoa.
- Liên hệ: Zalo/điện thoại `0949 075 900`; Instagram `@diufloral`; Facebook `Dịu`; TikTok `@diuflora`; `482 Nơ Trang Long, P.13, Bình Thạnh`.

## Chưa xác minh

Email shop, tài khoản ngân hàng/QR, chính sách hủy/đổi chi tiết, giờ hoạt động, tài khoản Brevo/Cloudinary và quyền production chưa được cung cấp. Các giá trị này để trống trong `.env.example`.

## Kiến trúc

Frontend Vite/React nằm trong `client/`, backend Express/Mongoose trong `server/`. Public catalog, detail, cart, checkout và order validation đã được dựng. Admin auth/dashboard, email và object storage cần credential để hoàn thiện production.
