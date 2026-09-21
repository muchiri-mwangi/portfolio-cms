-- Migration 007: admin needs to list all customer profiles for the
-- "Customers" admin page. The only existing policy on profiles lets a
-- user read their own row — that's not enough for the admin to see who's
-- registered.
-- Run after 001-006.

create policy "admin read all profiles" on profiles
  for select using (is_admin());
