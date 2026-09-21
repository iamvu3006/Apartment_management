# 🎓 Tài liệu Chuẩn bị Báo cáo Project ReactJS

Tài liệu này tổng hợp toàn bộ kiến thức, các khái niệm trọng tâm trong môn học ReactJS (State, Store/Redux, Props/Callback, Routing...) và liên hệ trực tiếp vào mã nguồn của dự án **"Apartment Management"** để giúp bạn tự tin trả lời mọi câu hỏi của thầy giáo.

---

## 1. 🌟 Tổng quan Dự án (Project Overview)

- **Tên dự án**: Apartment Management (Quản lý phòng trọ / Căn hộ cho thuê).
- **Mục tiêu**: Thay thế quản lý danh sách phòng bằng Excel truyền thống sang một Web App hiện đại, trực quan, hỗ trợ khách thuê xem ảnh, tìm kiếm, lưu phòng yêu thích và liên hệ tư vấn.
- **Công nghệ cốt lõi**:
  - **Framework**: Next.js 16 (xây dựng trên nền tảng ReactJS, sử dụng App Router).
  - **Ngôn ngữ**: TypeScript (Type safety, hạn chế runtime bug).
  - **Styling**: Tailwind CSS (Utility classes trực tiếp trong JSX).
  - **State Management**: React Context API (`AppContext`) kết hợp `localStorage` (đóng vai trò Global Store).
  - **Backend / Database**: Supabase (PostgreSQL Database & Supabase Storage lưu ảnh).
  - **Triển khai (Deploy)**: Vercel.

---

## 2. 🧩 Bản đồ Kiến thức Môn học ReactJS trong Dự án

Dưới đây là cách dự án áp dụng các kiến thức bạn đã học trong chương trình ReactJS:

| Khái niệm môn học | Cách dự án triển khai thực tế | Vị trí trong Source Code |
| :--- | :--- | :--- |
| **Local State** | Quản lý state cục bộ cho từng component qua hook `useState` (dữ liệu form, ô search, filter, popup modal). | `src/components/RoomForm.tsx`, `src/app/page.tsx` |
| **Global State / Store** | Sử dụng **React Context API** (`createContext`, `useContext`) làm Store trung tâm để chia sẻ state giữa các trang (ngôn ngữ, tiền tệ VND/USD, danh sách saved/favorites). | `src/context/AppContext.tsx` |
| **Redux vs Context API** | Dự án chọn React Context API thay cho Redux vì dự án có quy mô vừa phải, Context có sẵn trong React, gọn nhẹ và không cần setup boilerplate phức tạp như Redux Toolkit. | `src/context/AppContext.tsx` |
| **Props (Data Down)** | Truyền dữ liệu từ component cha xuống component con (ví dụ: danh sách rooms truyền vào Map/Card, `initialData` truyền vào Form). | `RoomCard`, `RoomForm`, `RoomMapInner` |
| **Callbacks (Events Up)** | Truyền hàm xử lý từ cha xuống con để component con kích hoạt hành động ngược lên cha (ví dụ: `onSubmit`, `toggleFavorite`, `onFilterChange`). | `RoomForm.tsx` (`onSubmit`), `AppContext.tsx` (`toggleFavorite`) |
| **Lifecycle & Side Effects** | Sử dụng `useEffect` để fetch dữ liệu từ Supabase, nạp dữ liệu từ `localStorage`, hoặc update DOM khi dependency thay đổi. | `src/app/page.tsx`, `src/context/AppContext.tsx` |
| **Routing (React Router vs Next.js)** | Next.js App Router sử dụng **File-system Routing** (thay cho `react-router-dom` `BrowserRouter`/`Routes`). Dùng `Link`, `useRouter`, `useParams`. | `src/app/page.tsx`, `src/app/phong/[id]/page.tsx`, `src/app/admin/page.tsx` |
| **Client Storage Persistence** | Sử dụng `localStorage` (Web Storage API) để duy trì state của người dùng (favorites, currency, language) ngay cả khi không đăng nhập tài khoản. | `src/context/AppContext.tsx` |

