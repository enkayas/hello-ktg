"use client";

import { useMemo, useState } from "react";
import FilterChips from "@/components/brand/FilterChips";
import ListingCard from "@/components/brand/ListingCard";
import { stayFilters, stays as mockStays } from "@/data/mock/stays";
import { coverPhotoUrl } from "@/lib/storage";
import type { StayWithPhotos } from "@/lib/types";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

type Props = {
  dbStays: StayWithPhotos[];
};

export default function StayDirectory({ dbStays }: Props) {
  const [active, setActive] = useState<string[]>([]);

  const useDb = dbStays.length > 0;

  const filteredDb = useMemo(() => {
    if (!useDb) return [];
    if (active.length === 0) return dbStays;
    return dbStays.filter((s) =>
      active.every((f) => {
        const pool = [
          ...(s.badges ?? []),
          ...(s.amenities ?? []),
          s.type,
          s.area ?? "",
        ].map((x) => x.toLowerCase());
        return pool.some((x) => x.includes(f.toLowerCase()));
      }),
    );
  }, [dbStays, active, useDb]);

  const filteredMock = useMemo(() => {
    if (useDb) return [];
    if (active.length === 0) return mockStays;
    return mockStays.filter((s) =>
      active.every((f) => s.tags.some((t) => t.toLowerCase() === f.toLowerCase())),
    );
  }, [active, useDb]);

  const count = useDb ? filteredDb.length : filteredMock.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <FilterChips filters={stayFilters} active={active} onChange={setActive} />

      <p className="mt-4 text-sm text-charcoal/60">
        {count} {count === 1 ? "stay" : "stays"}
        {useDb ? " · live availability & booking" : " · sample listings"}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {useDb
          ? filteredDb.map((stay) => {
              const image =
                coverPhotoUrl(stay.homestay_photos, stay.image_url) ??
                PLACEHOLDER;
              return (
                <ListingCard
                  key={stay.id}
                  variant="stay"
                  name={stay.name}
                  location={stay.area ?? "Kotagiri, Nilgiris"}
                  price={
                    stay.price_text ??
                    (stay.base_price
                      ? `₹${stay.base_price.toLocaleString("en-IN")} / night`
                      : undefined)
                  }
                  bestFor={stay.type}
                  tags={stay.badges ?? []}
                  amenities={stay.amenities ?? undefined}
                  image={image}
                  whatsapp={stay.host_phone ?? undefined}
                  href={`/stays/${stay.slug}`}
                />
              );
            })
          : filteredMock.map((stay) => (
              <ListingCard
                key={stay.id}
                variant="stay"
                name={stay.name}
                location={stay.location}
                distance={stay.distance}
                price={stay.price}
                bestFor={stay.bestFor}
                tags={stay.tags}
                amenities={stay.amenities}
                image={stay.image}
                whatsapp={stay.whatsapp}
                href={`/stays/${stay.id}`}
              />
            ))}
      </div>

      {count === 0 ? (
        <p className="mt-10 rounded-2xl border border-cloud bg-white p-8 text-center text-charcoal/60">
          No stays match those filters — try removing one.
        </p>
      ) : null}
    </section>
  );
}
