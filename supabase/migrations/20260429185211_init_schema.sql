-- SafeStep initial schema
-- Tables: sanctuary_spaces, hazard_reports
-- Geo via PostGIS. Public read-only with RLS.

create extension if not exists postgis;

-- ============================================================
-- Sanctuary spaces
-- ============================================================
create type sanctuary_kind as enum ('cafe', 'pharmacy', 'bar', 'store');

create table sanctuary_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind sanctuary_kind not null,
  address text not null,
  description text,
  location geography(point, 4326) not null,
  is_open_now boolean not null default true,
  hours_text text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index sanctuary_spaces_location_idx on sanctuary_spaces using gist (location);

-- ============================================================
-- Hazard reports (Structural Audit)
-- ============================================================
create type hazard_status as enum ('new', 'verified', 'resolved');
create type hazard_kind as enum ('broken_light', 'blocked_walkway', 'poor_visibility', 'unsafe_crossing', 'other');

create table hazard_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind hazard_kind not null,
  status hazard_status not null default 'new',
  description text,
  location geography(point, 4326),
  created_at timestamptz not null default now()
);

create index hazard_reports_created_idx on hazard_reports (created_at desc);

-- ============================================================
-- Row-level security
-- ============================================================
alter table sanctuary_spaces enable row level security;
create policy "public can read sanctuary spaces"
  on sanctuary_spaces for select to anon, authenticated using (true);

alter table hazard_reports enable row level security;
create policy "public can read hazard reports"
  on hazard_reports for select to anon, authenticated using (true);
create policy "anyone can submit hazard reports"
  on hazard_reports for insert to anon, authenticated with check (status = 'new');

-- ============================================================
-- Geo views (lat/lng for client convenience — avoids PostGIS WKB on the wire)
-- ============================================================
create or replace view sanctuary_spaces_geo as
select
  id, name, kind, address, description,
  st_y(location::geometry) as lat,
  st_x(location::geometry) as lng,
  is_open_now, hours_text, verified, created_at
from sanctuary_spaces;

create or replace view hazard_reports_geo as
select
  id, title, kind, status, description,
  st_y(location::geometry) as lat,
  st_x(location::geometry) as lng,
  created_at
from hazard_reports;
