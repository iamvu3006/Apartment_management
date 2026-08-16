-- Chạy đoạn SQL này trong Supabase Dashboard > SQL Editor

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric not null default 0,
  area numeric not null default 0,
  address text not null default '',
  district text not null default '',
  room_type text not null default '',
  status text not null default 'trong' check (status in ('trong', 'da_coc', 'da_thue')),
  description text,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Bật Row Level Security
alter table rooms enable row level security;

-- XOÁ POLICY DEMO CŨ (NẾU CÓ) VÀ BẬT SECURITY THEO AUTH
drop policy if exists "Public full access (demo only)" on rooms;

create policy "Public can view rooms"
  on rooms for select
  using (true);

create policy "Authenticated users can insert rooms"
  on rooms for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update rooms"
  on rooms for update
  to authenticated
  using (true);

create policy "Authenticated users can delete rooms"
  on rooms for delete
  to authenticated
  using (true);

-- Storage bucket để lưu ảnh phòng
insert into storage.buckets (id, name, public)
values ('room-images', 'room-images', true)
on conflict (id) do nothing;

create policy "Public can view room images"
  on storage.objects for select
  using (bucket_id = 'room-images');

drop policy if exists "Public can upload room images (demo only)" on storage.objects;
drop policy if exists "Public can delete room images (demo only)" on storage.objects;

create policy "Authenticated users can upload room images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'room-images');

create policy "Authenticated users can delete room images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'room-images');
