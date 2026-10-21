# Middleware boundary

Middleware dùng chung của API như auth, validation, rate limit, error handler và request logging đặt tại đây. Route module không nên tự khởi tạo middleware hạ tầng ngoài phạm vi module.