---

## 3. 🧠 Bộ Câu hỏi Phản biện (Q&A) Trọng tâm & Hướng Trả lời

---

### 🔥 CÂU HỎI QUAN TRỌNG NHẤT: Lưu Saved / Yêu thích khi KHÔNG đăng nhập?

**Q: Khi người dùng bấm lưu phòng (Saved / Favorites) mà không cần đăng nhập tài khoản, dữ liệu này được lưu ở đâu? Cơ chế hoạt động như thế nào?**

> **💡 Hướng trả lời chuẩn:**
> 1. **Nơi lưu trữ**: Dữ liệu danh sách ID các phòng được lưu trực tiếp tại **`localStorage` của trình duyệt Web** (Client-side Web Storage API) dưới key `"app_favorites"`.
> 2. **Cơ chế hoạt động**:
>    - Em sử dụng **React Context API** (`AppContext.tsx`) để tạo một Global State quản lý mảng `favorites` (chứa các `roomId`).
>    - Khi ứng dụng khởi chạy (component mount), một hook `useEffect` sẽ đọc từ `localStorage.getItem("app_favorites")` và nạp vào React State `favorites`.
>    - Khi người dùng bấm vào icon trái tim: Hàm callback `toggleFavorite(roomId)` được gọi -> kiểm tra nếu ID đã có thì xóa (filter), chưa có thì thêm vào -> cập nhật lại React State và đồng thời ghi đè dữ liệu mới vào `localStorage.setItem("app_favorites", JSON.stringify(updated))`.
>    - Tại trang `/saved`, em chỉ cần lấy `favorites` từ Context và lọc (`filter`) các phòng có ID nằm trong mảng này để hiển thị.
> 3. **Ưu điểm & Hạn chế**:
>    - *Ưu điểm*: Khách vào web không cần mất thời gian tạo tài khoản hay đăng nhập vẫn có thể lưu phòng; khi reload trang hay quay lại sau vài ngày dữ liệu vẫn còn.
>    - *Hạn chế*: Dữ liệu chỉ nằm trên trình duyệt của máy đó, không đồng bộ sang máy khác.
>    - *Mở rộng tương lai*: Khi tích hợp Supabase Auth cho người dùng, em sẽ đồng bộ danh sách này lên bảng `user_favorites` trên Supabase Database.

---

### 📦 NHÓM 1: State, Store & Redux

**Q1: Khái niệm State trong React là gì? Trong dự án em phân chia State như thế nào?**
> **Trả lời:** State là đối tượng lưu trữ dữ liệu động của component, khi State thay đổi thì React sẽ tự động re-render lại UI tương ứng. Trong dự án, em chia làm 2 loại State:
> - **Local State**: Quản lý qua `useState` cho các dữ liệu cục bộ của 1 màn hình/component (ví dụ: các ô input trong `RoomForm`, từ khóa tìm kiếm trong ô search, danh sách ảnh xem trước).
> - **Global State**: Quản lý qua `AppContext` cho các dữ liệu cần chia sẻ xuyên suốt nhiều trang khác nhau (tiền tệ VND/USD, ngôn ngữ giao diện, danh sách phòng yêu thích).

**Q2: Tại sao em dùng React Context API làm Store mà không dùng Redux? So sánh 2 cái này?**
> **Trả lời:** 
> - **Điểm tương đồng**: Cả Redux và Context API đều giải quyết bài toán "Prop Drilling" (truyền props qua quá nhiều cấp component trung gian) và cung cấp một Central Store để chia sẻ dữ liệu toàn ứng dụng.
> - **Lý do chọn Context API**: Context API là tính năng có sẵn (built-in) của React, rất nhẹ, dễ triển khai, hoàn toàn đáp ứng tốt nhu cầu quản lý State toàn cục của dự án này (ngôn ngữ, tiền tệ, favorites).
> - **Khi nào nên dùng Redux**: Khi ứng dụng có quy mô lớn (Enterprise), lượng Global State khổng lồ, luồng cập nhật dữ liệu phức tạp cần quản lý qua Actions, Reducers, Middleware (Redux Thunk/Saga) hoặc cần công cụ debug mạnh mẽ như Redux DevTools.

