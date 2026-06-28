# Travel Kotagiri — Project Reference

> **Purpose of this file:** Single source of truth for understanding and working
> in this repo. Auto-loaded by Claude Code as future reference, committed to the
> repo so it is shared with Cowork and any collaborator. Keep it current when the
> structure, data, or contact details change.

**Repo:** `enkayas/travelktg` · **Working branch:** `claude/confident-wozniak-wsoqut`
**Owner:** enkayas@gmail.com · **Last reviewed:** 2026-06-25

---

## 1. What this project is

Two related things live in one repo:

1. **Travel Kotagiri** — a static marketing site + lightweight booking flow for
   homestays/cottages/resorts in **Kotagiri, Nilgiris, Tamil Nadu** (1,793 m, the
   oldest hill station in the Nilgiris). No backend; everything is plain
   HTML/CSS/JS with data persisted in the browser via `localStorage`.

2. **Silvertip Ventures** — product/ops documentation and a large React dashboard
   component (`DataDashboard.tsx`) for a hospitality "super app" (restaurant +
   homestay/glamping + payroll + analytics, backed by Supabase + Square + Jibble).
   This is reference/spec material, **not** a buildable app in this repo.

There is **no build system, package.json, or test suite.** HTML files are opened
directly in a browser. The only script is a Python generator (see §4).

---

## 2. File map

### Travel Kotagiri site (repo root)
| File | Role |
|------|------|
| `travel-kotagiri-landing.html` | Main landing page. Sections: `#explore`, `#stays`, `#todo`, `#plan`, `#list`. Brand fonts: Fraunces (headings) + Inter. Green/tea color palette via CSS vars (`--forest`, `--leaf`, `--tea`…). |
| `kotagiri_homestays.html` | Interactive homestays directory (cards + live search). **Generated** by `compile_homestays.py` — edit the Python, not this file. |
| `kotagiri_homestays.csv` | Same 12 listings as a spreadsheet for outreach. **Generated** — do not hand-edit. |
| `book.html` | Booking form. Reads `?stay=` / host number from query, submits via WhatsApp deep-link or email, and saves the booking to `localStorage`. |
| `hosts.html` | Host dashboard. Host logs in with their WhatsApp number (intl format) to view bookings sent to them; can export CSV. Reads from `localStorage`. |

### Generator
| File | Role |
|------|------|
| `compile_homestays.py` | Source of truth for the 12 homestay listings. Defines `HOMESTAYS` list, writes `kotagiri_homestays.csv` and `kotagiri_homestays.html`. Run with `python3 compile_homestays.py`. |

### Silvertip Ventures (`silvertip-stays/`)
| File | Role |
|------|------|
| `03_APP_SOP_AND_PROCESS_GUIDE.md` | End-user SOP / process guide for the ops super-app. |
| `04_PROCESS_FLOWS_AND_ARCHITECTURE.md` | Technical reference — data flow, system architecture (TanStack Start + React + Supabase). |
| `08_LOVABLE_DEPLOYMENT_PACKAGE.md` | Product spec + deployment guide for rebuilding the app on Lovable. 10 core modules. |
| `10_IMMEDIATE_ACTION_EXECUTION_PLAN.md` | 90-day operational roadmap (May–Aug 2026). |
| `DataDashboard.tsx` | ~44 KB React dashboard component (reference implementation). |
| `customer_feedback_form_template.html` | Standalone feedback form template. |
| `travel-kotagiri-wireframe.html` | Early wireframe for the travel site. |

---

## 3. Booking / data flow (important conventions)

- **Persistence is client-side only.** Bookings live in `localStorage` under the
  key `travelkotagiri_bookings` (JSON array). There is no server, no database, no
  auth. Clearing browser storage loses all bookings.
- **Host contact / WhatsApp:** the default host number used across the site is
  **`919962541214`** (intl format, no `+`). It appears in ~19 places (booking
  deep-links, fallback host numbers). Per-stay host numbers are supported.
- **Booking submission:** `book.html` builds a `wa.me/<number>` WhatsApp link (or
  `mailto:` fallback) AND writes the booking to `localStorage` so it shows up in
  `hosts.html`.
- **Host login** in `hosts.html` is just a filter by WhatsApp number — not secure,
  no password. Treat all of this as a prototype, not production.

---

## 4. How to make common changes

- **Add / edit / remove a homestay:** edit the `HOMESTAYS` list in
  `compile_homestays.py`, then run `python3 compile_homestays.py` to regenerate
  `kotagiri_homestays.csv` and `kotagiri_homestays.html`. Commit all three.
  Fields per listing: `name, address, phone, rating, website, justdial_link,
  reviews, type`.
- **Change site copy / sections / styling:** edit `travel-kotagiri-landing.html`
  directly (inline `<style>`). Keep the existing CSS-variable palette and the
  Fraunces/Inter font pairing.
