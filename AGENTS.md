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

## Roadmap & Status

1. **Auth cho `/admin`** — [x] Supabase Auth, login email/password, middleware bảo vệ route.
2. **Trang chi tiết phòng** `/phong/[id]` — [x] Carousel ảnh, mô tả phong phú (FormattedText), nút liên hệ.
3. **Nút liên hệ nhanh** — [x] `tel:`, Zalo, WhatsApp, Facebook cho 2 tư vấn viên (Vũ & Hân Mỹ).
4. **Filter/search & Phân trang** — [x] Lọc giá (VND/USD), quận, loại phòng, trạng thái, tìm từ khoá & phân trang (6 phòng/trang).
5. **Form Admin & Description Formatter** — [x] Tự động chèn dấu chấm giá tiền, ô Description tự động mở rộng (auto-expand) khi gõ/dán văn bản dài, toolbar định dạng (Bold, H3, Bullet, Checkmark, Numbered) & live preview.
6. **Bản đồ CartoDB Voyager & 5 Ngôn ngữ** — [x] 🇬🇧 EN, 🇰🇷 KO, 🇨🇳 ZH, 🇷🇺 RU, 🇻🇳 VI.
7. **Deploy Vercel** — [x] Deploy live tại `https://apartment-management-topaz.vercel.app`.

## Không được làm

- Không đổi tên field trong bảng `rooms` mà không cập nhật đồng bộ `types/room.ts`, `RoomForm.tsx`, và các trang list/detail.
- Không hardcode Supabase URL/key trong code — luôn qua `process.env.NEXT_PUBLIC_SUPABASE_*` (xem `lib/supabase.ts`).
- Không xoá comment RLS policy "chưa dùng" trong `schema.sql` — đó là bản để dùng khi thêm Auth ở bước roadmap #1.