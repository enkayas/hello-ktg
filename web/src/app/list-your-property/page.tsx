"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function ListYourPropertyPage() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const { error } = await createClient()
      .from("listing_submissions")
      .insert({
        property_name: String(f.get("property_name")),
        owner_name: String(f.get("owner_name")),
        phone: String(f.get("phone")),
        email: String(f.get("email") || "") || null,
        location: String(f.get("location") || "") || null,
        property_type: String(f.get("property_type") || "") || null,
        description: String(f.get("description") || "") || null,
        status: "new",
      });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    setDone(true);
    setBusy(false);
  }

  const inputCls =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-base outline-none focus:border-leaf";

  return (
    <>
      <SiteNav variant="solid" />
      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-24 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
          For hosts
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-forest">
          List your property
        </h1>
        <p className="mt-2 text-muted">
          Reach travellers looking for the quiet side of the Nilgiris. Tell us
          about your place and we&apos;ll get you set up.
        </p>

        {done ? (
          <div className="mt-8 rounded-2xl bg-mist p-6 text-center">
            <p className="font-serif text-xl text-forest">Thanks! 🍃</p>
            <p className="mt-1 text-sm text-muted">
              We&apos;ve received your details and will reach out shortly. Want to
              manage your listing yourself?
            </p>
            <Link
              href="/owner/login"
              className="tap mt-4 inline-flex rounded-full bg-leaf px-5 py-2.5 font-semibold text-white hover:bg-pine"
            >
              Create a host account
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              name="property_name"
              required
              placeholder="Property name"
              className={inputCls}
            />
            <input
              name="owner_name"
              required
              placeholder="Your name"
              className={inputCls}
            />
            <input
              name="phone"
              required
              inputMode="tel"
              placeholder="WhatsApp number"
              className={inputCls}
            />
            <input
              name="email"
              type="email"
              placeholder="Email (optional)"
              className={inputCls}
            />
            <input
              name="location"
              placeholder="Location / area"
              className={inputCls}
            />
            <input
              name="property_type"
              placeholder="Type (homestay, cottage, resort…)"
              className={inputCls}
            />
            <textarea
              name="description"
              rows={4}
              placeholder="Tell us about your property"
              className={inputCls}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="tap w-full rounded-full bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine disabled:opacity-60"
            >
              {busy ? "Submitting…" : "Submit listing"}
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
