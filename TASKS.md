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

- [x] **Task 3: Filter/search trên trang public**
  - [x] Bộ lọc client-side theo khoảng giá, khu vực (quận), loại phòng, trạng thái
  - [x] Ô tìm kiếm từ khoá tiêu đề / địa chỉ

- [x] **Task 4: Thiết kế lại giao diện cho chuyên nghiệp**
  - [x] Chốt hướng thiết kế trước khi code: bảng màu (Navy Deep `#0F172A`, Ocean Teal `#0284C7`, Sunset Rose `#E11D48`, Slate Bg `#F8FAFC`), font Be Vietnam Pro
  - [x] Import Google Font Be Vietnam Pro hỗ trợ chuẩn tiếng Việt
  - [x] Thêm phần Hero giới thiệu ấn tượng ở trang chủ với thanh tìm kiếm nhanh
  - [x] Thiết kế lại Room Card, Badge trạng thái overlay, Header/Footer chuyên nghiệp
  - [x] Đảm bảo mobile-first và responsive hoàn hảo

- [ ] **Task 5: Chuẩn bị deploy Vercel**
  - [ ] Kiểm tra build production (`npm run build`) không có lỗi ESLint/TypeScript
  - [ ] Liệt kê danh sách biến môi trường cho Vercel dashboard
  - [ ] Hướng dẫn các bước deploy thủ công
