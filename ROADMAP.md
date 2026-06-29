# HelloKotagiri — Product Roadmap & Task List

> **Purpose:** Master checklist for Phase 2 and Phase 3. AI agents and the owner
> use this file to know what to build next. Read at the start of every session.
>
> **How to assign work (owner):** In a Cursor Cloud agent, say:
> *"Read ROADMAP.md. Complete the next unchecked Phase 2 item. Work autonomously,
> deploy when done, update checkboxes in ROADMAP.md."*
>
> **Status key:** `[x]` done · `[~]` partial · `[ ]` not started

**Last updated:** 2026-06-29 (Phase 2 item 1 complete)

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

- [~] Basic mock types in `web/src/data/mock/types.ts`
- [ ] Full interfaces: `BusinessListing`, `StayListing`, `RestaurantListing`, `PlaceListing`, `HiddenGem`, `Itinerary`, `TravellerProfile`, `BusinessPlan`, `BadgeType`
- [ ] Each listing: id, name, slug, category, subcategory, descriptions, locationName, lat/lng, images, tags, badges, bestFor, openingHours, phone, whatsapp, website, priceRange, isVerified, isFeatured

### 3. Detail pages

- [x] `/stays/[slug]` — stay detail (Supabase-backed)
- [~] `/things-to-do/[id]` — activity detail (mock)
- [~] `/explore/[id]` — attraction detail (mock)
- [ ] `/eat/[slug]` — restaurant detail
- [ ] `/hidden-gems/[slug]` — hidden gem detail
- [ ] Unified detail template: hero, badges, highlights, amenities, nearby, map placeholder, WhatsApp/Call/Directions/Save CTAs, notes (parking, walking, senior/kid friendly, weather)

### 4. Smart recommendation engine (mock rules)

- [ ] `web/src/lib/recommendations.ts` — rule-based utility
- [ ] Inputs: traveller type, interest, base, weather mock, time-of-day mock
- [ ] Outputs: suggested places, food, stays, caution notes
- [ ] Rules: seniors → low walking + parking; food interest → restaurants; rainy → cafés not waterfalls; evening → sunset + dinner; family → restrooms, parking, kid-friendly

### 5. Upgrade `/plan-my-trip`

- [~] Basic rule-based day plan exists
- [ ] Richer itinerary: suggested base, day-wise plan, food + stay suggestions, hidden gems, caution notes
- [ ] WhatsApp share placeholder
- [ ] Printable / polished layout

### 6. Saved items (localStorage)

- [ ] Save button on cards + detail pages
- [ ] `/saved` page — stays, restaurants, places, hidden gems
- [ ] Remove saved items

### 7. Route pages

- [ ] `/routes` — route cards (Coimbatore→Kotagiri, Coimbatore→Ooty, Bangalore→Ooty via Mysore, Mysore→Masinagudi, Kotagiri→Coonoor, Kotagiri→Kodanad, Ooty→Avalanche)
- [ ] Each card: distance, time, best stops, food, restroom, cautions, View Route
- [ ] `/routes/[slug]` — overview, stops, food, viewpoints, road caution, best time, nearby stays

### 8. Business listing form (`/list-your-business`)

- [~] Basic form exists
- [ ] Fields: category, type, address, Google Maps link, photo upload placeholder, amenities checkboxes, price range, preferred plan
- [ ] Validate required fields; success message; store in localStorage (or console) — no backend yet

### 9. SEO and metadata

- [~] Some pages have metadata
- [ ] Title + description + OpenGraph on every public page
- [ ] Destination-specific titles

### 10. UI polish

- [~] White cards, shadows, light heroes (recent pass)
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error states
- [ ] Location-denied states
- [ ] Mobile spacing + a11y labels + responsive grids

---

## Phase 3 — Real backend, AI, monetisation

**Goal:** Scalable platform — businesses submit listings, admin approves, PostGIS nearby search, AI trip planner, partner plans.

**Note:** Much of Phase 3 **overlaps work already done** under different paths (`/owner` not `/partner/dashboard`, `homestays` not `stays` table). Extend existing schema; do not duplicate.

### 1. Supabase database schema

