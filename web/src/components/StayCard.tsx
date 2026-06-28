import Link from "next/link";
import type { StayWithPhotos } from "@/lib/types";
import { coverPhotoUrl } from "@/lib/storage";

export default function StayCard({ stay }: { stay: StayWithPhotos }) {
  const cover = coverPhotoUrl(stay.homestay_photos, stay.image_url);
  return (
    <Link
      href={`/stays/${stay.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-forest/5 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-mist">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={stay.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-4xl text-tea">
            🍃
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-semibold text-forest">
          {stay.type}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="display text-lg font-semibold text-forest group-hover:text-leaf">
            {stay.name}
          </h3>
          {stay.rating ? (
            <span className="shrink-0 text-sm font-semibold text-sun">
              ★ {stay.rating}
            </span>
          ) : null}
        </div>
        {stay.area ? (
          <p className="mt-1 text-sm text-muted">📍 {stay.area}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted">
            {stay.reviews_count ? `${stay.reviews_count} reviews` : "New listing"}
          </span>
          <span className="text-sm font-semibold text-leaf">View →</span>
        </div>
      </div>
    </Link>
  );
}
