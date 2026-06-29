-- Curated places (things to do) and hidden gems — public directory tables.

create table if not exists places (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  place_type    text,
  area          text,
  description   text,
  image_url     text,
  host_phone    text,
  latitude      double precision,
  longitude     double precision,
  best_time     text,
  difficulty    text,
  suits         text,
  filters       text[] default '{}',
  badges        text[] default '{}',
  owner_id      uuid references profiles(id) on delete set null,
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  geo_location  geography(point, 4326),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists hidden_gems (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text,
  description   text,
  image_url     text,
  host_phone    text,
  latitude      double precision,
  longitude     double precision,
  distance_label text,
  badges        text[] default '{}',
  owner_id      uuid references profiles(id) on delete set null,
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  geo_location  geography(point, 4326),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists places_slug_idx on places(slug);
create index if not exists places_published_idx on places(is_published) where is_published = true;
create index if not exists places_geo_idx on places using gist (geo_location);
create index if not exists hidden_gems_slug_idx on hidden_gems(slug);
create index if not exists hidden_gems_published_idx on hidden_gems(is_published) where is_published = true;
create index if not exists hidden_gems_geo_idx on hidden_gems using gist (geo_location);

drop trigger if exists places_updated on places;
create trigger places_updated before update on places
  for each row execute function set_updated_at();

drop trigger if exists hidden_gems_updated on hidden_gems;
create trigger hidden_gems_updated before update on hidden_gems
  for each row execute function set_updated_at();

alter table places enable row level security;
alter table hidden_gems enable row level security;

drop policy if exists places_public_read on places;
create policy places_public_read on places
  for select using (is_published = true or owner_id = auth.uid() or is_admin());

drop policy if exists places_owner_write on places;
create policy places_owner_write on places
  for all using (owner_id = auth.uid() or is_admin());

drop policy if exists hidden_gems_public_read on hidden_gems;
create policy hidden_gems_public_read on hidden_gems
  for select using (is_published = true or owner_id = auth.uid() or is_admin());

drop policy if exists hidden_gems_owner_write on hidden_gems;
create policy hidden_gems_owner_write on hidden_gems
  for all using (owner_id = auth.uid() or is_admin());

-- Curated seed (idempotent on slug)
insert into places (slug, name, place_type, area, description, best_time, difficulty, suits, filters, is_published)
values
  ('kodanad', 'Kodanad Viewpoint', 'Viewpoint', 'Kodanad', '220° panorama over the Moyar valley — best at sunrise.', 'Sunrise', 'Easy', 'All ages', array['Viewpoints','Family Friendly','Senior Friendly'], true),
  ('catherine', 'Catherine Falls', 'Waterfall', 'Aravenu', '250-ft double cascade in the Nilgiris.', 'Jul–Dec', 'Moderate', 'Families', array['Waterfalls','Nature','Family Friendly'], true),
  ('longwood', 'Longwood Shola', 'Forest', 'Kotagiri', 'Rare surviving shola rainforest with a quiet birding trail.', 'Early morning', 'Moderate', 'Families', array['Nature','Family Friendly'], true)
on conflict (slug) do nothing;

insert into hidden_gems (slug, name, category, description, distance_label, badges, is_published)
values
  ('elk-view', 'Elk Falls Quiet Viewpoint', 'Quiet viewpoint', 'Peaceful alternative to Catherine — misty mornings.', '7 km from Kotagiri', array['Local Pick','Best Morning'], true),
  ('tea-valley', 'Ellad Tea Valley Drive', 'Tea valley drive', 'Unmarked estate roads with no ticket counters.', 'Near Kotagiri', array['Local Pick','Good for Families'], true),
  ('bakery', 'Johnston Square Bakery', 'Local bakery', 'Fresh buns before the day-trippers arrive.', 'Kotagiri town', array['Local Pick','Good for Families'], true)
on conflict (slug) do nothing;
