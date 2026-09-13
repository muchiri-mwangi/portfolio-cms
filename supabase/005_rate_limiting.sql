-- Migration 005: rate limiting for public forms
-- Run after 001-004.

create table if not exists submission_log (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  identifier text not null, -- email or IP, whichever the form has
  created_at timestamptz not null default now()
);

create index if not exists submission_log_lookup
  on submission_log (form_type, identifier, created_at);

alter table submission_log enable row level security;

-- No public policies on purpose — this is only ever read/written by the
-- server's service-role client (src/lib/rate-limit.ts), never the browser.
create policy "admin read submission log" on submission_log
  for select using (auth.role() = 'authenticated');
