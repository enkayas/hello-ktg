"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { getListingBySlug } from "@/lib/listings/catalog";
import type { SavedItemRef } from "@/lib/listings/types";
import { getSavedItems, removeSaved } from "@/lib/saved";

function detailHref(item: SavedItemRef): string {
  if (item.kind === "stay") return `/stays/${item.slug}`;
  if (item.kind === "restaurant") return `/eat/${item.slug}`;
  if (item.kind === "hidden_gem") return `/hidden-gems/${item.slug}`;
  if (item.kind === "place") return `/things-to-do/${item.slug}`;
  return "/";
}

export default function SavedPageContent() {
  const [items, setItems] = useState<SavedItemRef[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(getSavedItems());
    setReady(true);
  }, []);

  const resolved = items.map((ref) => {
    if (ref.kind === "stay") {
      return { ref, name: ref.slug.replace(/-/g, " "), location: "Kotagiri", kind: "Stay" };
    }
    const listing = getListingBySlug(ref.slug, ref.kind === "place" ? "place" : ref.kind);
    return {
      ref,
      name: listing?.name ?? ref.slug,
      location: listing?.locationName ?? "",
      kind:
        ref.kind === "restaurant"
          ? "Restaurant"
          : ref.kind === "hidden_gem"
            ? "Hidden Gem"
            : "Place",
    };
  });

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 pt-8">
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">Saved places</h1>
      <p className="mt-1 text-sm text-muted">
        Your shortlist — stored on this device only.
      </p>

      {!ready ? (
        <div className="mt-10 space-y-3" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-canvas-subtle" />
          ))}
        </div>
      ) : resolved.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-canvas-subtle px-6 py-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-steel" strokeWidth={1.5} />
          <p className="mt-3 font-semibold text-primary">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">
            Tap the heart on any stay, restaurant, or place to save it here.
          </p>
          <Link
            href="/near-me"
            className="tap mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Explore near me
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {resolved.map(({ ref, name, location, kind }) => (
            <li
              key={`${ref.kind}-${ref.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm"
            >
              <Link href={detailHref(ref)} className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-steel">
                  {kind}
                </span>
                <p className="font-semibold text-primary">{name}</p>
                {location ? (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </p>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => {
                  removeSaved(ref.kind, ref.slug);
                  setItems(getSavedItems());
                }}
                className="tap flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:border-closed hover:text-closed"
                aria-label={`Remove ${name} from saved`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