---

### 🔄 NHÓM 2: Xử lý Dữ liệu (Props & Callbacks)

**Q3: Phân biệt Props và State? Dữ liệu trong React di chuyển theo chiều nào?**
> **Trả lời:**
> - **Dữ liệu trong React tuân theo luồng 1 chiều (Unidirectional Data Flow)**: Từ component cha xuống component con.
> - **State**: Do chính component đó quản lý nội bộ, có thể thay đổi được (`read-write`) thông qua hàm `setState`.
> - **Props**: Là tham số dữ liệu mà component cha truyền xuống cho component con, component con chỉ được phép đọc (`read-only`), không được trực tiếp sửa đổi props.

**Q4: Làm thế nào để truyền dữ liệu từ Component con ngược lên Component cha? (Khái niệm Callback)**
> **Trả lời:** React sử dụng kỹ thuật **Lifting State Up (Nâng State lên)** kết hợp với **Callback Function**:
> - Component cha khai báo một hàm xử lý (handler function) và truyền hàm đó xuống component con dưới dạng một **Prop** (ví dụ: `onSubmit={handleSaveRoom}`).
> - Khi có sự kiện xảy ra ở component con (ví dụ user bấm nút Submit), con sẽ gọi thực thi hàm callback này và truyền dữ liệu của con vào tham số: `props.onSubmit(formData)`.
> - Nhờ đó, component cha nhận được dữ liệu từ con để cập nhật State của cha.

---

### 🚦 NHÓM 3: Routing (React Router vs Next.js App Router)

**Q5: So sánh React Router (`react-router-dom`) và Router của Next.js?**
> **Trả lời:**
> - **React Router (`react-router-dom`)**: Là thư viện bên ngoài dành cho React SPA (Single Page Application). Ta phải tự cấu hình bằng code JSX (`<BrowserRouter>`, `<Routes>`, `<Route path="/admin" element={<Admin />} />`).
> - **Next.js App Router**: Là hệ thống **File-system Based Routing** được tích hợp sẵn. Next.js tự động biến cấu trúc thư mục thành đường dẫn URL mà không cần viết code định tuyến:
>   - `src/app/page.tsx` $\rightarrow$ Route `/`
>   - `src/app/admin/page.tsx` $\rightarrow$ Route `/admin`
>   - `src/app/phong/[id]/page.tsx` $\rightarrow$ Dynamic Route `/phong/:id` (nhận tham số ID động).
> - **Các khái niệm tương đương**:
>   - Chuyển trang không reload: `<Link to="...">` (React Router) $\leftrightarrow$ `<Link href="...">` (Next.js).
>   - Hook điều hướng bằng code: `useNavigate()` $\leftrightarrow$ `useRouter()` từ `next/navigation`.
>   - Lấy tham số URL: `useParams()` $\leftrightarrow$ `useParams()` từ `next/navigation`.

---

### ⚡ NHÓM 4: Next.js & Server/Client Components

**Q6: Server Component và Client Component trong Next.js khác nhau như thế nào?**
> **Trả lời:**
> - **Server Component** (Mặc định trong Next.js): Được render sẵn trên máy chủ (Server), không gửi JavaScript xuống trình duyệt, giúp trang web load cực nhanh, an toàn cho API keys và tối ưu SEO.
> - **Client Component** (Khai báo `"use client"` ở đầu file): Được thực thi ở trình duyệt người dùng. Bắt buộc phải dùng Client Component khi:
>   - Cần dùng các React Hooks (`useState`, `useEffect`, `useContext`).
>   - Cần lắng nghe tương tác người dùng (`onClick`, `onChange`, `onSubmit`).
>   - Cần truy cập Web API của trình duyệt như `localStorage`, `window`, `navigator`.

