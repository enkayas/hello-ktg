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

## 7. Gotchas

- `kotagiri_homestays.html` and `.csv` are **build artifacts** — hand-edits get
  overwritten the next time `compile_homestays.py` runs.
- Everything is a static prototype: no security, no server-side validation, data
  is per-browser. Don't assume durability or multi-device sync.
- `silvertip-stays/` describes a *different, larger* app (Supabase/Square/Jibble)
  and is documentation only — not wired to the travel site.
