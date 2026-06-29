-- Lead events + PostGIS geo columns for location-aware search (Phase 3)

create table if not exists lead_events (
  id            uuid primary key default gen_random_uuid(),
  listing_id    text,
  listing_type  text not null default 'unknown',
  action_type   text not null,
  user_lat      double precision,
  user_lng      double precision,
  created_at    timestamptz not null default now()
);

create index if not exists lead_events_created_idx on lead_events (created_at desc);
create index if not exists lead_events_listing_idx on lead_events (listing_type, listing_id);

alter table lead_events enable row level security;

drop policy if exists lead_events_public_insert on lead_events;
create policy lead_events_public_insert on lead_events
  for insert with check (true);

drop policy if exists lead_events_admin_read on lead_events;
create policy lead_events_admin_read on lead_events
  for select using (is_admin());

-- PostGIS geography points (backfill from lat/lng where present)
create extension if not exists postgis;

alter table homestays
  add column if not exists geo_location geography(point, 4326);

alter table restaurants
  add column if not exists geo_location geography(point, 4326);

update homestays
set geo_location = st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
where latitude is not null
  and longitude is not null
  and geo_location is null;

update restaurants
set geo_location = st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
where latitude is not null
  and longitude is not null
  and geo_location is null;

create index if not exists homestays_geo_idx on homestays using gist (geo_location);
create index if not exists restaurants_geo_idx on restaurants using gist (geo_location);

-- Partner subscriptions placeholder (Razorpay phase 2)
create table if not exists partner_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references profiles(id) on delete cascade,
  plan_tier     text not null default 'free' check (plan_tier in ('free', 'verified', 'premium')),
  status        text not null default 'active',
  razorpay_ref  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table partner_subscriptions enable row level security;

drop policy if exists partner_subscriptions_owner_read on partner_subscriptions;
create policy partner_subscriptions_owner_read on partner_subscriptions
  for select using (owner_id = auth.uid() or is_admin());
