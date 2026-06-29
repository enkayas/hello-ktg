-- Property → units model (Airbnb-style: one listing, many bookable units).
-- homestays = property; property_units = rooms, cottages, villas, tents, etc.

create type unit_type as enum (
  'room', 'villa', 'cottage', 'tent', 'dome', 'suite', 'dormitory', 'cabin', 'other'
);

create table property_units (
  id          uuid primary key default gen_random_uuid(),
  homestay_id uuid not null references homestays(id) on delete cascade,
  name        text not null,
  unit_type   unit_type not null default 'room',
  description text,
  max_guests  int not null default 2,
  bedrooms    int,
  bathrooms   int,
  base_price  numeric(10,2),
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index property_units_homestay_idx on property_units(homestay_id);

create trigger property_units_updated before update on property_units
  for each row execute function set_updated_at();

-- Photos: unit_id null = property-level; set = unit-level gallery
alter table homestay_photos
  add column if not exists unit_id uuid references property_units(id) on delete cascade;

create index homestay_photos_unit_idx on homestay_photos(unit_id);

-- Bookings & availability can target a specific unit
alter table bookings
  add column if not exists unit_id uuid references property_units(id) on delete set null;

alter table blocked_dates
  add column if not exists unit_id uuid references property_units(id) on delete cascade;

-- Allow same date blocked per unit (drop whole-property-only unique)
alter table blocked_dates drop constraint if exists blocked_dates_homestay_id_date_key;
create unique index blocked_dates_property_date_idx
  on blocked_dates(homestay_id, date) where unit_id is null;
create unique index blocked_dates_unit_date_idx
  on blocked_dates(homestay_id, unit_id, date) where unit_id is not null;

-- Backfill: one default unit per existing property
insert into property_units (homestay_id, name, unit_type, max_guests, bedrooms, bathrooms, base_price, sort_order)
select
  h.id,
  h.name,
  case
    when lower(h.type) like '%villa%' then 'villa'::unit_type
    when lower(h.type) like '%cottage%' then 'cottage'::unit_type
    when lower(h.type) like '%camp%' or lower(h.type) like '%tent%' then 'tent'::unit_type
    when lower(h.type) like '%resort%' then 'suite'::unit_type
    else 'room'::unit_type
  end,
  coalesce(h.max_guests, 2),
  h.bedrooms,
  h.bathrooms,
  h.base_price,
  0
from homestays h
where not exists (select 1 from property_units u where u.homestay_id = h.id);

alter table property_units enable row level security;

create policy units_public_read on property_units
  for select using (
    exists (
      select 1 from homestays h
      where h.id = homestay_id
        and (h.is_published = true or h.owner_id = auth.uid() or is_admin())
    )
  );

create policy units_owner_write on property_units
  for all using (
    exists (
      select 1 from homestays h
      where h.id = homestay_id and (h.owner_id = auth.uid() or is_admin())
    )
  ) with check (
    exists (
      select 1 from homestays h
      where h.id = homestay_id and (h.owner_id = auth.uid() or is_admin())
    )
  );

-- Extend photo policies for unit-scoped photos (owner write unchanged via homestay join)
drop policy if exists photos_public_read on homestay_photos;
create policy photos_public_read on homestay_photos
  for select using (
    exists (
      select 1 from homestays h where h.id = homestay_id
        and (h.is_published = true or h.owner_id = auth.uid() or is_admin())
    )
  );
