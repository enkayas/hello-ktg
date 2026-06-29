# helloKTG — Backend (Supabase)

Your site now has a real database backend. Listing applications and booking/table enquiries are saved to Supabase instead of just firing a WhatsApp message.

## Project
- **Name:** helloKTG  ·  **Project ref:** `lewhmonjzoznnqxtdkcn`
- **URL:** https://lewhmonjzoznnqxtdkcn.supabase.co
- **Region:** ap-southeast-1 (Singapore — closest to Kotagiri)
- **Public key** (safe in browser): `sb_publishable_lQ_IUiEB92JIyN9CfPWVsg_6VajXsbK`
- Config lives in **`ktg-data.js`** (loaded by `index.html` and `book.html`).

## Tables
| Table | Purpose | Who can read | Who can write |
|---|---|---|---|
| `homestays` | Published stays shown on the site (8 seeded) | Public (published only) | You (admin) |
| `restaurants` | Published dining shown on the site (7 seeded) | Public (published only) | You (admin) |
| `listing_submissions` | "List Your Property" applications | **Admin only** | Anyone (insert) |
| `enquiries` | Booking & table-reservation requests | **Admin only** | Anyone (insert) |

Security (Row Level Security) is enforced at the database: visitors can read only *published* listings and can *submit* applications/enquiries, but **cannot read other people's submissions** — only you can, in the Supabase dashboard.

## What's wired now
- **List Your Property** form (homepage) → saves to `listing_submissions`, shows a success message.
- **Book / Reserve a table** (`book.html`) → saves to `enquiries` *and* still opens WhatsApp + localStorage.

## How you manage it
Log in to supabase.com → project **helloKTG** → **Table Editor**:
- See new applications in `listing_submissions` (status: new → contacted → approved).
- See booking/table requests in `enquiries`.
- To publish a new homestay/restaurant, add a row to `homestays`/`restaurants` with `is_published = true`.

## Important to know
- **Free-tier projects pause after ~7 days of no activity** — just click "Restore" in the dashboard (or upgrade to Pro, $25/mo, to remove this).
- The browser↔database round-trip couldn't be tested from this environment (no network in the sandbox; the browser extension can't open local files). It will work once the site is on a real URL — the code uses standard Supabase REST calls. **Test it live after deploying.**

## Not yet built (next steps)
- **Dynamic directory loading** — homepage still shows the curated static cards; could load the full stays/restaurants directory live from the DB so approved listings appear automatically.
- **Owner login & self-service dashboard** — owners editing their own listing.
- **Payments** — charging for Featured/Premium tiers, commission, leads.
- **Admin dashboard** — a nicer UI than the Supabase table editor.