- **Change the host WhatsApp number:** it is hard-coded as `919962541214` in
  multiple HTML files — search-and-replace across `*.html` and verify the booking
  + host-dashboard flows still work.
- **Verify a change:** open the HTML file in a browser. For booking flow, complete
  a booking in `book.html`, then confirm it appears in `hosts.html` after logging
  in with the matching host number.

There is currently no linter, formatter, or test runner configured.

---

## 5. Data snapshot

12 properties listed (sourced from Justdial + web search), located in Kotagiri /
Aravenu / Kodanad / Ketti, pin codes 643201 / 643217, Tamil Nadu. Types: Home
Stay, Cottage, Resort, Villa, B&B. Ratings 3.7–4.9. Three of them
(Tea Estate Homestay, Misty Valley B&B, Pine Edge Cottage) use the house WhatsApp
number and have no Justdial link / reviews — they are first-party listings.

---

## 6. Git workflow

- Develop on **`claude/confident-wozniak-wsoqut`**; never push to `main` without
  explicit permission.
- Push with `git push -u origin claude/confident-wozniak-wsoqut`.
- After pushing, open a **draft PR** if one does not already exist.

---

## 7. Roadmap — Booking engine + owner admin panel (decisions locked 2026-06-25)

The site is moving from a static `localStorage` prototype to a real, backed
product. **Owner self-listing + per-owner admin panel + guest bookings require a
server-side backend** — `localStorage` cannot do multi-tenant, multi-device data.

**Locked decisions:**
- **Backend:** a **NEW Supabase project** dedicated to Travel Kotagiri (separate
  from the Silvertip Ventures Supabase project). Postgres + Auth + Storage +
  Row-Level Security + Edge Functions.
