-- Brand assets: logos for light / dark / neutral backgrounds (Supabase Storage + metadata)

insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', true)
on conflict (id) do update set public = true;

create table if not exists site_assets (
  id           text primary key,
  kind         text not null check (kind in ('wordmark', 'icon')),
  background   text not null check (background in ('light', 'dark', 'neutral')),
  storage_path text not null,
  alt          text not null default '',
  width        int,
  height       int,
  updated_at   timestamptz not null default now()
);

create trigger site_assets_updated before update on site_assets
  for each row execute function set_updated_at();

alter table site_assets enable row level security;

create policy "site assets public read" on site_assets
  for select using (true);

create policy "site assets admin write" on site_assets
  for all using (is_admin()) with check (is_admin());

create policy "brand assets public read" on storage.objects
  for select using (bucket_id = 'brand-assets');

create policy "brand assets admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'brand-assets' and is_admin());

create policy "brand assets admin update" on storage.objects
  for update to authenticated using (bucket_id = 'brand-assets' and is_admin());

create policy "brand assets admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'brand-assets' and is_admin());

-- Metadata (files uploaded to brand-assets/<storage_path>)
insert into site_assets (id, kind, background, storage_path, alt, width, height) values
  ('wordmark-light', 'wordmark', 'light', 'helloKotagiri-logo-light.png', 'HelloKotagiri', 623, 152),
  ('wordmark-dark',  'wordmark', 'dark',  'helloKotagiri-logo-dark.png',  'HelloKotagiri', 623, 152),
  ('icon-light',     'icon',     'light', 'icon-ink.png',                 'HelloKotagiri bird', 1043, 926),
  ('icon-dark',      'icon',     'dark',  'icon-white.png',               'HelloKotagiri bird', 1043, 926),
  ('icon-neutral',   'icon',     'neutral','icon-gold.png',               'HelloKotagiri bird', 1043, 926)
on conflict (id) do update set
  storage_path = excluded.storage_path,
  alt = excluded.alt,
  width = excluded.width,
  height = excluded.height,
  updated_at = now();
