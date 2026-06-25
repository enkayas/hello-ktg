-- Travel Kotagiri — evolve the existing curated-directory schema into a
-- city guide (stays + dining + more) WITH per-owner self-service.
--
-- Pre-existing tables (kept): homestays, restaurants (public directory),
-- listing_submissions ("list your property" intake), enquiries (leads).
--
-- This migration ADDS:
--   * profiles            — owner/admin accounts (1:1 with auth.users)
--   * ownership           — owner_id + slug on homestays & restaurants
--   * homestay_photos     — galleries (Storage-backed)
--   * blocked_dates       — owner availability for stays
--   * bookings            — request-to-book workflow for owned stays
--   * RLS                 — owners edit only their own listings; public reads
--                           published; guests create booking requests.
--
-- Model split: curated (unowned) listings keep the WhatsApp/enquiry flow;
-- owner-claimed listings gain request-to-book.

-- ---------------------------------------------------------------------------
-- Enums & helpers
-- ---------------------------------------------------------------------------
create type user_role      as enum ('owner', 'admin');
create type booking_status as enum ('requested', 'approved', 'declined', 'cancelled', 'completed');

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------------------------------------------------------------------------
-- profiles  (created before is_admin() which references it)
-- ---------------------------------------------------------------------------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  phone      text,        -- intl, no '+', e.g. 919962541214
  whatsapp   text,
  role       user_role not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- SECURITY DEFINER so it bypasses RLS on profiles (avoids recursive policies).
create or replace function is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, phone)
  values (new.id, new.email, new.phone)
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Ownership + booking-engine columns on existing directory tables
-- ---------------------------------------------------------------------------
alter table homestays
  add column owner_id   uuid references profiles(id) on delete set null,
  add column slug       text unique,            -- SEO: /stays/<slug>
  add column base_price numeric(10,2),          -- per night, INR (numeric for math)
  add column max_guests int default 2,
  add column bedrooms   int,
  add column bathrooms  int,
  add column amenities  text[] default '{}',
  add column latitude   double precision,
  add column longitude  double precision,
  add column updated_at timestamptz not null default now();
create index homestays_owner_idx on homestays(owner_id);
create trigger homestays_updated before update on homestays
  for each row execute function set_updated_at();

alter table restaurants
  add column owner_id   uuid references profiles(id) on delete set null,
  add column slug       text unique,
  add column latitude   double precision,
  add column longitude  double precision,
  add column updated_at timestamptz not null default now();
create index restaurants_owner_idx on restaurants(owner_id);
create trigger restaurants_updated before update on restaurants
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- homestay_photos  (gallery; files in the "property-photos" Storage bucket)
-- ---------------------------------------------------------------------------
create table homestay_photos (
  id           uuid primary key default gen_random_uuid(),
  homestay_id  uuid not null references homestays(id) on delete cascade,
  storage_path text not null,
  alt          text,
  sort_order   int default 0,
  is_cover     boolean default false,
  created_at   timestamptz not null default now()
);
create index homestay_photos_homestay_idx on homestay_photos(homestay_id);

-- ---------------------------------------------------------------------------
-- blocked_dates  (owner availability; powers the calendar)
-- ---------------------------------------------------------------------------
create table blocked_dates (
  id          uuid primary key default gen_random_uuid(),
  homestay_id uuid not null references homestays(id) on delete cascade,
  date        date not null,
  reason      text,
  unique (homestay_id, date)
);
create index blocked_dates_homestay_idx on blocked_dates(homestay_id);

-- ---------------------------------------------------------------------------
-- bookings  (request-to-book for OWNED stays; owner approves/declines)
-- ---------------------------------------------------------------------------
create table bookings (
  id          uuid primary key default gen_random_uuid(),
  homestay_id uuid not null references homestays(id) on delete cascade,
  owner_id    uuid not null references profiles(id) on delete cascade, -- denormalized for RLS
  guest_name  text not null,
  guest_phone text not null,
  guest_email text,
  check_in    date not null,
  check_out   date not null,
  guests      int  not null default 2,
  notes       text,
  amount      numeric(10,2),
  status      booking_status not null default 'requested',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);
