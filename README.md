# Room Listing — Quản lý phòng cho thuê

Web app thay thế Excel để quản lý danh sách phòng trọ/căn hộ cho thuê, kèm ảnh, và chia sẻ link cho khách xem trực tiếp.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres (database) + Storage (ảnh) + Auth (chưa dùng, sẽ thêm sau)
- Deploy dự kiến: **Vercel**

## Cấu trúc thư mục

src/
├── app/
│ ├── page.tsx # Trang public — danh sách phòng
│ ├── admin/
│ │ ├── page.tsx # Dashboard admin — list + sửa/xoá
│ │ ├── new/page.tsx # Form thêm phòng
│ │ └── [id]/edit/page.tsx # Form sửa phòng
├── components/
│ └── RoomForm.tsx # Form dùng chung cho thêm/sửa (upload ảnh, validate)
├── lib/
│ └── supabase.ts # Supabase client (browser)
└── types/
└── room.ts # Type Room, RoomInput, labels trạng thái
supabase/
└── schema.sql # SQL tạo bảng rooms + bucket room-images + RLS policies


## Setup

1. Cài dependency:
```bash
   npm install
```

2. Tạo project Supabase mới → vào **SQL Editor** → chạy toàn bộ `supabase/schema.sql`.

3. Tạo file `.env.local` ở thư mục gốc:

NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-hoặc-publishable-key>


4. Chạy dev server:
```bash
   npm run dev
```
   Mở `http://localhost:3000` (trang public) và `http://localhost:3000/admin` (quản trị).

## Trạng thái hiện tại

- ✅ CRUD phòng đầy đủ (Create/Read/Update/Delete) tại `/admin`
- ✅ Upload nhiều ảnh lên Supabase Storage
- ✅ Trang public hiển thị danh sách phòng dạng lưới
- ❌ **`/admin` chưa có đăng nhập** — ai có link cũng sửa/xoá được (đang ở chế độ demo, RLS mở public tạm thời — xem comment trong `schema.sql`)
- ❌ Chưa có filter/tìm kiếm (giá, khu vực, loại phòng)
- ❌ Chưa có trang chi tiết từng phòng (`/phong/[id]`)
- ❌ Chưa có nút liên hệ nhanh (gọi điện, Zalo, WhatsApp, Facebook)
- ❌ Chưa deploy lên Vercel

Xem `AGENTS.md` để biết chi tiết quy ước code và roadmap.