- [x] Core tables: `profiles`, `homestays`, `restaurants`, `bookings`, `enquiries`, `listing_submissions`
- [x] Migrations 0001–0007 (owner accounts, claims, OTP, property units)
- [ ] PostGIS `geo_location` columns + spatial indexes
- [ ] Unified listing fields per spec (badges, best_for, amenities JSON, status workflow)
- [ ] Tables: `routes`, `itineraries`, `saved_items` (server-side), `partner_subscriptions`, `reviews` (optional)
- [ ] Document schema in `BACKEND-README.md`

### 2. Supabase client setup

- [x] `web/src/lib/supabase/` — public, client, server, admin
- [x] `web/.env.example`
- [ ] Add `OPENAI_API_KEY`, `NEXT_PUBLIC_SITE_URL` to `.env.example`

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
- [ ] Stats: total listings, pending, approved, featured, leads this month
- [ ] Mark verified / featured / plan type from admin UI

### 6. Backend connection for listings

- [x] `/stays` + `/stays/[slug]` from Supabase
- [ ] `/eat` loads approved restaurants from Supabase
- [ ] `/things-to-do` loads approved places
- [ ] `/hidden-gems` loads approved hidden gems
- [ ] Graceful mock fallback when Supabase empty or unreachable

### 7. Location-aware search (PostGIS)

- [ ] Radius filters: 1 / 5 / 15 / 30 km on `/near-me`
- [ ] Query approved listings by distance when geolocation allowed
- [ ] Mock fallback from Phase 2 when Supabase not configured
- [ ] Show distance in km

### 8. AI trip planner

- [ ] API route `/api/plan-trip`
- [ ] Pull approved places/restaurants/stays from Supabase (or mock)
- [ ] OpenAI generates structured day-wise itinerary JSON
- [ ] Render: morning/afternoon/evening, food, stays, cautions, responsible travel notes
- [ ] No invented unsafe trails; caution for forests, waterfalls, night driving, private estates

### 9. Lead generation

- [~] `enquiries` table exists
- [ ] Log leads on WhatsApp / Call / Directions / Enquiry clicks
- [ ] Fields: listing_id, listing_type, action_type, user_location optional, created_at
- [ ] API route for lead events

### 10. Partner pricing and monetisation

- [~] Plan copy on `/list-your-business` (Free / Featured / Premium)
- [ ] Razorpay placeholder — “Proceed to Payment” button, no full integration yet
- [ ] `partner_subscriptions` table structure

### 11. CMS / content management

- [ ] Admin forms for places, hidden gems, routes (or clean data structure + placeholders)
- [ ] Articles/guides (optional)

### 12. Production polish

- [ ] Loading skeletons, error boundaries, empty states site-wide
- [ ] 404 page polish
- [ ] Privacy policy, Terms, Responsible travel, Contact pages
- [ ] Sitemap-friendly routes
- [ ] Analytics placeholder
- [ ] Image optimisation + OpenGraph site-wide

### 13. Security and validation

- [x] RLS — owners see only their rows; public sees published only
- [x] Server guards on `/owner` and `/admin`
- [ ] Form validation + input sanitization audit
- [ ] Service role key server-only (verify no client leak)

### 14. Deployment readiness

- [x] Cloudflare Workers deploy + GitHub Actions CI
- [x] `DEPLOY.md`, seed data for homestays
- [ ] Seed: restaurants, places, hidden gems, routes
- [ ] Vercel instructions (optional — Cloudflare is primary)

---

## Suggested build order (agents follow this)

1. **Phase 2 item 1** — full near-me geolocation + Haversine (unblocks discovery UX)
2. **Phase 2 item 2** — unified listing types + mock data with coordinates
3. **Phase 2 items 3, 6, 7** — detail pages, saved, routes (traveller-facing value)
4. **Phase 2 items 4, 5** — recommendations + trip planner upgrade
5. **Phase 2 items 8–10** — business form, SEO, polish
6. **Phase 3 item 6** — wire eat/things/hidden-gems to Supabase
7. **Phase 3 item 7** — PostGIS near-me
8. **Phase 3 item 8** — AI trip planner
9. **Phase 3 items 9–14** — leads, payments placeholder, CMS, polish, seeds

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