create index bookings_homestay_idx on bookings(homestay_id);
create index bookings_owner_idx    on bookings(owner_id);
create trigger bookings_updated before update on bookings
  for each row execute function set_updated_at();

-- ===========================================================================
-- Row-Level Security  (existing public-read / public-insert policies kept)
-- ===========================================================================
alter table profiles        enable row level security;
alter table homestay_photos enable row level security;
alter table blocked_dates   enable row level security;
alter table bookings        enable row level security;

-- profiles
create policy profiles_self_select on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_self_insert on profiles
  for insert with check (id = auth.uid());
create policy profiles_self_update on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- homestays: keep "public read published"; add owner/admin access.
create policy homestays_owner_read on homestays
  for select using (owner_id = auth.uid() or is_admin());
create policy homestays_owner_insert on homestays
  for insert with check (owner_id = auth.uid() or is_admin());
create policy homestays_owner_update on homestays
  for update using (owner_id = auth.uid() or is_admin())
  with check (owner_id = auth.uid() or is_admin());
create policy homestays_owner_delete on homestays
  for delete using (owner_id = auth.uid() or is_admin());

-- restaurants: same pattern.
create policy restaurants_owner_read on restaurants
  for select using (owner_id = auth.uid() or is_admin());
create policy restaurants_owner_insert on restaurants
  for insert with check (owner_id = auth.uid() or is_admin());
create policy restaurants_owner_update on restaurants
  for update using (owner_id = auth.uid() or is_admin())
  with check (owner_id = auth.uid() or is_admin());
create policy restaurants_owner_delete on restaurants
  for delete using (owner_id = auth.uid() or is_admin());

-- homestay_photos
create policy photos_public_read on homestay_photos
  for select using (
    exists (select 1 from homestays h where h.id = homestay_id
            and (h.is_published = true or h.owner_id = auth.uid() or is_admin()))
  );
create policy photos_owner_write on homestay_photos
  for all using (
    exists (select 1 from homestays h where h.id = homestay_id
            and (h.owner_id = auth.uid() or is_admin()))
  ) with check (
    exists (select 1 from homestays h where h.id = homestay_id
            and (h.owner_id = auth.uid() or is_admin()))
  );

-- blocked_dates: availability is public; only owner/admin edit.
create policy blocked_public_read on blocked_dates
  for select using (true);
create policy blocked_owner_write on blocked_dates
  for all using (
    exists (select 1 from homestays h where h.id = homestay_id
            and (h.owner_id = auth.uid() or is_admin()))
  ) with check (
    exists (select 1 from homestays h where h.id = homestay_id
            and (h.owner_id = auth.uid() or is_admin()))
  );

-- bookings: anyone may request, but only against a published, OWNED stay with a
-- correctly denormalized owner_id. Only the owner/admin can read or update.
create policy bookings_guest_insert on bookings
  for insert with check (
    exists (select 1 from homestays h
            where h.id = homestay_id and h.is_published = true
            and h.owner_id is not null and h.owner_id = bookings.owner_id)
  );
create policy bookings_owner_read on bookings
  for select using (owner_id = auth.uid() or is_admin());
create policy bookings_owner_update on bookings
  for update using (owner_id = auth.uid() or is_admin())
  with check (owner_id = auth.uid() or is_admin());

-- listing_submissions & enquiries: keep public insert; add owner/admin read.
create policy submissions_admin_read on listing_submissions
  for select using (is_admin());
create policy enquiries_owner_read on enquiries
  for select using (is_admin());

-- ===========================================================================
-- Storage bucket for property photos (public read, authenticated write)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

create policy "property photos public read" on storage.objects
  for select using (bucket_id = 'property-photos');
create policy "property photos auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-photos');
create policy "property photos auth update" on storage.objects
  for update to authenticated using (bucket_id = 'property-photos');
create policy "property photos auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'property-photos');
