"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StayGallery from "@/components/StayGallery";
import BookingForm from "@/components/BookingForm";
import { useLocale, useTranslations } from "@/components/LocaleProvider";
import { unitTypeLabel } from "@/lib/property-taxonomy";
import type { StayWithPhotos, PropertyUnit, HomestayPhoto } from "@/lib/types";

type Props = {
  stay: StayWithPhotos;
};

export default function StayDetailClient({ stay }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const units = useMemo(
    () =>
      (stay.property_units ?? [])
        .filter((u) => u.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [stay.property_units],
  );

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    units[0]?.id ?? "",
  );

  const selectedUnit = units.find((u) => u.id === selectedUnitId) ?? units[0];

  const propertyPhotos = (stay.homestay_photos ?? []).filter((p) => !p.unit_id);
  const unitPhotos = (stay.homestay_photos ?? []).filter(
    (p) => p.unit_id === selectedUnit?.id,
  );

  const galleryPhotos: HomestayPhoto[] =
    unitPhotos.length > 0
      ? unitPhotos
      : propertyPhotos.length > 0
        ? propertyPhotos
        : (stay.homestay_photos ?? []);

  const displayPrice =
    selectedUnit?.base_price ?? stay.base_price ?? null;

  const bookingName =
    units.length > 1 && selectedUnit
      ? `${stay.name} — ${selectedUnit.name}`
      : stay.name;

  return (
    <>
      <Link href="/stay" className="text-sm font-semibold text-steel hover:text-primary">
        ← {t.nav.allStays}
      </Link>

      <div className="mt-4">
        <StayGallery
          photos={galleryPhotos}
          fallback={stay.image_url}
          name={stay.name}
        />
      </div>

      <div className="mt-5">
        <span className="inline-flex rounded-full border border-line bg-canvas-subtle px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          {stay.type}
        </span>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-0.02em] text-primary">
          {stay.name}
        </h1>
        <p className="mt-1 text-muted">
          {stay.area ? `📍 ${stay.area} · ` : ""}
          {t.stay.kotagiri}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          {stay.rating ? (
            <span className="font-semibold text-sun">★ {stay.rating}</span>
          ) : null}
          {stay.reviews_count ? (
            <span className="text-muted">
              {stay.reviews_count} {t.stay.reviews}
            </span>
          ) : null}
          {displayPrice ? (
            <span className="font-semibold text-primary">
              {t.stay.from} ₹{displayPrice.toLocaleString("en-IN")}
              {t.stay.perNight}
            </span>
          ) : null}
        </div>
      </div>

      {stay.description ? (
        <p className="mt-5 text-ink">{stay.description}</p>
      ) : null}

      {units.length > 1 ? (
        <section className="mt-8">
          <h2 className="font-serif text-lg font-semibold text-primary">
            {t.stay.chooseUnit}
          </h2>
          <ul className="mt-3 space-y-2">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                locale={locale}
                selected={unit.id === selectedUnitId}
                onSelect={() => setSelectedUnitId(unit.id)}
              />
            ))}
          </ul>
        </section>
      ) : selectedUnit ? (
        <UnitSummary unit={selectedUnit} locale={locale} t={t} />
      ) : null}

      {stay.amenities && stay.amenities.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {stay.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full border border-line bg-white px-3 py-1 text-sm text-ink shadow-sm"
            >
              {a}
            </span>
          ))}
        </div>
      ) : null}

      <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-[0_8px_32px_-12px_rgba(29,58,88,0.12)]">
        <h2 className="font-serif text-xl font-semibold text-primary">
          {t.stay.requestBook}
        </h2>
        <p className="mt-1 mb-4 text-sm text-muted">{t.stay.requestHint}</p>
        <BookingForm
          stayName={bookingName}
          hostPhone={stay.host_phone}
          unitLabel={selectedUnit?.name}
        />
      </section>

      {stay.website_url ? (
        <p className="mt-5 text-center text-sm">
          <a
            href={stay.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-steel hover:text-primary"
          >
            {t.stay.visitWebsite} ↗
          </a>
        </p>
      ) : null}
    </>
  );
}

function UnitCard({
  unit,
  locale,
  selected,
  onSelect,
}: {
  unit: PropertyUnit;
  locale: "en" | "ta";
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`tap w-full rounded-2xl border p-4 text-left transition shadow-sm ${
          selected
            ? "border-accent bg-accent/10 shadow-[0_4px_16px_-6px_rgba(221,162,60,0.35)] ring-1 ring-accent/30"
            : "border-line bg-white hover:border-steel hover:shadow-md"
        }`}
      >
        <p className="font-semibold text-primary">{unit.name}</p>
        <p className="mt-1 text-sm text-muted capitalize">
          {unitTypeLabel(unit.unit_type, locale)}
          {unit.base_price
            ? ` · ₹${unit.base_price.toLocaleString("en-IN")} / night`
            : ""}
          {unit.max_guests ? ` · ${unit.max_guests} guests` : ""}
        </p>
      </button>
    </li>
  );
}

function UnitSummary({
  unit,
  locale,
  t,
}: {
  unit: PropertyUnit;
  locale: "en" | "ta";
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-line bg-canvas-subtle p-4 text-sm text-muted shadow-sm">
      <span className="font-semibold text-primary">{unit.name}</span>
      {" · "}
      {unitTypeLabel(unit.unit_type, locale)}
      {unit.max_guests ? ` · ${unit.max_guests} ${t.stay.guests}` : ""}
      {unit.bedrooms ? ` · ${unit.bedrooms} ${t.stay.bedrooms}` : ""}
    </div>
  );
}
