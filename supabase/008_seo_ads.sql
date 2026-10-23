-- Migration 008: SEO verification tags, Google Analytics, AdSense readiness,
-- and admin control over extra robots.txt disallow rules.
-- Run after 001-007.

alter table site_settings
  add column if not exists google_site_verification text,
  add column if not exists bing_site_verification text,
  add column if not exists facebook_domain_verification text,
  add column if not exists google_analytics_id text,
  add column if not exists adsense_publisher_id text,
  add column if not exists ads_enabled boolean not null default false,
  add column if not exists robots_disallow_extra text;
