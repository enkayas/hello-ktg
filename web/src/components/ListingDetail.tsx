"use client";

import Link from "next/link";
import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { gradients } from "@/lib/images";
import type { AnyListing } from "@/lib/listings/types";
import { getNearbyFromCatalog } from "@/lib/listings/catalog";
import { logLead } from "@/lib/leads-client";
import SaveButton from "@/components/SaveButton";

type Props = {
  listing: AnyListing;
  backHref: string;
  backLabel: string;
};

export default function ListingDetail({ listing, backHref, backLabel }: Props) {
  const nearby = getNearbyFromCatalog(listing.latitude, listing.longitude, 3).filter(
    (n) => n.slug !== listing.slug,
  );
  const mapsQ = `${listing.latitude},${listing.longitude}`;
  const wa = listing.whatsapp
    ? `https://wa.me/${listing.whatsapp}?text=${encodeURIComponent(`Hi! I found ${listing.name} on HelloKotagiri and would like to enquire.`)}`
    : null;

  return (
    <div className="pb-16">
      <Link href={backHref} className="text-sm font-semibold text-steel hover:text-primary">
        ← {backLabel}
      </Link>

      <div
        className="relative mt-4 overflow-hidden rounded-2xl shadow-[0_12px_48px_-16px_rgba(29,58,88,0.18)]"
        style={{
          background: listing.gradient
            ? gradients[listing.gradient as keyof typeof gradients]
            : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.images[0]}
          alt={listing.name}
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,40,60,0.55)] to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
            {listing.category}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white">{listing.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
            <MapPin className="h-3.5 w-3.5" />
            {listing.locationName}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {listing.badges.map((b) => (
          <span
            key={b}
            className="rounded-full border border-line bg-canvas-subtle px-3 py-1 text-xs font-semibold text-primary"
          >
            {b}
          </span>
        ))}
        {listing.isVerified ? (
          <span className="rounded-full bg-open/10 px-3 py-1 text-xs font-semibold text-open">
            Verified
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-ink leading-relaxed">{listing.description}</p>
      <p className="mt-2 text-sm text-muted">
        Best for <span className="font-semibold text-steel">{listing.bestFor}</span>
      </p>

      {listing.highlights.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Highlights
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {listing.highlights.map((h) => (
              <li
                key={h}
                className="rounded-full border border-line bg-white px-3 py-1 text-sm shadow-sm"
              >
                {h}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {listing.amenities.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Features
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full bg-canvas-subtle px-3 py-1 text-sm text-muted"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-line bg-canvas-subtle p-5">
        <h2 className="text-sm font-semibold text-primary">Good to know</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {listing.notes.parking ? <li>Parking: {listing.notes.parking}</li> : null}
          {listing.notes.walkingDifficulty ? (
            <li>Walking: {listing.notes.walkingDifficulty}</li>
          ) : null}
          {listing.notes.seniorFriendly ? <li>Senior friendly</li> : null}
          {listing.notes.kidFriendly ? <li>Kid friendly</li> : null}
          {listing.notes.weatherCaution ? (
            <li className="text-closed">⚠ {listing.notes.weatherCaution}</li>
          ) : null}
        </ul>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              logLead({
                listingId: listing.id,
                listingType: listing.kind,
                actionType: "whatsapp",
              })
            }
            className="tap inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        ) : null}
        {listing.phone ? (
          <a
            href={`tel:${listing.phone}`}
            onClick={() =>
              logLead({
                listingId: listing.id,
                listingType: listing.kind,
                actionType: "call",
              })
            }
            className="tap inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-primary"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        ) : null}
        <a
          href={`https://maps.google.com/?q=${mapsQ}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            logLead({
              listingId: listing.id,
              listingType: listing.kind,
              actionType: "directions",
            })
          }
          className="tap inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          <Navigation className="h-4 w-4" />
          Directions
        </a>
        <SaveButton kind={listing.kind} slug={listing.slug} className="w-full" />
      </div>

      <section className="mt-8 rounded-2xl border border-dashed border-line bg-white p-6 text-center">
        <MapPin className="mx-auto h-8 w-8 text-steel" />
        <p className="mt-2 text-sm font-semibold text-primary">Map view</p>
        <p className="text-xs text-muted">Interactive map coming in a future update.</p>
      </section>

      {nearby.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Nearby</h2>
          <ul className="mt-3 space-y-2">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={
                    n.kind === "restaurant"
                      ? `/eat/${n.slug}`
                      : n.kind === "hidden_gem"
                        ? `/hidden-gems/${n.slug}`
                        : `/things-to-do/${n.slug}`
                  }
                  className="block rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-primary shadow-sm hover:border-steel"
                >
                  {n.name}
                  <span className="ml-2 text-muted">· {n.shortDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
