-- Canonical curated Kotagiri stays directory (14 listings).
-- Curated = unowned (owner_id null), published. Idempotent on slug.
-- NOTE: the live helloKTG DB was seeded by evolving prior data; this file
-- reproduces the canonical set on a fresh project. Keep in sync with the DB.
insert into homestays (slug, name, type, area, rating, reviews_count, host_phone, website_url, is_published)
values
  ('airy-home-stay',              'Airy Home Stay',              'Home Stay',         'Ketti',              4.9, 40,  '09035081711',  null,                                         true),
  ('cloud-nine-resorts',          'Cloud Nine Resorts',          'Resort',            'Kodanad',            4.1, 127, '08460485956',  null,                                         true),
  ('green-pearl-cottages',        'Green Pearl Cottages',        'Resort / Cottages', 'Konavakorai',        4.1, 226, null,           'http://www.greenpearlcottage.com/',          true),
  ('ivc-villa',                   'IVC Villa',                   'Villa',             'Milidane',           3.7, 433, null,           null,                                         true),
  ('misty-valley-b-b',            'Misty Valley B&B',            'B&B',               'Aravenu',            4.6, 21,  '919962541214', null,                                         true),
  ('nithya-valley-view',          'Nithya Valley View',          'Homestay',          'Aravenu',            4.8, 192, '08147099516',  'http://www.thehoneycomb.in/',                true),
  ('oraganic-farmer-estate-view', 'Oraganic Farmer Estate View', 'Cottages On Rent',  'Aravenu',            4.8, 5,   '09054623315',  null,                                         true),
  ('peri-resorts',                'Peri Resorts',                'Resort',            'Donnington',         4.1, 197, null,           null,                                         true),
  ('pine-edge-cottage',           'Pine Edge Cottage',           'Cottage',           'Near Longwood Shola',4.5, 9,   '919962541214', null,                                         true),
  ('silvertip-homestay',          'Silvertip Homestay',          'Homestay',          'Aravenu',            4.7, 58,  '919381107922', 'https://silvertipcafe.com/silvertip-homestay/',true),
  ('sunset-camping-glamping',     'Sunset Camping & Glamping',   'Camping',           'Aravenu',            null,null,'919381107922', 'https://silvertipcafe.com/sunset/',          true),
  ('tea-estate-homestay',         'Tea Estate Homestay',         'Homestay',          'Kotagiri',           4.8, 32,  '919962541214', null,                                         true),
  ('trilan-cottages',             'Trilan Cottages',             'Cottage',           'Kannerimukku',       4.4, 421, '919962541214', 'http://www.trilancottages.com/',             true),
  ('white-house-resort',          'White House Resort',          'Resort',            'Donnington',         4.6, 275, null,           null,                                         true)
on conflict (slug) do nothing;
