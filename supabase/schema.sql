-- Portfolio + Blog CMS schema
-- Run this once in your Supabase project's SQL Editor (Supabase Dashboard -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Categories (your field categories, e.g. "Networking", "AI Data Annotation")
-- ─────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Blog posts
-- ─────────────────────────────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category_id uuid references categories(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Site settings (single row) — drives theme + bio shown on the public site
-- ─────────────────────────────────────────────
create table if not exists site_settings (
  id int primary key default 1,
  site_name text not null default 'Your Name',
  tagline text not null default 'Technician & AI Data Annotation Specialist',
  bio text not null default '',
  primary_color text not null default '#E63946',
  accent_color text not null default '#1D3557',
  dark_mode boolean not null default false,
  avatar_url text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  github_url text,
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- Keep updated_at fresh on posts
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security
-- Public (anon) can only READ published posts and categories/settings.
-- Only an authenticated user (you, the admin) can write.
-- ─────────────────────────────────────────────
alter table categories enable row level security;
alter table posts enable row level security;
alter table site_settings enable row level security;

create policy "public read categories" on categories
  for select using (true);
create policy "admin write categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read published posts" on posts
  for select using (published = true or auth.role() = 'authenticated');
create policy "admin write posts" on posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read settings" on site_settings
  for select using (true);
create policy "admin write settings" on site_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Storage bucket for cover images / avatar
-- Run this too — it's idempotent.
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin upload media" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin update media" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Starter categories — edit/add your own from /admin/categories
-- ─────────────────────────────────────────────
insert into categories (name, slug, description) values
  ('IT & Networking', 'it-networking', 'Computer repair, network setup, technical support'),
  ('AI & Data Annotation', 'ai-data-annotation', 'Data labeling, annotation quality, AI training data'),
  ('Software Development', 'software-development', 'Web apps, tools, and projects I build')
on conflict (slug) do nothing;
