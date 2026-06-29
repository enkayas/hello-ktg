# HelloKotagiri — Product Roadmap & Task List

> **Purpose:** Master checklist for Phase 2 and Phase 3. AI agents and the owner
> use this file to know what to build next. Read at the start of every session.
>
> **How to assign work (owner):** In a Cursor Cloud agent, say:
> *"Read ROADMAP.md. Complete the next unchecked Phase 2 item. Work autonomously,
> deploy when done, update checkboxes in ROADMAP.md."*
>
> **Status key:** `[x]` done · `[~]` partial · `[ ]` not started

**Last updated:** 2026-06-30 (Phase 2 largely complete; Phase 3 core items in progress)

---

## Already live (Phase 1 — do not break)

These exist today in `web/` + Supabase. Phase 2/3 **extend** this; do not remove.

- [x] Public site (home, stay, eat, things-to-do, hidden-gems, plan-my-trip, near-me)
- [x] Supabase backend (`homestays`, `restaurants`, `bookings`, `enquiries`, RLS)
- [x] Owner panel (`/owner`) — properties, photos, availability, bookings
- [x] Admin console (`/admin`) — approve listings, leads, claims
- [x] Request-to-book + WhatsApp
- [x] Deploy to hellokotagiri.com (Cloudflare Workers)
- [x] English/Tamil switch (partial — header, stays, booking; more pages in progress)
- [~] Owner claim + WhatsApp OTP verification

---

## Phase 2 — Smart discovery (mock data, no new backend)

**Goal:** Move from static travel site to smart local discovery platform.
**Rules:** Keep existing design. Mock data only. No Supabase changes. No auth. No payments. No OpenAI.

### 1. Real browser location awareness (`/near-me`)

- [x] Basic `navigator.geolocation` button exists
- [x] Store lat/lng in state; show “Location detected”
- [x] Haversine distance from user to each listing (mock coordinates)
- [x] Sort cards by distance when location allowed
- [x] Denied fallback: “Choose your base location” picker
- [x] Base options: Kotagiri, Ooty, Coonoor, Gudalur, Masinagudi, Coonoor Road, Aravenu, Kodanad
- [x] Mock coordinates on all near-me listings

### 2. Structured data models

- [x] Basic mock types in `web/src/data/mock/types.ts`
- [x] Full interfaces: `BusinessListing`, `StayListing`, `RestaurantListing`, `PlaceListing`, `HiddenGem`, `Itinerary`, `TravellerProfile`, `BusinessPlan`, `BadgeType`
- [x] Each listing: id, name, slug, category, subcategory, descriptions, locationName, lat/lng, images, tags, badges, bestFor, openingHours, phone, whatsapp, website, priceRange, isVerified, isFeatured

### 3. Detail pages

- [x] `/stays/[slug]` — stay detail (Supabase-backed)
- [x] `/things-to-do/[id]` — activity detail (unified `ListingDetail` + catalog)
- [~] `/explore/[id]` — attraction detail (legacy mock; low priority)
- [x] `/eat/[slug]` — restaurant detail
- [x] `/hidden-gems/[slug]` — hidden gem detail
- [x] Unified detail template: hero, badges, highlights, amenities, nearby, map placeholder, WhatsApp/Call/Directions/Save CTAs, notes (parking, walking, senior/kid friendly, weather)

### 4. Smart recommendation engine (mock rules)

- [x] `web/src/lib/recommendations.ts` — rule-based utility
- [x] Inputs: traveller type, interest, base, weather mock, time-of-day mock
- [x] Outputs: suggested places, food, stays, caution notes
- [x] Rules: seniors → low walking + parking; food interest → restaurants; rainy → cafés not waterfalls; evening → sunset + dinner; family → restrooms, parking, kid-friendly

### 5. Upgrade `/plan-my-trip`

- [x] Basic rule-based day plan exists
- [x] Richer itinerary: suggested base, day-wise plan, food + stay suggestions, hidden gems, caution notes
- [x] WhatsApp share placeholder
- [x] Printable / polished layout

### 6. Saved items (localStorage)

- [x] Save button on cards + detail pages
- [x] `/saved` page — stays, restaurants, places, hidden gems
- [x] Remove saved items

### 7. Route pages

- [x] `/routes` — route cards (Coimbatore→Kotagiri, Coimbatore→Ooty, Bangalore→Ooty via Mysore, Mysore→Masinagudi, Kotagiri→Coonoor, Kotagiri→Kodanad, Ooty→Avalanche)
- [x] Each card: distance, time, best stops, food, restroom, cautions, View Route
- [x] `/routes/[slug]` — overview, stops, food, viewpoints, road caution, best time, nearby stays

### 8. Business listing form (`/list-your-business`)

- [x] Basic form exists
- [x] Fields: category, type, address, Google Maps link, photo upload placeholder, amenities checkboxes, price range, preferred plan
- [x] Validate required fields; success message; store in localStorage (or console) — no backend yet

### 9. SEO and metadata

- [x] Basic metadata on hub and detail pages
- [x] Title + description + OpenGraph on eat, stay, things, gems, near-me, plan, routes, legal
- [x] Destination-specific titles
- [x] `/sitemap.xml` generated from live + mock listings

### 10. UI polish

- [x] White cards, shadows, light heroes (recent pass)
- [~] Loading skeletons (saved page)
- [x] Empty states (saved, near-me filters, trip planner)
- [x] Polished `/not-found` page
- [x] Location-denied states
- [~] Mobile spacing + a11y labels + responsive grids

---

## Phase 3 — Real backend, AI, monetisation

**Goal:** Scalable platform — businesses submit listings, admin approves, PostGIS nearby search, AI trip planner, partner plans.