- **Frontend:** **React / Next.js app** (supersedes the earlier "enhance static
  pages" decision, revised 2026-06-25). Chosen for mobile-first UX, component
  reuse, routing, and **SSR/SSG so each property gets an SEO-indexable page**.
  Carry over the Fraunces/Inter brand and the green/tea CSS-variable palette into
  the design system. This introduces a build system — a deliberate departure from
  the repo's previous no-build, static-HTML ethos.
- **Payments:** **hybrid** — v1 ships **request-to-book confirmed over WhatsApp**
  (no online payment); **Razorpay (UPI/cards) added in phase 2**.
- **Booking model:** **request-to-book** — guest requests dates, owner approves or
  declines from their admin panel.
- **v1 milestone scope (all four):** public search + listings (with per-property
  detail pages), owner admin panel, availability calendar (blocked dates +
  double-booking prevention), and a super-admin panel (approve owners/listings,
  view all bookings, manage commission).
- **MOBILE-FIRST is a hard requirement.** Design and build every new
  surface (guest booking flow, owner admin panel) mobile-first: single-column
  layouts, large tap targets, bottom-anchored primary actions, test at ~360px
  width first and scale up. Most hosts and guests will be on phones.

**Planned Supabase schema (core tables):** `profiles` (owner accounts ↔ auth
users), `properties` (owner-scoped: name, type, location, description, amenities,
base price, status draft→pending-review→published), `property_photos` (Storage),
`availability`/`blocked_dates`, `bookings` (property, guest, dates, guests,
amount, status), later `reviews` + `inquiries`. **RLS:** owners read/write only
their own rows; public reads only `published` properties; guests insert bookings
that only the property's owner can read.

**App surfaces (Next.js routes):** public site (`/`, `/stays`, `/stays/[slug]`
SEO property pages, search/filter), owner admin (`/owner` — phone-OTP/email login,
CRUD properties, upload photos, set pricing/availability, approve/decline booking
requests), and super-admin (`/admin` — approve owners/listings before publish,
view all bookings, commission). Legacy static pages
(`travel-kotagiri-landing.html`, `book.html`, `hosts.html`,
`kotagiri_homestays.html`) become the design reference / fallback during the
migration, not the production surface.

**Future integration:** `hellokotagiri.com` (existing site — stack TBD) to be
wired in once the booking functionality is complete.

**"What else" backlog to make the site meaningful:** property photos/galleries
(biggest current gap — listings have no images), real availability calendar,
search/filter by dates/guests/price/type + map view, real reviews & ratings,
automated WhatsApp/email booking notifications (Edge Function), per-property SEO
pages, Razorpay payments/deposits, owner onboarding/verification + payout/
commission tracking (feeds Silvertip analytics), Tamil/English toggle, PWA polish,
legal pages (cancellation/T&C/privacy).

---

## 7b. Build progress (as of 2026-06-25)

**Supabase project `travelKTG`** (ref `lewhmonjzoznnqxtdkcn`, org "Silvertip
Ventures", region ap-southeast-1) — was paused; **restored & live**. It already
had a curated-directory schema; we **evolved** it (migration
`supabase/migrations/0001_owner_accounts_and_bookings.sql` + `0002` hardening):
- Added `profiles` (owner/admin accounts, auto-created on signup), `is_admin()`
  SECURITY DEFINER helper, `homestay_photos`, `blocked_dates`, `bookings`
  (request-to-book), and `owner_id`/`slug`/`base_price`/etc. columns on
  `homestays` & `restaurants`. RLS throughout (owner isolation, public read of
  published, guest enquiry/booking inserts). Storage bucket `property-photos`.
- **14 curated stays** seeded (`supabase/seed.sql`), all `owner_id` null
  (unowned), published. Includes first-party Silvertip Homestay + Sunset
  Camping & Glamping (host `919381107922`, silvertipcafe.com).
- Model split: **curated (unowned) listings use the WhatsApp/enquiry flow;
  owner-claimed listings get request-to-book `bookings`.**

**Next.js app lives in `web/`** (Next 16, React 19, Tailwind v4, App Router,
TS). Read `web/AGENTS.md` — Next 16 has breaking changes; `params`/`searchParams`
are Promises. Brand (Fraunces/Inter + green/tea palette) ported into
`globals.css`. Supabase clients: `src/lib/supabase/{public,client,server}.ts`
(public = cookieless, for build-time/SSG public reads; server = cookie-based for
auth). Built so far: `/` home, `/stays` (search/filter), `/stays/[slug]`
(SSG + SEO + request-to-book → WhatsApp + enquiry persistence). Build passes.

**Env:** `web/.env.local` holds `NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key `sb_publishable_...`).
`.env.example` committed; `.env.local` gitignored.

**⚠ Egress:** this remote sandbox's network policy blocks direct HTTPS to
`*.supabase.co`, so `npm run build`/runtime renders with EMPTY data here (the
Supabase MCP uses a separate channel and works). To run/build with live data,
add the Supabase host to the environment's egress allowlist, or deploy to a host
without that restriction (Vercel/Netlify).

**Run locally:** `cd web && npm install && npm run dev`.

**Auth:** email + password (Supabase native, no SMTP/SMS setup needed). Server
guards read the session via `getCurrentUser()`; the browser client refreshes
tokens client-side. Phone-OTP is future work (needs an SMS provider in Supabase
Auth).
- **No middleware/proxy:** Next 16's `proxy` is Node-runtime-only (can't be
  Edge), and the OpenNext Cloudflare adapter doesn't yet support Node
  middleware — so the Supabase session-refresh proxy was **removed** to keep the
  Cloudflare build working. Re-add it if/when OpenNext supports Node middleware
  (or if we move off Cloudflare).

**Deploy target: Cloudflare Workers via `@opennextjs/cloudflare` (OpenNext).**
Config: `web/wrangler.jsonc` (name `helloktg`, `nodejs_compat`, assets in
`.open-next/`), `web/open-next.config.ts`, and `initOpenNextCloudflareForDev()`
in `next.config.ts`. Scripts: `npm run preview` (local Workers runtime),
`npm run deploy` (build + `wrangler deploy`). `opennextjs-cloudflare build`
verified passing on Next 16. **Deploy needs:** (a) code on Cloudflare — either
connect the GitHub repo via **Workers Builds** (root dir `web/`, build
`npx opennextjs-cloudflare build`) or `npm run deploy` from a machine with
`wrangler login`; (b) set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
as **build variables** (they're inlined at build time). Cloudflare runtime can
reach Supabase (no egress block), so live data works once deployed.

**Routes built:**
- Public: `/`, `/stays`, `/stays/[slug]`, `/list-your-property` (→
  `listing_submissions`).
- Owner (`/owner/*`, guarded by `OwnerLayout`): `login`, dashboard, `bookings`
  (approve/decline → WhatsApp), `properties/new`, `properties/[id]` (edit +
  `PhotoManager` Storage upload + `AvailabilityManager` blocked dates).
- Admin (`/admin/*`, guarded by role='admin'): listings approve/publish,
  `leads` (submissions + enquiries).

**Make the first admin** (after that user signs up at `/owner/login`):
`update profiles set role='admin' where id = (select id from auth.users where
email='enkayas@gmail.com');` (run via Supabase MCP `execute_sql`).

**Still TODO:** phase-2 Razorpay payments; owner "claim an existing curated
listing" flow; richer property detail (photo gallery wired into public page);
email/WhatsApp automation via Edge Functions; deploy (Vercel/Netlify) +
allowlist or remove the Supabase egress restriction.

---

## 8. Gotchas

- `kotagiri_homestays.html` and `.csv` are **build artifacts** — hand-edits get
  overwritten the next time `compile_homestays.py` runs.
- Everything is a static prototype: no security, no server-side validation, data
  is per-browser. Don't assume durability or multi-device sync.
- `silvertip-stays/` describes a *different, larger* app (Supabase/Square/Jibble)
  and is documentation only — not wired to the travel site.
