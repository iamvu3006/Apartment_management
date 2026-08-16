# 📘 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ PHÒNG CHO THUÊ
## (Da Nang Homes - Property Listing Web App)

Chào Vũ! Đây là tài liệu hướng dẫn chi tiết toàn bộ cách vận hành, quản lý phòng và cấp quyền cho nhiều tài khoản Admin của hệ thống web app cho thuê phòng căn hộ Đà Nẵng.

---

## 📌 THÔNG TIN ĐƯỜNG LINK HỆ THỐNG

- **Link Khách Hàng Xem Phòng (Public)**: [https://apartment-management-topaz.vercel.app](https://apartment-management-topaz.vercel.app)
- **Link Trang Quản Trị Admin**: [https://apartment-management-topaz.vercel.app/admin](https://apartment-management-topaz.vercel.app/admin)
- **Link Đăng Nhập Admin**: [https://apartment-management-topaz.vercel.app/admin/login](https://apartment-management-topaz.vercel.app/admin/login)

---

## 🔑 1. QUẢN LÝ TÀI KHOẢN ADMIN (TẠO 2 HOẶC NHIỀU TÀI KHOẢN)

Hệ thống được thiết kế với cơ chế bảo mật **Supabase Auth**. Bất kỳ tài khoản Email/Mật khẩu nào được tạo trong Supabase Auth đều có thể đăng nhập vào trang `/admin` để thêm, sửa, xoá phòng.

### ➕ Cách tạo Tài khoản Admin thứ 2 (dành cho cộng sự / sale phòng):

1. Truy cập vào **Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Chọn dự án **`iamvu3006's Project`** (dự án dành riêng cho app cho thuê phòng này).
3. Ở menu bên trái, bấm vào biểu tượng 👥 **Authentication** → Chọn mục **Users**.
4. Bấm nút **Add user** (nút màu xanh góc trên) → Chọn **Create user**.
5. Nhập thông tin:
   - **Email**: Nhập email của Admin 2 (ví dụ: `admin2@gmail.com` hoặc `sale@dananghomes.com`).
   - **Password**: Nhập mật khẩu tạo cho Admin 2 (tối thiểu 6 ký tự).
   - Chọn tick vào **Auto Confirm User?** (để tài khoản có hiệu lực ngay mà không cần xác nhận email).
6. Bấm **Create user**.

👉 **Kết quả**: Tài khoản Admin thứ 2 đã được tạo thành công! Người giữ tài khoản này có thể truy cập `https://apartment-management-topaz.vercel.app/admin/login`, gõ email/password vừa tạo để bắt đầu quản lý và thêm phòng cùng bạn.

---

## ➕ 2. HƯỚNG DẪN THÊM PHÒNG MỚI (ADD NEW LISTING)

1. Mở trang quản trị: `https://apartment-management-topaz.vercel.app/admin` (Đăng nhập nếu chưa đăng nhập).
2. Nhấn nút **`+ Add New Property`** ở góc phải trên.
3. Nhập đầy đủ thông tin căn hộ:
   - **Listing Title (Tiêu đề)**: Nhập tên phòng bằng tiếng Anh (ví dụ: *Modern 1-Bedroom Apartment on Pham Kiet Street*).
   - **Monthly Rent (VND)**: Nhập giá thuê dạng số (ví dụ: `16000000` cho 16 triệu).
   - **Area (m²)**: Nhập diện tích (ví dụ: `55`).
   - **Street Address (Địa chỉ)**: Tên đường, số nhà (ví dụ: *Pham Kiet Street*).
   - **District / Area (Quận)**: Nhập tên quận (ví dụ: *Ngu Hanh Son* hoặc *Son Tra*).
   - **Property Type (Loại hình)**: Ví dụ: *1-Bedroom Apartment*, *Studio*, *2-Bedroom Apartment*.
   - **Availability Status (Trạng thái)**:
     - `Available`: Phòng còn trống, sẵn sàng cho thuê (hiển thị badge xanh 🟢).
     - `Reserved`: Khách đã cọc (hiển thị badge vàng 🟡).
     - `Rented`: Đã cho thuê (hiển thị badge xám ⚪).
   - **Description (Mô tả chi tiết)**: Nhập chi tiết tiện ích, ngày trống, phí điện, nước, phí dịch vụ (Wi-Fi, dọn phòng,...).
   - **Property Photos (Ảnh phòng)**: Nhấn nút chọn file để tải lên nhiều ảnh chụp thực tế của căn hộ.
4. Bấm **Save Changes** (hoặc **Add Property**).
5. **Hoàn tất!** Phòng mới cùng ảnh sẽ tự động hiển thị lập tức trên trang chủ gửi cho khách hàng.

---

## ✏️ 3. HƯỚNG DẪN CHỈNH SỬA VÀ XOÁ PHÒNG

### 📝 Chỉnh sửa phòng:
1. Tại trang Admin Dashboard (`/admin`), tìm phòng cần sửa.
2. Bấm nút **Edit** bên cạnh phòng đó.
3. Thay đổi thông tin (đổi giá, đổi trạng thái từ *Available* sang *Reserved/Rented*, hoặc xoá/thêm ảnh mới).
4. Bấm **Save Changes**.

### 🗑️ Xoá phòng:
1. Tại trang Admin Dashboard (`/admin`), bấm nút **Delete** màu đỏ.
2. Xác nhận thông báo xoá phòng. Dữ liệu và hình ảnh của phòng đó sẽ được tự động xoá hoàn toàn khỏi hệ thống.

---

## 📲 4. HƯỚNG DẪN GỬI LINK CHO KHÁCH HÀNG

### 🌐 Trường hợp 1: Gửi toàn bộ danh sách phòng
- Copy link: `https://apartment-management-topaz.vercel.app`
- Gửi cho khách qua Zalo/WhatsApp/Messenger. Khách có thể dùng bộ lọc theo giá, theo quận để chọn phòng thích hợp.

### 🏠 Trường hợp 2: Gửi bài xem chi tiết 1 phòng cụ thể
- Bấm vào phòng đó trên web để mở trang chi tiết (ví dụ: `https://apartment-management-topaz.vercel.app/phong/1077d6f5-5cd8-4f3d-8b9b-10821a791152`).
- Copy link trên thanh địa chỉ trình duyệt và gửi cho khách.
- Khách hàng xem bài đăng sẽ thấy ảnh gallery lớn, giá thuê minh bạch và nút bấm **"Call Now"**, **"Zalo"**, **"WhatsApp"** để liên hệ trực tiếp với bạn.

---

## 🔒 5. LƯU Ý VỀ BẢO MẬT & VẬN HÀNH

1. **Dữ liệu đám mây (Cloud Database)**: Mọi thao tác thêm/sửa/xoá phòng do bất kỳ Admin nào thực hiện đều được đồng bộ tức thì trên cơ sở dữ liệu Supabase và hiển thị ngay trên trang Vercel mà không cần deploy lại code.
2. **Không chia sẻ mật khẩu Supabase Dashboard**: Chỉ chia sẻ tài khoản đăng nhập web (`/admin/login`) cho nhân viên sale. Giữ mật khẩu tài khoản gốc Supabase của riêng bạn.

Chúc bạn và team chốt được nhiều hợp đồng cho thuê phòng thành công! 🚀
