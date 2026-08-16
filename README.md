# 🏠 Apartment Management

> A modern web application to replace spreadsheet-based apartment/room rental management. Built with Next.js, TypeScript, and Supabase. Share a single link with tenants to view available rooms with photos.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=flat-square&logo=vercel)](https://apartment-management-topaz.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Usage](#-usage)
- [Current Status](#-current-status)
- [Roadmap](#-roadmap)
- [Code Conventions](#-code-conventions)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ Features

### ✅ Implemented

- **📱 Responsive Design** — Mobile-first UI with Tailwind CSS
- **➕ Full CRUD Operations** — Create, read, update, delete rooms at `/admin` dashboard
- **🖼️ Multi-image Upload** — Upload multiple photos per room to Supabase Storage
- **📊 Public Listing Page** — Grid view of all available rooms with key details
- **🗄️ PostgreSQL Database** — Structured data storage via Supabase
- **🔐 Row Level Security (RLS)** — Database-level access control policies
- **⚡ Real-time Updates** — Instant data synchronization
- **🎨 Dark-friendly UI** — Orange accent color scheme with stone background

### 📅 Upcoming (Roadmap)

- **🔐 Admin Authentication** — Supabase Auth (email/password) with protected routes
- **🔍 Advanced Filtering** — Search and filter by price, district, room type, status
- **📄 Room Detail Page** — Full-screen room info at `/phong/[id]` with carousel
- **📞 Quick Contact Buttons** — Phone, Zalo, WhatsApp, Facebook direct links
- **🗺️ Google Maps Integration** — Embed map view of room location
- **⭐ Favorites System** — Save favorite rooms (client-side)

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | Next.js (App Router) | 16.3.1 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.0 |
| **Build Tool** | Turbopack | Built-in |
| **Backend/Database** | Supabase (PostgreSQL) | Latest |
| **Storage** | Supabase Storage | Latest |
| **Authentication** | Supabase Auth | (Planned) |
| **Deployment** | Vercel | - |

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Public listing page
│   │   ├── admin/
│   │   │   ├── page.tsx            # Admin dashboard
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Create new room form
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit room form
│   │   ├── phong/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Room detail page (planned)
│   │   ├── globals.css
│   │   └── error.tsx
│   ├── components/
│   │   └── RoomForm.tsx            # Shared form for create/edit (upload, validation)
│   ├── lib/
│   │   └── supabase.ts             # Supabase client configuration
│   └── types/
│       └── room.ts                 # TypeScript types & status labels
├── supabase/
│   └── schema.sql                  # Database schema + RLS policies
├── public/
│   └── ...                         # Static assets
├── .env.local                      # Environment variables (git ignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ & **npm** 9+
- **Supabase Account** — Free tier at [supabase.com](https://supabase.com)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/iamvu3006/Apartment_management.git
cd Apartment_management
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Navigate to **SQL Editor**
4. Paste the entire contents of `supabase/schema.sql` and execute

#### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**How to find these values:**
- Open your Supabase project → **Settings** → **API**
- Copy **Project URL** and **Anon Key** (public key)

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Public page**: `/` — View all room listings
- **Admin page**: `/admin` — Manage rooms

---

## 📊 Database Schema

### Table: `rooms`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, auto-generated |
| `title` | `text` | Room title (e.g., "Phòng trọ 2 cửa sổ") |
| `price` | `numeric` | Monthly rent in VND |
| `area` | `numeric` | Room size in m² |
| `address` | `text` | Full address |
| `district` | `text` | Area/district name |
| `room_type` | `text` | Type: "Phòng trọ", "Căn hộ", etc. |
| `status` | `text` | `trong` (available), `da_coc` (deposit), `da_thue` (rented) |
| `description` | `text` | Detailed description |
| `images` | `text[]` | Array of image URLs (Supabase Storage) |
| `created_at` | `timestamptz` | Auto timestamp |
| `updated_at` | `timestamptz` | Auto timestamp |

### Storage Bucket: `room-images`

- **Path Format**: `room-images/{roomId}/{filename}`
- **Public**: Yes (read-only for unauthenticated users)

### RLS Policies

| Policy | Current | Planned |
|--------|---------|---------|
| **Public Read** | ✅ Enabled | ✅ Keep |
| **Admin Write** | ✅ Public (demo) | 🔄 Restricted to authenticated users |

---

## 💻 Usage

### Creating a Room

1. Navigate to `/admin/new`
2. Fill in room details:
   - Title, price, area, address, district, room type
   - Description (optional)
3. Upload images (multiple files supported)
4. Click **Thêm phòng** (Add room)
5. Redirects to `/admin` on success

### Editing a Room

1. Go to `/admin`
2. Click edit icon on any room card
3. Modify fields and/or upload new images
4. Click **Cập nhật** (Update)

### Deleting a Room

1. Go to `/admin`
2. Click delete icon (⛔)
3. Confirm deletion

### Viewing Public Listings

1. Visit `/` (home page)
2. See all available rooms in a grid
3. Click on a room card to see details (when room detail page is ready)

---

## 📈 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| CRUD operations | ✅ Complete | Fully functional at `/admin` |
| Multi-image upload | ✅ Complete | Stored in Supabase Storage |
| Public listing view | ✅ Complete | Grid layout, responsive |
| Admin authentication | ❌ Not started | High priority (security) |
| Search & filtering | ❌ Not started | Medium priority |
| Room detail page | ❌ Not started | Medium priority |
| Quick contact buttons | ❌ Not started | Low priority |
| Deployment | ✅ Active | Running on Vercel |
| Google Maps embed | ❌ Not started | Nice-to-have |

### ⚠️ Important Security Note

**The `/admin` route is currently publicly accessible without authentication.** Anyone with the URL can create, edit, or delete rooms. This is acceptable for demo purposes only.

**Before sharing your link with real tenants:**
1. Implement Supabase Auth (see Roadmap #1)
2. Update RLS policies to restrict write access to authenticated users only
3. See commented policies in `supabase/schema.sql` for reference

---

## 🗺️ Roadmap

### Phase 1: Security (High Priority) 🔐
- [ ] Implement Supabase Auth (email/password)
- [ ] Add login page at `/auth/login`
- [ ] Protect `/admin` route with auth middleware
- [ ] Update RLS policies to restrict write access
- [ ] Add logout functionality

### Phase 2: User Experience (Medium Priority) 👥
- [ ] Create `/phong/[id]` room detail page
- [ ] Build image carousel for room photos
- [ ] Add quick contact buttons (phone, Zalo, WhatsApp, Facebook)
- [ ] Implement search bar on public page

### Phase 3: Filtering & Discovery (Medium Priority) 🔍
- [ ] Filter by price range (min/max)
- [ ] Filter by district/area
- [ ] Filter by room type
- [ ] Filter by availability status
- [ ] Sort options (price, newest, area)

### Phase 4: Enhancements (Low Priority) ✨
- [ ] Google Maps integration
- [ ] Favorites/bookmarks system
- [ ] View count per room
- [ ] Contact form (email notifications)
- [ ] Admin statistics dashboard

### Phase 5: Polish & Scale (Optional) 🚀
- [ ] Dark mode toggle
- [ ] i18n support (Vietnamese, English)
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Analytics integration

---

## 🎨 Code Conventions

### Language & Communication

- **UI & Comments**: Vietnamese (Tiếng Việt)
- **Variables, Functions, Files**: English (Next.js/React conventions)
- **Commit Messages**: Vietnamese

### Styling

- **CSS Framework**: Tailwind CSS utility classes only
- **Color Scheme**: 
  - Primary accent: `orange-600`
  - Background: `stone-50` / `stone-100`
  - Dark text: `slate-900`
- **No separate CSS files** (except `globals.css`)
- **Component Style**: Function components with `"use client"` directive for interactivity

### Components

- **Type**: Function components only (no class components)
- **State Management**: React hooks (`useState`, `useEffect`)
- **Async Calls**: `useEffect` + try-catch patterns
- **Error Handling**: User-friendly error messages

### Database

- **Schema Updates**: Modify `supabase/schema.sql`, then re-run in SQL Editor
- **Never**: Delete/rename schema columns without updating related code
- **Sync**: Always keep `types/room.ts` in sync with database schema

### Files to Know

- `AGENTS.md` — Detailed conventions and roadmap (this acts as project spec)
- `lib/supabase.ts` — Supabase client config (don't hardcode credentials)
- `types/room.ts` — All type definitions and constants
- `supabase/schema.sql` — Source of truth for database structure

---

## 🔐 Security

### Current State (Demo)

- ✅ Environment variables stored in `.env.local` (git ignored)
- ✅ RLS policies exist (currently open for demo)
- ❌ No authentication layer
- ❌ Anyone can modify/delete data

### Production Checklist

- [ ] Enable Supabase Auth
- [ ] Update RLS policies to `authenticated` role
- [ ] Remove public write access
- [ ] Set up HTTPS (automatic on Vercel)
- [ ] Review Supabase security settings
- [ ] Test permission boundaries
- [ ] Monitor access logs

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "chore: prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Select your GitHub repo
   - Select framework preset: **Next.js**

3. **Add Environment Variables**
   - In Vercel dashboard: **Settings** → **Environment Variables**
   - Add both:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```
   - Redeploy

4. **Custom Domain (Optional)**
   - Vercel dashboard → **Domains**
   - Add your custom domain
   - Update DNS records

### Verifying Deployment

Visit your Vercel project URL (or custom domain):
- Public page should load
- Admin dashboard should be accessible
- Image uploads should work

---

## 🔨 Available Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

### For Personal Use
Since this is a personal project, direct contributions are not expected. However, if you spot bugs or have suggestions:

1. Open an [Issue](https://github.com/iamvu3006/Apartment_management/issues)
2. Describe the problem clearly
3. Include screenshots if relevant

### For Learning/Forking
Feel free to fork this project and use it as a template for your own room/apartment listing app!

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 👤 Author

**Vu** — IT Student, HCMC University of Technology (Vietnam-Japan Program)

- 🔗 GitHub: [@iamvu3006](https://github.com/iamvu3006)
- 💼 Email: [contact info]
- 🌐 Live Demo: [apartment-management-topaz.vercel.app](https://apartment-management-topaz.vercel.app)

---

## 📝 Changelog

### v0.1.0 (Current)
- Initial release with core CRUD functionality
- Multi-image upload support
- Public listing page
- Admin dashboard
- Supabase integration

---

<div align="center">

Made with ❤️ in Vietnam

⭐ If you find this helpful, consider giving a star!

</div>
