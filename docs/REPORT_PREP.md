# 🎓 Tài liệu Chuẩn bị Báo cáo Project ReactJS

Tài liệu này giúp bạn tổng hợp lại toàn bộ kiến thức và luồng hoạt động của dự án "Apartment Management" để tự tin demo và trả lời các câu hỏi phản biện từ thầy giáo.

---

## 1. 🌟 Tổng quan Dự án (Project Overview)

- **Tên dự án**: Apartment Management (Quản lý phòng trọ/căn hộ cho thuê).
- **Mục tiêu**: Số hóa việc quản lý phòng cho thuê, thay thế quy trình dùng Excel bằng một web app có UI/UX hiện đại, cho phép khách xem trực quan thông tin và hình ảnh phòng.
- **Công nghệ cốt lõi (Tech Stack)**:
  - **Framework**: Next.js 16.3.1 (sử dụng App Router). Next.js được xây dựng dựa trên ReactJS.
  - **Ngôn ngữ**: TypeScript (giúp code an toàn hơn, tránh lỗi runtime do sai kiểu dữ liệu).
  - **Styling**: Tailwind CSS (Utility-first CSS, code style trực tiếp trong JSX).
  - **Backend as a Service (BaaS)**: Supabase (cung cấp PostgreSQL database và Storage lưu ảnh).
  - **Deploy**: Vercel.

---

## 2. 🏗️ Kiến trúc & Tính năng chính

### Tính năng đã hoàn thiện:
1. **Trang chủ (Public Listing)**: Hiển thị danh sách các phòng trống dưới dạng lưới (Grid layout), responsive trên mobile.
2. **Trang Quản trị (`/admin`)**: Thực hiện các thao tác CRUD (Create, Read, Update, Delete) cho phòng.
3. **Upload ảnh**: Cho phép upload nhiều ảnh cùng lúc lên Supabase Storage.
4. **Real-time Database**: Sử dụng PostgreSQL của Supabase, dữ liệu được cập nhật tức thì.

### Cấu trúc thư mục đáng chú ý (`src/app/`):
- Next.js App Router sử dụng hệ thống thư mục để định nghĩa route:
  - `page.tsx`: File UI chính cho trang chủ (`/`).
  - `admin/page.tsx`: UI cho trang `/admin` (hiển thị danh sách dashboard).
  - `admin/new/page.tsx`: UI trang thêm phòng (`/admin/new`).
- Các component dùng chung được đặt ở `src/components/` (ví dụ `RoomForm.tsx` dùng cho cả tính năng Thêm và Sửa).

---

## 3. 🧠 Bộ Câu hỏi Phản biện (Q&A) & Gợi ý Trả lời

Đây là các câu hỏi thầy giáo rất hay hỏi trong buổi bảo vệ môn ReactJS.

### Nhóm 1: Câu hỏi về ReactJS & Next.js Core

**Q1: Tại sao em lại chọn Next.js thay vì dùng React (Create React App/Vite) thuần?**
> **Trả lời:** Em chọn Next.js vì nó cung cấp sẵn hệ thống routing (App Router) rất tiện lợi dựa trên thư mục, không cần cài thêm `react-router-dom`. Ngoài ra, Next.js hỗ trợ SSR (Server-Side Rendering) giúp trang tải nhanh hơn và tốt cho SEO nếu sau này em muốn public link cho khách tìm kiếm trên Google. 

**Q2: Trong Next.js 13+ (App Router), Client Component và Server Component khác nhau thế nào? Dự án của em dùng cái nào?**
> **Trả lời:** 
> - **Server Component**: Render hoàn toàn trên server, không gửi JS về client, giúp tải nhanh và an toàn (giấu được API keys). Mặc định trong Next.js các component là Server Component.
> - **Client Component**: Render trên trình duyệt (client), cho phép dùng các React Hooks như `useState`, `useEffect` và bắt sự kiện người dùng (`onClick`, `onChange`). Để báo cho Next.js biết đây là Client Component, em thêm dòng `"use client"` ở đầu file.
> - Trong dự án, các file UI tĩnh hoặc fetching dữ liệu ban đầu em dùng Server Component. Còn các file có form tương tác, xử lý trạng thái (như `RoomForm.tsx`) em bắt buộc dùng Client Component (khai báo `"use client"`).

**Q3: Dự án của em quản lý State (trạng thái) như thế nào? Em có dùng Redux không?**
> **Trả lời:** Dạ dự án của em không dùng Redux vì quy mô state chia sẻ toàn cục chưa quá lớn. Em chủ yếu sử dụng **Local State** thông qua hook `useState` của React để quản lý dữ liệu form (input chữ, danh sách ảnh đang preview). Dữ liệu server (danh sách phòng) thì em fetch trực tiếp từ Supabase.

