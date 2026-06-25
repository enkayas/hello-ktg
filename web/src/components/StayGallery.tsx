"use client";

import { useState } from "react";
import { photoUrl } from "@/lib/storage";
import type { HomestayPhoto } from "@/lib/types";

// Mobile-first gallery: big active image + thumbnail strip. Falls back to a
// single image_url, or a leaf placeholder when there are no photos.
export default function StayGallery({
  photos,
  fallback,
  name,
}: {
  photos: HomestayPhoto[];
  fallback: string | null;
  name: string;
}) {
  const sorted = [...photos].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const urls = sorted.length
    ? sorted.map((p) => photoUrl(p.storage_path))
    : fallback
      ? [fallback]
      : [];
  const [active, setActive] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-mist">
        <span className="font-serif text-6xl text-tea">🍃</span>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urls[active]}
          alt={name}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      {urls.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((u, i) => (
            <button
              key={u}
              onClick={() => setActive(i)}
              className={`shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === active ? "ring-leaf" : "ring-transparent"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u}
                alt=""
                className="h-16 w-20 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
