# Tiến Trình Phát Triển (TASKS.md)

## Danh sách Task

- [x] **Task 1: Auth cho trang admin**
  - [x] Tạo trang `/admin/login` (email/password login)
  - [x] Middleware / client-server protection cho các route `/admin/*`
  - [x] Thêm nút Đăng xuất (Logout) trong `/admin`
  - [x] Cập nhật RLS policies trong `supabase/schema.sql` (chỉ cho phép authenticated sửa/xoá/thêm)

- [x] **Task 2: Trang chi tiết phòng (`/phong/[id]`)**
  - [x] Tạo file cấu hình liên hệ `src/config/contact.ts`
  - [x] Tạo trang `/phong/[id]` với gallery/carousel ảnh, chi tiết phòng
  - [x] Nút liên hệ nhanh: Nút Gọi điện (`tel:`), Zalo, WhatsApp, Facebook

- [ ] **Task 3: Filter/search trên trang public**
  - [ ] Bộ lọc client-side theo khoảng giá, khu vực (quận), loại phòng, trạng thái
  - [ ] Ô tìm kiếm từ khoá tiêu đề / địa chỉ

- [ ] **Task 4: Thiết kế lại giao diện cho chuyên nghiệp**
  - [ ] Chốt hướng thiết kế trước khi code: bảng màu (4-6 mã hex có tên), font heading/body — tránh 3 kiểu AI mặc định (be/serif/cam đất, đen/neon, báo/kẻ mảnh)
  - [ ] Import Google Font (ví dụ: Be Vietnam Pro / Plus Jakarta Sans)
  - [ ] Thêm phần Hero giới thiệu ấn tượng ở trang chủ
  - [ ] Thiết kế lại Room Card, Badge trạng thái, Header/Footer
  - [ ] Đảm bảo mobile-first và responsive hoàn hảo

- [ ] **Task 5: Chuẩn bị deploy Vercel**
  - [ ] Kiểm tra build production (`npm run build`) không có lỗi ESLint/TypeScript
  - [ ] Liệt kê danh sách biến môi trường cho Vercel dashboard
  - [ ] Hướng dẫn các bước deploy thủ công