**Note:** Much of Phase 3 **overlaps work already done** under different paths (`/owner` not `/partner/dashboard`, `homestays` not `stays` table). Extend existing schema; do not duplicate.

### 1. Supabase database schema

- [x] Core tables: `profiles`, `homestays`, `restaurants`, `bookings`, `enquiries`, `listing_submissions`
- [x] Migrations 0001–0007 (owner accounts, claims, OTP, property units)
- [x] PostGIS `geo_location` columns + spatial indexes (migration 0008)
- [~] Unified listing fields per spec (badges, best_for, amenities JSON, status workflow)
- [~] Tables: `routes`, `itineraries`, `saved_items` (server-side), `partner_subscriptions`, `reviews` (optional) — `partner_subscriptions` added; routes remain mock in app
- [ ] Document schema in `BACKEND-README.md`

### 2. Supabase client setup

- [x] `web/src/lib/supabase/` — public, client, server, admin
- [x] `web/.env.example`
- [x] Add `OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL` to `.env.example`

### 3. Authentication

- [x] Email auth — `/owner/login`
- [x] Roles: owner, admin in `profiles`
- [ ] Traveller role (optional, low priority)
- [ ] Alias routes: `/login`, `/signup` → owner flow (if needed)

### 4. Business owner dashboard

- [x] `/owner` — dashboard, properties CRUD, photos, availability, bookings
- [~] Listing status: draft → pending → published
- [ ] Lead enquiries per listing in dashboard
- [ ] Show plan tier: Free / Verified / Premium on dashboard

### 5. Admin dashboard

- [x] `/admin` — pending/published listings
- [x] `/admin/leads` — submissions, enquiries, ownership claims
- [x] Stats: total listings, pending, approved, featured, leads this month
- [ ] Mark verified / featured / plan type from admin UI

### 6. Backend connection for listings

- [x] `/stays` + `/stays/[slug]` from Supabase
- [x] `/eat` loads approved restaurants from Supabase (mock fallback)
- [x] `/things-to-do` loads approved places from Supabase (mock fallback)
- [x] `/hidden-gems` loads approved hidden gems from Supabase (mock fallback)
- [x] Detail pages resolve catalog slug OR Supabase id for all listing types
- [x] Graceful mock fallback when Supabase empty or unreachable

### 7. Location-aware search (PostGIS)

- [x] Radius filters: 1 / 5 / 15 / 30 km on `/near-me` (client Haversine; DB PostGIS ready)
- [ ] Query approved listings by distance when geolocation allowed (Supabase RPC)
- [x] Mock fallback from Phase 2 when Supabase not configured
- [x] Show distance in km

### 8. AI trip planner

- [x] API route `/api/plan-trip`
- [~] Pull approved places/restaurants/stays from Supabase (or mock) — mock catalog today
- [x] OpenAI generates structured day-wise itinerary JSON (when `OPENAI_API_KEY` set; rule-based fallback)
- [x] Render: morning/afternoon/evening, food, stays, cautions, responsible travel notes
- [x] No invented unsafe trails; caution for forests, waterfalls, night driving, private estates

### 9. Lead generation

- [x] `enquiries` table exists
- [x] Log leads on WhatsApp / Call / Directions / Enquiry clicks
- [x] Fields: listing_id, listing_type, action_type, user_location optional, created_at
- [x] API route for lead events

### 10. Partner pricing and monetisation

- [x] Plan copy on `/list-your-business` (Free / Featured / Premium)
- [x] Razorpay placeholder — “Proceed to Payment” button, no full integration yet
- [x] `partner_subscriptions` table structure

### 11. CMS / content management

- [ ] Admin forms for places, hidden gems, routes (or clean data structure + placeholders)
- [ ] Articles/guides (optional)

### 12. Production polish

- [~] Loading skeletons, error boundaries, empty states site-wide
- [ ] 404 page polish
- [x] Privacy policy, Terms, Responsible travel, Contact pages
- [ ] Sitemap-friendly routes
- [ ] Analytics placeholder
- [~] Image optimisation + OpenGraph site-wide

### 13. Security and validation

- [x] RLS — owners see only their rows; public sees published only
- [x] Server guards on `/owner` and `/admin`
- [~] Form validation + input sanitization audit
- [ ] Service role key server-only (verify no client leak)

### 14. Deployment readiness

- [x] Cloudflare Workers deploy + GitHub Actions CI
- [x] `DEPLOY.md`, seed data for homestays
- [ ] Seed: restaurants, places, hidden gems, routes
- [ ] Vercel instructions (optional — Cloudflare is primary)

---

## Suggested build order (agents follow this)

1. ~~Phase 2 item 1~~ — near-me geolocation ✓
2. ~~Phase 2 items 2–7~~ — types, detail pages, saved, routes ✓
3. ~~Phase 2 items 4–5, 8~~ — recommendations, trip planner, business form ✓
4. **Phase 2 items 9–10** — SEO on remaining hub pages, site-wide polish
5. **Phase 3 item 6** — wire things/hidden-gems to Supabase
6. **Phase 3 item 7** — Supabase RPC for PostGIS near-me
7. **Phase 3 items 4–5** — owner lead dashboard, admin featured/verified UI
8. **Phase 3 items 11–14** — CMS, seeds, sitemap, analytics

---

## Agent instructions (copy-paste)

```
Read ROADMAP.md and AGENTS.md.
Complete the next unchecked item in "Suggested build order" (or the specific
ROADMAP item I name).
Work autonomously. Do not ask unless blocked.
Update ROADMAP.md checkboxes when done.
Build, deploy, push to main, confirm GitHub Actions passed.
Give me a plain-English summary and what to test on hellokotagiri.com.
```
