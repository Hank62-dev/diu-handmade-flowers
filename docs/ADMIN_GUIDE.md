# Hướng dẫn quản trị

Khu vực admin chưa được bật trong baseline này vì repository ban đầu không có tài khoản, email hay quy trình bootstrap được xác minh. Không có thông tin đăng nhập mặc định nào được commit.

Khi triển khai module admin: tạo admin qua CLI/seed có kiểm soát, hash mật khẩu, bảo vệ API bằng session/JWT, dùng bốn trạng thái `PENDING`, `PROCESSING`, `COMPLETED`, `REJECTED` và tách trạng thái thanh toán khỏi trạng thái đơn.
