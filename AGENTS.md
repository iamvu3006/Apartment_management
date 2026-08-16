# AGENTS.md — Context cho AI coding agent

Đây là dự án cá nhân của Vũ (sinh viên IT, Đại học Bách Khoa Đà Nẵng, chương trình Việt-Nhật), đang làm song song vai trò tư vấn bán/cho thuê phòng căn hộ. Mục tiêu: thay thế việc quản lý phòng cho thuê bằng Excel bằng 1 web app có ảnh, deploy được, gửi link cho khách xem.

## Quy ước chung

- **Ngôn ngữ giao tiếp**: tiếng Việt trong UI, comment, commit message. Tên biến/hàm/file: tiếng Anh chuẩn convention của Next.js/React.
- **Style code**: giữ nguyên style hiện có trong `RoomForm.tsx` — function component, `"use client"` khi cần state/interactivity, không dùng class component.
- **Styling**: Tailwind utility classes trực tiếp trong JSX, không tạo file CSS riêng (trừ `globals.css` mặc định của Next.js). Màu chủ đạo: cam (`orange-600`) làm accent, nền `stone-50`/`stone-100`.
- **Không tạo file thừa**: ưu tiên sửa/mở rộng file có sẵn hơn là tạo file mới nếu chức năng liên quan chặt.

## Database schema (Supabase — bảng `rooms`)

| Field | Kiểu | Ghi chú |
|---|---|---|
| id | uuid | PK, auto |
| title | text | Tiêu đề phòng |
| price | numeric | Giá/tháng |
| area | numeric | Diện tích m² |
| address | text | Địa chỉ |
| district | text | Khu vực/quận |
| room_type | text | Loại phòng (tự do nhập, chưa enum) |
| status | text | `trong` \| `da_coc` \| `da_thue` |
| description | text | Mô tả |
| images | text[] | Mảng URL ảnh (Supabase Storage bucket `room-images`) |
| created_at | timestamptz | auto |

Schema đầy đủ + RLS policies: xem `supabase/schema.sql`. **Không sửa schema trực tiếp trên Supabase dashboard** — luôn sửa trong file này rồi chạy lại, để có version control.

## ⚠️ Điểm quan trọng cần biết trước khi code tiếp

1. **RLS đang mở public hoàn toàn** (policy "Public full access (demo only)") để chạy CRUD nhanh cho deadline. **Chưa an toàn để public link cho khách thật** — bất kỳ ai biết URL Supabase đều sửa/xoá được dữ liệu. Việc tiếp theo bắt buộc trước khi chia sẻ link cho khách: thêm Supabase Auth (email/password) cho `/admin`, sau đó đổi RLS sang chỉ cho `authenticated` (đã viết sẵn policy, đang comment trong `schema.sql`).
2. **Không có middleware bảo vệ route `/admin`** — hiện route này public 100%, ai có link cũng vào sửa được, không chỉ là vấn đề RLS.
3. Supabase project hiện tại: `iamvu3006's Project` (dùng riêng cho app này, **không phải** project WorkKPI — đã tách ra sau khi lỡ chạy nhầm schema vào project WorkKPI).

## Roadmap (theo độ ưu tiên)

1. **Auth cho `/admin`** — Supabase Auth, 1 tài khoản duy nhất (chủ web), redirect nếu chưa login, siết lại RLS.
2. **Trang chi tiết phòng** `/phong/[id]` — full ảnh, mô tả, nút liên hệ.
3. **Nút liên hệ nhanh** — `tel:`, `https://zalo.me/<sđt>`, `https://wa.me/<sđt>`, link Facebook.
4. **Filter/search** trên trang public — theo giá, khu vực, loại phòng, trạng thái.
5. **Deploy Vercel** — thêm env vars trên Vercel dashboard, kết nối GitHub repo.
6. (Optional) Bản đồ Google Maps embed theo địa chỉ phòng.

## Không được làm

- Không đổi tên field trong bảng `rooms` mà không cập nhật đồng bộ `types/room.ts`, `RoomForm.tsx`, và các trang list/detail.
- Không hardcode Supabase URL/key trong code — luôn qua `process.env.NEXT_PUBLIC_SUPABASE_*` (xem `lib/supabase.ts`).
- Không xoá comment RLS policy "chưa dùng" trong `schema.sql` — đó là bản để dùng khi thêm Auth ở bước roadmap #1.