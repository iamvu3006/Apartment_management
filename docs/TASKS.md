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
  - [x] Import Google Font Be Vietnam Pro hỗ trợ chuẩn tiếng Việt & tiếng Anh
  - [x] Thêm phần Hero giới thiệu ấn tượng ở trang chủ với thanh tìm kiếm nhanh
  - [x] Thiết kế lại Room Card, Badge trạng thái overlay, Header/Footer chuyên nghiệp
  - [x] Đảm bảo mobile-first và responsive hoàn hảo

- [x] **Task 5: Chuẩn bị deploy Vercel & Deploy thành công**
  - [x] Kiểm tra build production (`npm run build`) không có lỗi ESLint/TypeScript
  - [x] Liệt kê danh sách biến môi trường cho Vercel dashboard (`.env.example`)
  - [x] Deploy thành công trang web chạy 24/7 tại `https://apartment-management-topaz.vercel.app`

- [x] **Task 6: Chuyển toàn bộ giao diện sang tiếng Anh (English Localization)**
  - [x] Chuyển đổi toàn bộ UI trang chủ public, Hero section, Room Card, Header & Footer sang tiếng Anh
  - [x] Chuyển đổi bộ lọc RoomFilter, nhãn trạng thái Availability (Available / Reserved / Rented), mức giá thuê sang tiếng Anh
  - [x] Chuyển đổi trang chi tiết phòng `/phong/[id]`, nút liên hệ nhanh và widget hỗ trợ sang tiếng Anh
  - [x] Chuyển đổi các trang Admin Control Dashboard & Form sang tiếng Anh

- [x] **Task 7: Tạo tài liệu hướng dẫn sử dụng & Quản lý nhiều tài khoản Admin**
  - [x] Viết file `USER_GUIDE.md` hướng dẫn chi tiết cách dùng web, thêm/sửa/xoá phòng và gửi link cho khách
  - [x] Hướng dẫn cách tạo 2 hoặc nhiều tài khoản Admin quản lý phòng trong Supabase Dashboard

- [x] **Task 8: Nâng cấp Form Thêm/Sửa Phòng & Bộ Lọc Giá Nâng Cao**
  - [x] **Monthly Rent Input**: Tự động phân cách hàng đơn vị bằng dấu chấm `.` khi gõ (vd: `15.000.000`). Đồng bộ ngăn cách bằng dấu `.` trên Dashboard & Cards.
  - [x] **District Input**: Đổi nhãn thành `District`, sử dụng Dropdown select chứa danh sách Quận/Phường tại Đà Nẵng.
  - [x] **Property Type Input**: Sử dụng Dropdown select cố định 4 option: `Studio`, `1-Bedroom Apartment`, `2-Bedroom Apartment`, `Penthouse`.
  - [x] **Bộ Lọc Giá Thuê Mới**: Cập nhật khoảng giá 7tr-10tr, 10tr-13tr, 13tr-15tr, 15tr-20tr, >20tr.
  - [x] **Custom Min/Max Price**: Bổ sung tính năng cho khách hàng tự nhập khoảng giá Tối thiểu (Min) và Tối đa (Max) tự động chèn dấu chấm.

- [x] **Task 9: Nâng Cấp Tính Năng Cao Cấp (Học Hỏi Từ RentNow.vn)**
  - [x] **1. Bản Đồ Tương Tác Căn Hộ Với Pin Giá (Interactive Map View)** ⭐: Tích hợp bản đồ Leaflet / OpenStreetMap hiển thị các pin giá tiền từng căn hộ tại Đà Nẵng (vd: `15M`, `16M`, `17M`). Bấm vào pin giá xem nhanh thông tin phòng và chuyển đến chi tiết.
  - [x] **2. Chuyển Đổi Tiền Tệ Tự Động (VND ⇄ USD Switcher)**: Nút chọn đơn vị tiền tệ VND (₫) hoặc USD ($) ở Header/Card hỗ trợ khách hàng nước ngoài & expat.
  - [x] **3. Danh Sách Yêu Thích / Lưu Phòng (`/saved` - Favorites List)**: Nút thả tim ❤️ lưu danh sách các phòng ưa thích để khách tiện so sánh trước khi liên hệ xem phòng.

- [x] **Task 10: Bộ Chuyển Đổi 5 Ngôn Ngữ & Bản Đồ Quốc Tế (5-Language Selector & CartoDB International Map)**
  - [x] **Tích hợp Menu Chọn 5 Ngôn Ngữ**: 🇬🇧 English, 🇰🇷 한국어 (Korean), 🇨🇳 中文 (Chinese), 🇷🇺 Русский (Russian), 🇻🇳 Tiếng Việt.
  - [x] **Bản Đồ Quốc Tế CartoDB**: Chuyển bản đồ sang lớp CartoDB Voyager hiển thị tên đường và địa danh chuẩn ký tự quốc tế/Latinh sắc nét cho khách nước ngoài.
  - [x] **Dịch Popup & Giao Diện**: Popup bản đồ và toàn bộ các nút hành động tự động dịch theo ngôn ngữ được chọn.

- [x] **Task 11: Phân Trang Căn Hộ & Nâng Cấp Formatter Mô Tả (Pagination & Auto-Expand Rich Description)**
  - [x] **Phân Trang 6 Căn Hộ/Trang**: Tích hợp thanh phân trang cho danh sách căn hộ tại trang chủ (6 căn/trang), tự động reset về trang 1 khi dùng bộ lọc/tìm kiếm, tự động cuộn lên đầu danh sách khi chuyển trang.
  - [x] **Description Auto-Expand**: Tự động co giãn/mở rộng chiều cao ô nhập Description khi gõ hoặc dán (paste) văn bản dài.
  - [x] **Formatting Toolbar & Live Preview**: Thêm thanh công cụ định dạng nhanh (Bold `**B**`, Header `### H3`, Bullet `•`, Checkmark `✓`, Numbered `1.`) và chế độ Xem trước (Live Preview) trong Admin Form.
  - [x] **Render Rich Description**: Tích hợp component `FormattedText` giúp trang chi tiết căn hộ `/phong/[id]` hiển thị mô tả chuẩn đẹp mắt với icon, danh sách tiện ích và tiêu đề nổi bật.

- [x] **Task 12: Bản Đồ Chuẩn Xoá Bỏ Đoán Toạ Độ (Admin Location Picker & DB Lat/Lng Storage)**
  - [x] **Toạ Độ Chuẩn Supabase**: Bổ sung 2 cột `latitude` & `longitude` vào bảng `rooms` trong `supabase/schema.sql`.
  - [x] **LocationPicker Mini-Map trong Admin Form**: Tích hợp ô chọn vị trí bản đồ tương tác trong `/admin/new` & `/admin/[id]/edit` hỗ trợ click chọn vị trí hoặc kéo thả ghim (drag marker) chính xác 100% tòa nhà. Tự động gợi ý ghim vị trí theo địa chỉ nhập.
  - [x] **Hiển Thị Map View Tức Thì**: Mở lại bộ chuyển đổi **Danh Sách ↔ Map View** trên Trang chủ (`/`) hiển thị pin giá tiền với độ chính xác cao tuyệt đối từ DB.
  - [x] **Chi Tiết Phòng Location Map**: Tích hợp mini-map hiển thị vị trí căn hộ trên trang chi tiết `/phong/[id]`.

