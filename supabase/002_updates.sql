-- Migration 002: blog brand name + newsletter subscribers
-- Run this in the Supabase SQL Editor after 001 (schema.sql)

alter table site_settings
  add column if not exists blog_name text not null default 'Muchiri';

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- Public can subscribe (insert only) but never read the list back.
create policy "public can subscribe" on newsletter_subscribers
  for insert with check (true);
create policy "admin read subscribers" on newsletter_subscribers
  for select using (auth.role() = 'authenticated');
