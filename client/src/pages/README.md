# Pages boundary

Các page-level screen mới nên đặt ở đây (`HomePage`, `ProductDetailPage`, `CheckoutPage`, `Admin/*`). `app/App.tsx` chỉ nên làm composition root và wiring route; các component lớn được tách dần vào page/feature khi mở rộng nghiệp vụ.
