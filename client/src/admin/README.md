# Admin area

Admin có route và code riêng:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/orders`

Login hiện hiển thị trạng thái chưa cấu hình vì backend chưa có authentication/admin API. Không có tài khoản mặc định hoặc dữ liệu giả. Các màn hình đã được tách thành `layouts/`, `pages/` và `routes.tsx` để kết nối API thật tiếp theo.