### Nhóm 2: Câu hỏi về Hooks & Lifecycle

**Q4: Em dùng `useEffect` trong trường hợp nào?**
> **Trả lời:** Em dùng `useEffect` chủ yếu cho các side-effects, ví dụ như: Fetch dữ liệu từ Supabase khi component vừa mount (vừa render xong lên màn hình), hoặc để thực hiện các thao tác tính toán lại (như format giá tiền) khi một dependency (biến phụ thuộc) nào đó thay đổi.

**Q5: Làm sao em xử lý việc upload nhiều ảnh và hiển thị preview (xem trước) trước khi bấm submit?**
> **Trả lời:** Khi người dùng chọn file, em lấy mảng danh sách file đó lưu vào một state (`useState`). Đồng thời, để hiển thị ảnh preview, em dùng `URL.createObjectURL(file)` để tạo ra một đường dẫn tạm thời cho từng file và render chúng ra màn hình thông qua thẻ `<img>`.

### Nhóm 3: Câu hỏi về Component & Tái sử dụng Code

**Q6: Em thấy trang Add (Thêm) và Edit (Sửa) thường có form giống nhau. Em xử lý việc này thế nào để tránh lặp code?**
> **Trả lời:** Dạ em tạo một component dùng chung là `<RoomForm />` ở thư mục `components/`. Component này nhận các props như `initialData` (dữ liệu ban đầu, dùng cho Edit) và `onSubmit` (hàm xử lý khi submit). 
> - Nếu là trang Add, em không truyền `initialData`.
> - Nếu là trang Edit, em truyền thông tin phòng đang sửa vào `initialData` để form tự động điền (fill) dữ liệu.

### Nhóm 4: Câu hỏi về Backend & Database (Supabase)

**Q7: Nếu public link trang admin này ra thì ai cũng có thể sửa hoặc xóa dữ liệu của em sao? Cách khắc phục là gì?**
> **Trả lời:** Dạ đúng ạ. Hiện tại trang `/admin` em đang để public hoàn toàn và RLS (Row Level Security) trên Supabase đang mở để tiện cho việc demo. 
> Tuy nhiên, định hướng tiếp theo của em (roadmap) là sẽ tích hợp **Supabase Auth**. Em sẽ tạo form Login, bảo vệ route `/admin` bằng middleware của Next.js (chỉ ai có session mới vào được), và đồng thời cập nhật lại RLS trên database chỉ cho phép role `authenticated` (người dùng đã đăng nhập) mới được quyền INSERT/UPDATE/DELETE.

**Q8: Tại sao em lại lưu URL ảnh dưới dạng mảng (Array of Strings) trong Database?**
> **Trả lời:** Vì mỗi phòng thường có nhiều góc chụp khác nhau (phòng ngủ, bếp, nhà vệ sinh). Việc lưu một mảng `text[]` trực tiếp trong bảng `rooms` của PostgreSQL giúp query dữ liệu nhanh và tiện hơn là việc tạo thêm một bảng phụ `room_images` rồi join lại. Ảnh vật lý (file) thì em đã lưu trên Supabase Storage.

---

## 💡 Lời khuyên khi Demo:

1. **Chuẩn bị dữ liệu mẫu:** Nhập sẵn 3-4 phòng với thông tin, hình ảnh thật đẹp để app nhìn sinh động khi demo.
2. **Thực hiện đúng luồng:** Bắt đầu từ trang chủ (khách hàng xem) -> Vào `/admin` thêm phòng mới -> Ra trang chủ xem phòng mới hiện lên -> Vào lại `/admin` sửa giá tiền -> Xóa thử 1 phòng.
3. **Mở sẵn VS Code:** Mở sẵn các file quan trọng như `page.tsx` (trang chủ), `RoomForm.tsx` (component form), và `schema.sql` (cấu trúc DB). Khi thầy hỏi tới đâu, mở file code ra chỉ tay vào đó tới đó.
4. **Tự tin thừa nhận thiếu sót:** Nếu thầy chỉ ra lỗi hoặc tính năng chưa có (như việc thiếu Auth trang admin), hãy tự tin trình bày giải pháp ở mục định hướng (như câu Q7). Các thầy rất thích sinh viên biết nhận thức vấn đề và có hướng giải quyết.

Chúc bạn báo cáo thành công xuất sắc! 🚀
