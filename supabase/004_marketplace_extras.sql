-- Migration 004: marketplace categories, discounts, reviews, and a
-- services/gig platform with its own order + delivery workflow.
-- Run after 001, 002, 003.

-- ─────────────────────────────────────────────
-- Marketplace categories (separate from blog categories)
-- ─────────────────────────────────────────────
create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table products
  add column if not exists category_id uuid references product_categories(id) on delete set null,
  add column if not exists compare_at_price_kes numeric; -- original price, for showing a strikethrough discount

alter table product_categories enable row level security;
create policy "public read product categories" on product_categories
  for select using (true);
create policy "admin write product categories" on product_categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Coupons — Peter's own discount control at checkout
-- ─────────────────────────────────────────────
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off int,
  amount_off_kes numeric,
  active boolean not null default true,
  expires_at timestamptz,
  max_redemptions int,
  times_redeemed int not null default 0,
  created_at timestamptz not null default now(),
  constraint has_a_discount check (percent_off is not null or amount_off_kes is not null)
);

alter table coupons enable row level security;
-- No public policy at all: coupons are only ever read/validated by the
-- server's service-role client during checkout, and managed by the admin
-- via the authenticated client.
create policy "admin manage coupons" on coupons
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Product reviews — public can submit, admin approves before it shows
-- ─────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;
create policy "public read approved reviews" on reviews
  for select using (approved = true or auth.role() = 'authenticated');
create policy "public submit reviews" on reviews
  for insert with check (true);
create policy "admin moderate reviews" on reviews
  for update using (auth.role() = 'authenticated');
create policy "admin delete reviews" on reviews
  for delete using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Services (gigs) — ordered work, not an instant download
-- ─────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  price_kes numeric not null default 0,
  delivery_days int not null default 3,
  cover_image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists service_orders (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  buyer_name text,
  buyer_email text not null,
  requirements text,
  amount numeric not null,
  currency text not null default 'KES',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'in_progress', 'delivered', 'completed', 'failed')),
  intasend_checkout_id text,
  delivery_note text,
  delivery_file_path text, -- private path in the 'digital-products' bucket
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  delivered_at timestamptz
);

alter table services enable row level security;
alter table service_orders enable row level security;

create policy "public read published services" on services
  for select using (published = true or auth.role() = 'authenticated');
create policy "admin write services" on services
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Same pattern as orders: no public policy. Service orders are only ever
-- touched by the service-role client (checkout, webhook, order/delivery
-- page) or by the admin.
create policy "admin read service orders" on service_orders
  for select using (auth.role() = 'authenticated');
create policy "admin update service orders" on service_orders
  for update using (auth.role() = 'authenticated');
