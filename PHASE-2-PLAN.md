# Travel Kotagiri — Phase 2 Plan (Backend, Bookings & Payments)

This document explains what's live now and exactly what's needed to turn the prototype into a real, revenue-generating booking platform.

## What's built now (Phase 1 — live)

A complete, self-contained website (`index.html`) that runs by double-clicking — no server needed. It includes:

- **Homepage** with hero search, category navigation, featured stays/restaurants, testimonials, and an owner call-to-action.
- **Attractions** listing + detail pages — real Kotagiri content (Kodanad, Catherine Falls, Elk Falls, Longwood Shola, Rangasamy Peak, John Sullivan Memorial) with distance, timing, best season, and descriptions.
- **Things to Do** — treks, tea tours, birding, waterfall days.
- **Stays** — homestays, B&Bs, cottages and heritage bungalows with filters, sorting, detail pages, and a "Request to Book" enquiry flow.
- **Eat & Drink** — restaurant directory with filters and table-reservation enquiries.
- **Plan Your Trip** — how to reach, best time, a sample 2-day itinerary, and a free trip-plan request form.
- **List Your Property** — full revenue page with all four models (paid tiers, featured placement, commission, lead-gen), a 3-tier pricing table, and a working listing-submission form.

All forms and bookings currently show confirmation UI but don't yet persist data or take payment — that's Phase 2.

## What Phase 2 adds

| Capability | What it enables |
|---|---|
| **Database (Supabase)** | Listings, bookings, enquiries and leads actually save. Owners submit → you approve → it appears live. |
| **Owner accounts & login** | Hosts manage their own listing, photos, prices and availability. |
| **Admin dashboard** | You approve listings, see enquiries, manage featured placement. |
| **Payments (Razorpay/Stripe)** | Collect subscription fees (Featured/Premium), booking deposits, and commission. |
| **Booking engine** | Real availability calendars and confirmed bookings, not just enquiries. |
| **Email/WhatsApp notifications** | Hosts get instant enquiry alerts; travellers get confirmations. |

## Recommended stack

- **Frontend:** keep this as the base, or migrate to Next.js for SEO (important for "things to do in Kotagiri" Google traffic).
- **Database + Auth + Storage:** Supabase (Postgres). Handles listings, bookings, owner logins, and photo uploads in one place. *(A Supabase connector is available — I can wire this up when you're ready.)*
- **Payments (India):** Razorpay for subscriptions + booking payments (best for INR, UPI, cards). Stripe if you expect international cards.
- **Hosting:** Netlify or Vercel (both connectors available) — free tier is enough to launch.
- **Domain:** register `travelkotagiri.in` or similar.

## Suggested build order

1. **Get it online first** — deploy this prototype to Netlify/Vercel on a real domain. Start collecting listing requests and trip-plan leads immediately via a form-to-email service (Formspree) — revenue conversations can begin before the full backend exists.
2. **Add Supabase** — move listings + enquiries into a database with an admin approval flow.
3. **Owner accounts** — let hosts self-manage.
4. **Payments** — turn on Featured/Premium subscriptions (fastest revenue) before full booking payments.
5. **Booking engine + notifications** — availability calendars and confirmed bookings.

## Revenue model (as built into the site)

- **Free tier** — listed + enquiries, optional 12% booking commission.
- **Featured — ₹999/mo** — higher ranking, badge, more photos; or 8% commission.
- **Premium — ₹2,499/mo** — homepage + category-top placement, promoted in trip plans/emails; or pay-per-lead from ₹49/lead.

Fastest path to first revenue: **Featured/Premium subscriptions** (recurring, no booking infrastructure required) and **pay-per-lead** (charge for enquiries you forward).

## To go to Phase 2

Just say the word and I can: set up the Supabase database and schema, deploy the site live to a real URL, and wire up the listing-approval + payments flow.
