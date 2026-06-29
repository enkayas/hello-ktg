# helloKotagiri — Project Master Reference

> **Purpose:** Single source of truth for product vision, business model, architecture,
> and build status. Read this file at the start of every session. Keep it current
> when decisions, scope, or deployment details change.

**Brand:** helloKotagiri · **Domain:** [hellokotagiri.com](https://hellokotagiri.com)  
**Repo:** `enkayas/hello-ktg` · **Owner:** enkayas@gmail.com  
**Last updated:** 2026-06-28

---

## 1. Product vision

**helloKotagiri is a one-stop shop for Kotagiri** — the oldest hill station in the
Nilgiris, Tamil Nadu (1,793 m). It serves two audiences:

### Tourists (primary)
Everything a visitor needs to plan and enjoy a trip:
- **Stay** — homestays, cottages, B&Bs, resorts, glamping
- **Sightseeing** — viewpoints, waterfalls, treks, heritage sites, birding
- **Food** — restaurants, cafés, local dining

### Local residents & business owners (secondary)
Property owners and restaurateurs in Kotagiri and nearby villages can:
- **List** their homestay, cottage, or restaurant on the platform
- **Manage** their listing (photos, pricing, availability, description)
- **Take reservations** through a booking engine (request-to-book → owner confirms)

The platform earns revenue by charging a **commission percentage on confirmed
reservations** (plus optional paid listing tiers for featured placement).

---

## 2. Hard requirements

These are non-negotiable for every new feature and page:

| Requirement | Detail |
|---|---|
| **Mobile-first** | Design at ~360px width first. Single-column layouts, large tap targets, bottom-anchored primary actions. Most hosts and guests are on phones. |
| **SEO** | Each stay, restaurant, and attraction gets its own indexable URL (SSR/SSG). Target queries like "things to do in Kotagiri", "homestays in Kotagiri". |
| **Real backend** | No `localStorage` for production data. Supabase Postgres + Auth + Storage + RLS. |
| **Request-to-book** | Guest requests dates → owner approves/declines → confirmation via WhatsApp (v1). Online payment in phase 2. |
| **Owner self-service** | Owners manage their own listings without admin intervention (after initial approval). |
| **Admin oversight** | Super-admin approves new listings/owners, views all bookings, tracks commission. |

---

## 3. Business model

### Commission on reservations (primary revenue)
- Charge a **percentage of each confirmed booking** (default: **12%** on free tier).
- Commission tracked per booking; payout/settlement via Razorpay in phase 2.
- Lower commission rates for paid listing tiers (see below).

### Listing tiers (secondary revenue)

| Tier | Price | Benefits | Commission |
|---|---|---|---|
| **Free** | ₹0 | Listed + enquiry/booking flow | 12% |
| **Featured** | ₹999/mo | Higher ranking, badge, more photos | 8% |
| **Premium** | ₹2,499/mo | Homepage + category-top placement, promoted in trip plans | 8% or pay-per-lead from ₹49 |

Fastest path to first revenue: **Featured/Premium subscriptions** (recurring, no
full booking infrastructure required) and **pay-per-lead** (charge for enquiries
forwarded to owners).

### Booking model
1. Guest selects dates + guests on property page
2. Submits request (name, phone, message)
3. Owner sees request in `/owner/bookings`, approves or declines
4. Both parties get WhatsApp confirmation (manual v1 → automated Edge Function later)
5. Commission calculated on approved booking amount

---

## 4. Content pillars

### Stay
- Directory with search/filter (type, price, guests, location)
- Per-property detail pages with photo gallery, amenities, pricing, availability
- "Request to Book" form → `bookings` table (owned listings) or `enquiries` (curated/unowned)
- Owner admin: CRUD property, upload photos, set blocked dates, manage bookings

### Sightseeing
- Curated attractions: Kodanad Viewpoint, Catherine Falls, Longwood Shola, John Sullivan Memorial, Rangaswamy Peak, Elk Falls, etc.
- Detail pages: distance, timing, best season, entry fee, highlights, photos
- "Things to Do": treks, tea tours, birding, waterfall days
- Content lives in `curated_data.json` (static prototype) → migrate to Supabase `attractions` table (future)

### Food
- Restaurant directory with filters (cuisine, price range, location)
- Detail pages with hours, specialties, contact
- Table reservation enquiries → `enquiries` table
- Owner admin: CRUD restaurant listing (future — schema supports `restaurants` table)

### Plan Your Trip (supporting content)
- How to reach Kotagiri (Coimbatore airport, Ooty road, bus)
- Best time to visit (Oct–Feb peak, monsoon green)
- Sample 2-day itinerary
- Free trip-plan request form

---

## 5. Audiences & user journeys

### Tourist
```
Land on homepage → Browse stays / explore / eat → Filter & compare
→ Open detail page → Request to book (or WhatsApp enquiry for curated listings)
→ Receive confirmation via WhatsApp
```

### Homestay / restaurant owner
```
See "List Your Property" CTA → Submit application (listing_submissions)
→ Admin approves → Owner creates account (/owner/login)
→ Add/edit property, upload photos, set pricing & availability
→ Receive booking requests → Approve/decline → Guest notified
```

### Platform admin (enkayas@gmail.com)
```
Login as admin → Review listing submissions & enquiries (/admin/leads)
→ Approve/publish listings → Monitor all bookings & commission
→ Manage featured placement tiers
```

---

## 6. Technical architecture

### Production stack (locked decisions)

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | Next.js 16 + React 19 + Tailwind v4 | Mobile-first, SSR/SSG for SEO, component reuse, App Router |
| **Backend** | Supabase (Postgres + Auth + Storage + RLS) | Listings, bookings, owner auth, photo uploads in one place |
| **Deploy** | Cloudflare Workers via OpenNext | `web/wrangler.jsonc`, `npm run deploy` |
| **Payments (phase 2)** | Razorpay (INR, UPI, cards) | India-first; Stripe if international needed |
| **Notifications (phase 2)** | Supabase Edge Functions → WhatsApp/email | Instant enquiry alerts for owners |

### Supabase project

- **Name:** helloKTG · **Ref:** `lewhmonjzoznnqxtdkcn`
- **URL:** https://lewhmonjzoznnqxtdkcn.supabase.co
- **Region:** ap-southeast-1 (Singapore)
- **Org:** Silvertip Ventures (separate from Silvertip ops Supabase)
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `web/.env.local`

### Database tables

| Table | Purpose |
|---|---|
| `profiles` | Owner/admin accounts (1:1 with auth.users) |
| `homestays` | Stay listings (curated + owner-claimed) |
| `restaurants` | Dining listings |
| `homestay_photos` | Photo galleries (Storage-backed) |
| `blocked_dates` | Owner availability / double-booking prevention |
| `bookings` | Request-to-book workflow (owned stays) |
| `listing_submissions` | "List Your Property" intake |
| `enquiries` | Booking & table-reservation leads (curated listings) |

**Model split:** curated (unowned) listings → WhatsApp/enquiry flow;
owner-claimed listings → full request-to-book via `bookings` table.

**RLS:** owners read/write only their own rows; public reads only published;
guests insert bookings/enquiries that only the owner/admin can read.

Migrations: `supabase/migrations/0001_owner_accounts_and_bookings.sql`  
Seed data: `supabase/seed.sql` (14 curated stays)

### Next.js app (`web/`)

```
web/
├── src/app/
│   ├── page.tsx                    # Homepage (hero carousel + featured stays)
│   ├── stays/page.tsx              # Search & filter
│   ├── stays/[slug]/page.tsx       # Property detail + booking form (SSG)
│   ├── list-your-property/page.tsx # Owner onboarding form
│   ├── owner/
│   │   ├── login/page.tsx          # Email + password auth
│   │   └── (panel)/
│   │       ├── page.tsx            # Owner dashboard
│   │       ├── bookings/page.tsx   # Approve/decline requests
│   │       └── properties/         # CRUD + photos + availability
│   └── admin/
│       ├── page.tsx                # Listing approval
│       └── leads/page.tsx          # Submissions + enquiries
├── src/components/                 # StayCard, BookingForm, PhotoManager, etc.
├── src/lib/supabase/               # public, client, server clients
└── wrangler.jsonc                  # Cloudflare Workers config
```

**Run locally:** `cd web && npm install && npm run dev`  
**Deploy:** `cd web && npm run deploy` (needs `wrangler login` + env vars as build variables)

**Auth:** email + password (Supabase native). Phone-OTP is future work.  
**Make first admin:** after signup at `/owner/login`, run:
```sql
update profiles set role='admin'
where id = (select id from auth.users where email='enkayas@gmail.com');
```

**Next.js 16 note:** `params` and `searchParams` are Promises — read `web/AGENTS.md`.

### Static prototype (repo root — design reference, not production)

These files informed the design and content but are being superseded by the Next.js app:

| File | Role |
|---|---|
| `index.html` | Full helloKotagiri city guide (~920 lines). Blue/gold palette. |
| `ktg-data.js` | Browser Supabase REST client for static pages |
| `curated_data.json` | Attractions, activities, stays, restaurants content |
| `book.html` | Booking form (WhatsApp + localStorage prototype) |
| `hosts.html` | Host dashboard (localStorage prototype) |
| `explore-details.html`, `restaurants.html`, etc. | Detail page prototypes |
| `compile_homestays.py` | Generates 12 homestay listings → HTML/CSV |

### Silvertip Ventures (`silvertip-stays/`)
Separate hospitality super-app spec (restaurant + stays + payroll + analytics).
Reference documentation only — **not part of helloKotagiri production build.**

---

## 7. Design system

### Brand
- **Name:** helloKotagiri (script "hello" in Caveat font)
- **Tagline:** "The Quiet Side of the Nilgiris"
- **Domain:** hellokotagiri.com

### Typography
- **Headings:** Inter Tight (static site) / Fraunces (Next.js app — to unify)
- **Body:** Inter
- **Accent script:** Caveat ("hello" in logo)

### Color palette (static site — blue/gold)
```css
--forest: #1f3a5c;   /* deepest navy-blue */
--pine:   #2e5a86;   /* primary blue */
--leaf:   #3f6f9e;   /* mid blue (accent/links/buttons) */
--tea:    #9db4ce;   /* light haze blue */
--mist:   #eef4f9;   /* pale sky wash */
--cream:  #fbfcfe;   /* near-white background */
--sun:    #c79348;   /* warm sand-gold accent */
--ink:    #1e2a38;
--muted:  #5e6b7c;
```

Next.js app (`web/src/app/globals.css`) currently uses the original green/tea
palette from the earlier Travel Kotagiri design. **Unify to blue/gold when
migrating static content into Next.js.**

---

## 8. Build status (as of 2026-06-27)

### Done
- [x] Supabase backend live with RLS, 14 seeded stays, owner/booking schema
- [x] Next.js app: public pages, owner panel, admin console
- [x] Request-to-book flow with WhatsApp deep-link
- [x] Photo upload (Storage) + availability calendar (blocked dates)
- [x] Cloudflare Workers deploy config (OpenNext)
- [x] Static helloKotagiri site with full content (stays, food, sightseeing, trip planner)
- [x] `ktg-data.js` — static pages persist enquiries/submissions to Supabase
- [x] Listing tier pricing model designed into site copy

### In progress / not yet done

> **Full checklist:** see [`ROADMAP.md`](ROADMAP.md) — Phase 2 (smart discovery) and
> Phase 3 (backend, AI, monetisation) with per-item status. Agents pick the next
> unchecked item from the suggested build order.

Summary of what remains:

- [ ] **Phase 2** — geolocation + Haversine, unified mock models, detail pages,
  recommendations, saved items, routes, business form, SEO, UI states
- [ ] **Phase 3 additions** — PostGIS near-me, AI trip planner, lead logging,
  Razorpay placeholder, full Supabase wiring for eat/places/gems, production pages

Legacy items (superseded by ROADMAP.md where noted):

- [x] Deploy to hellokotagiri.com
- [~] Migrate static content into Next.js
- [x] Unify design system (white/cards polish — ongoing)
- [x] Owner claim curated listing flow (OTP + admin review)
- [ ] Restaurant owner admin
- [ ] Razorpay integration
- [ ] WhatsApp/email automation
- [ ] Reviews & ratings
- [~] Tamil/English toggle
- [ ] Legal pages
- [ ] PWA polish
- [ ] Map view
- [ ] Commission tracking dashboard

---

## 9. Deployment plan (hellokotagiri.com)

> **Full setup guide:** read `DEPLOY.md` — Cloudflare deploy, GitHub Actions CI/CD,
> hellokotagiri.com DNS, and Cursor Cloud Agents.

### Goal
Replace or augment the current hellokotagiri.com site with this codebase. Run in
the cloud so the site is always live and Cursor Cloud Agents can work from GitHub
while the laptop is closed.

### Recommended steps
1. **Push code to GitHub** — feature branch `claude/confident-wozniak-wsoqut` → merge to `main`
2. **Add GitHub secrets** — Cloudflare API token, account ID, Supabase env vars
3. **Auto-deploy** — `.github/workflows/deploy-cloudflare.yml` deploys on every push to `main`
4. **Point hellokotagiri.com DNS** to Cloudflare Workers route
5. **Verify live flows:** browse stays, submit booking, owner login, admin approval
6. **Migrate remaining static content** (attractions, restaurants, trip planner) into Next.js routes
7. **Retire static HTML pages** once Next.js equivalents are live

### Default host contact
- **WhatsApp:** `919962541214` (intl format, no `+`) — used as fallback across the site
- **Silvertip properties:** `919381107922` (Silvertip Homestay, Sunset Camping)

---

## 10. Roadmap phases

### Phase 1 — Launch (current)
Public site + owner admin + admin console + request-to-book. Deploy to
hellokotagiri.com. Commission tracked manually.

### Phase 2 — Smart discovery (mock data)
See [`ROADMAP.md`](ROADMAP.md) § Phase 2. Geolocation, recommendations, saved items,
routes, detail pages, trip planner upgrade. **No new backend.**

### Phase 3 — Backend, AI, monetisation
See [`ROADMAP.md`](ROADMAP.md) § Phase 3. PostGIS, AI trip planner, lead logging,
partner plans. **Extends existing Supabase + `/owner` + `/admin`.**

### Phase 4 — Platform (future)
Multi-destination expansion (other Nilgiri towns). API for third-party integrations.
Silvertip Ventures ops dashboard integration.

---

## 11. Key conventions for AI assistants

### Owner relationship (locked 2026-06-28)

**The owner is not a technical person.** You are the Senior Programmer and
Technical Specialist. Implement all technical work yourself — code, deploy, git,
Cloudflare, Supabase, CI/CD. Do not ask the owner to run commands, edit config,
or navigate developer dashboards unless a step is physically impossible without
their browser login (e.g. domain registrar nameservers, payment, 2FA). When that
happens, give **one step only**, wait for confirmation, then give the next step.
Never send a multi-step checklist in a single message.

Explain outcomes in plain English. Verify before reporting done.

### Deploy rule (mandatory)

After any `web/` change, **deploy before saying done** — run `cd web && npm run deploy`
(or push to `main` and confirm GitHub Actions succeeded). **Never ask the owner
whether to deploy.** See `AGENTS.md` and `DEPLOY.md`.

### Cloud development (mandatory direction)

Work should be doable with the laptop closed: commit + push to `main`, CI deploys,
Cursor **Cloud Agents** on GitHub. See `DEPLOY.md` Part 4.

### Technical conventions

- **Production surface is `web/` (Next.js).** Static HTML is design reference only.
- **Mobile-first always.** Test at 360px before desktop.
- **Prioritize business profitability** — commission tracking, owner workflows, conversion.
- **Do not commit `.env.local` or secrets.**
- **Production branch:** `main` (auto-deploys to Cloudflare Worker `helloktg`).
- **Supabase free tier pauses after ~7 days inactivity** — restore via Supabase dashboard or MCP.
- **Next.js 16 breaking changes** — read `web/AGENTS.md` before writing Next.js code.
- **Cloudflare Worker name:** `helloktg` · **Live URL:** helloktg.silvertip.workers.dev
- **Custom domain pending:** hellokotagiri.com — blocked until domain zone is on Cloudflare account.
- **When adding homestays to production:** use owner admin panel or Supabase seed/migration.

---

## 12. Related docs

| File | Contents |
|---|---|
| `PROJECT.md` | **This file** — product vision, architecture, status |
| `CLAUDE.md` | Detailed technical reference (file map, gotchas, build progress) |
| `BACKEND-README.md` | Supabase setup guide for non-technical owner |
| `ROADMAP.md` | **Phase 2 & 3 task checklist** — what to build next |
| `PHASE-2-PLAN.md` | Legacy notes (see ROADMAP.md instead) |
| `web/AGENTS.md` | Next.js 16 agent rules |
| `AGENTS.md` | General AI assistant context |
| `research/kotagiri-deep-dive.md` | Local research and content sources |
| `research/site-content-additions.md` | Content backlog for site pages |