---

### 🛡️ NHÓM 5: Supabase & Bảo mật Backend

**Q7: Backend của em dùng gì? Dữ liệu ảnh và thông tin phòng được lưu trữ như thế nào?**
> **Trả lời:** Em sử dụng **Supabase (Backend-as-a-Service)**:
> - **Cơ sở dữ liệu**: PostgreSQL với bảng `rooms` lưu trữ các trường thông tin (tiêu đề, giá, diện tích, địa chỉ, loại phòng, trạng thái, mô tả).
> - **Mảng ảnh (`images text[]`)**: Em lưu một mảng các đường link ảnh (URL) trực tiếp trong cột `images` của bảng `rooms`.
> - **Lưu trữ file ảnh thực tế**: File ảnh được tải lên Supabase Storage (Bucket `room-images`), sau đó lấy Public URL lưu vào Database.

**Q8: Nếu trang `/admin` ai có link cũng vào được thì bảo mật thế nào? Hướng giải quyết?**
> **Trả lời:** Hiện tại em để trang Admin và RLS (Row Level Security) ở chế độ Public để thuận tiện cho việc demo đồ án. Hướng nâng cấp chuẩn bảo mật của em là:
> 1. Sử dụng **Supabase Auth** (xác thực email/password).
> 2. Viết **Middleware** trong Next.js để chặn người dùng chưa đăng nhập khi cố truy cập vào route `/admin/*`.
> 3. Kích hoạt lại **RLS Policies** trong PostgreSQL: Chỉ cho phép tài khoản có quyền `authenticated` mới được thực hiện các lệnh INSERT, UPDATE, DELETE.

---

## 🎯 Kịch bản Demo Gợi ý (Trình bày trong 3-5 phút)

1. **Mở đầu (30s)**: "Em xin chào thầy. Dự án của em là Website Quản lý Căn hộ/Phòng trọ cho thuê bằng Next.js & Supabase, giải quyết bài toán quản lý phòng trực quan thay cho Excel."
2. **Demo Khách hàng (1.5 phút)**:
   - Trang chủ: Lướt xem danh sách phòng (Grid layout, phân trang 6 phòng/trang).
   - Test bộ lọc & tìm kiếm: Lọc theo quận/huyện, mức giá, loại phòng.
   - Test đổi đơn vị tiền tệ (VND $\leftrightarrow$ USD) và đổi Ngôn ngữ $\rightarrow$ *nhấn mạnh đây là Global State dùng Context API*.
   - Test tính năng **Lưu yêu thích (Saved)**: Bấm trái tim một vài phòng $\rightarrow$ Chuyển sang trang `/saved` $\rightarrow$ *giải thích dữ liệu được đồng bộ vào `localStorage` và Global Context*.
   - Vào chi tiết 1 phòng `/phong/[id]`: Xem carousel ảnh, map vị trí, thông tin chi tiết và nút liên hệ Zalo/Phone.
3. **Demo Admin Dashboard (1 phút)**:
   - Vào `/admin` $\rightarrow$ Thêm 1 phòng mới (upload nhiều ảnh, nhập giá có tự động format dấu chấm).
   - Ra trang chủ kiểm tra phòng mới xuất hiện ngay lập tức.
   - Vào sửa hoặc xóa phòng.
4. **Kết luận & Hướng phát triển (30s)**: Tóm tắt lại công nghệ sử dụng và định hướng thêm Auth/Phân quyền cho hệ thống.

---
Chúc bạn có một buổi báo cáo thành công rực rỡ và đạt điểm A+! 🚀
