-- Migration 006: customer accounts + a real admin role.
--
-- IMPORTANT CONTEXT: every "admin write" policy so far has checked
-- auth.role() = 'authenticated' — i.e. "any logged-in Supabase user".
-- That was safe only because the admin was the ONLY account that could
-- ever log in. The moment customers get their own accounts, that stops
-- being true — a logged-in customer would otherwise pass every one of
-- those checks too. This migration introduces a real admin/customer role
-- and rewrites every existing admin policy to check it.
--
-- Run after 001-005.

-- ─────────────────────────────────────────────
-- Profiles: one row per Supabase Auth user, defaults to 'customer'
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row (role defaults to 'customer') whenever anyone
-- signs up or logs in for the first time — including via magic link.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill: your existing admin login gets role = 'admin' explicitly.
-- (This is Peter's known auth user id — leave as-is.)
insert into profiles (id, email, role)
values ('b85b5bd0-87e6-4525-b2a0-36236203839a', 'peterhopes2020@gmail.com', 'admin')
on conflict (id) do update set role = 'admin';

-- security definer so it can check any user's profile regardless of that
-- user's own RLS, which is exactly what every policy below needs.
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ─────────────────────────────────────────────
-- Rewrite every existing admin policy: auth.role() = 'authenticated' -> is_admin()
-- ─────────────────────────────────────────────
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "public read published posts" on posts;
create policy "public read published posts" on posts for select using (published = true or is_admin());
drop policy if exists "admin write posts" on posts;
create policy "admin write posts" on posts for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all using (is_admin()) with check (is_admin());

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and is_admin());

drop policy if exists "admin read subscribers" on newsletter_subscribers;
create policy "admin read subscribers" on newsletter_subscribers for select using (is_admin());

drop policy if exists "public read published products" on products;
create policy "public read published products" on products for select using (published = true or is_admin());
drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders for select using (is_admin());

drop policy if exists "admin upload digital products" on storage.objects;
create policy "admin upload digital products" on storage.objects for insert with check (bucket_id = 'digital-products' and is_admin());
drop policy if exists "admin manage digital products" on storage.objects;
create policy "admin manage digital products" on storage.objects for select using (bucket_id = 'digital-products' and is_admin());
drop policy if exists "admin update digital products" on storage.objects;
create policy "admin update digital products" on storage.objects for update using (bucket_id = 'digital-products' and is_admin());
drop policy if exists "admin delete digital products" on storage.objects;
create policy "admin delete digital products" on storage.objects for delete using (bucket_id = 'digital-products' and is_admin());

drop policy if exists "admin write product categories" on product_categories;
create policy "admin write product categories" on product_categories for all using (is_admin()) with check (is_admin());

drop policy if exists "admin manage coupons" on coupons;
create policy "admin manage coupons" on coupons for all using (is_admin()) with check (is_admin());

drop policy if exists "public read approved reviews" on reviews;
create policy "public read approved reviews" on reviews for select using (approved = true or is_admin());
drop policy if exists "admin moderate reviews" on reviews;
create policy "admin moderate reviews" on reviews for update using (is_admin());
drop policy if exists "admin delete reviews" on reviews;
create policy "admin delete reviews" on reviews for delete using (is_admin());

drop policy if exists "public read published services" on services;
create policy "public read published services" on services for select using (published = true or is_admin());
drop policy if exists "admin write services" on services;
create policy "admin write services" on services for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read service orders" on service_orders;
create policy "admin read service orders" on service_orders for select using (is_admin());
drop policy if exists "admin update service orders" on service_orders;
create policy "admin update service orders" on service_orders for update using (is_admin());

drop policy if exists "admin read submission log" on submission_log;
create policy "admin read submission log" on submission_log for select using (is_admin());

-- ─────────────────────────────────────────────
-- New: customers can read their own orders (for "My Library")
-- ─────────────────────────────────────────────
create policy "customers read own orders" on orders
  for select using (buyer_email = auth.jwt() ->> 'email');
create policy "customers read own service orders" on service_orders
  for select using (buyer_email = auth.jwt() ->> 'email');
