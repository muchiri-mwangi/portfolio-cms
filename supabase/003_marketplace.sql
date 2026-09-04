-- Migration 003: marketplace (digital products + orders)
-- Run this in the Supabase SQL Editor after 001 and 002

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  type text not null default 'template' check (type in ('template', 'ebook')),
  price_kes numeric not null default 0,
  cover_image_url text,
  file_path text, -- path inside the private 'digital-products' storage bucket
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  buyer_name text,
  buyer_email text not null,
  amount numeric not null,
  currency text not null default 'KES',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  intasend_checkout_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table products enable row level security;
alter table orders enable row level security;

create policy "public read published products" on products
  for select using (published = true or auth.role() = 'authenticated');
create policy "admin write products" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders are only ever read/written by the server using the service-role key
-- (order creation, IntaSend webhook, download page), which bypasses RLS.
-- No public policies here on purpose — orders contain buyer emails.
create policy "admin read orders" on orders
  for select using (auth.role() = 'authenticated');

-- Private bucket for the actual downloadable files. Never made public —
-- files are served via short-lived signed URLs generated after payment.
insert into storage.buckets (id, name, public)
values ('digital-products', 'digital-products', false)
on conflict (id) do nothing;

-- No public read policy on purpose. Only the admin (uploading files) and the
-- server's service-role client (generating signed download URLs after
-- payment) can touch this bucket.
create policy "admin upload digital products" on storage.objects
  for insert with check (bucket_id = 'digital-products' and auth.role() = 'authenticated');
create policy "admin manage digital products" on storage.objects
  for select using (bucket_id = 'digital-products' and auth.role() = 'authenticated');
create policy "admin update digital products" on storage.objects
  for update using (bucket_id = 'digital-products' and auth.role() = 'authenticated');
create policy "admin delete digital products" on storage.objects
  for delete using (bucket_id = 'digital-products' and auth.role() = 'authenticated');
