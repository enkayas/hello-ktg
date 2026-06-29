"use client";

import { useMemo, useState } from "react";
import { Crosshair } from "lucide-react";
import FilterChips, { toggleFilter } from "./FilterChips";
import { NearCard } from "./Cards";
import { nearFilters, nearItems } from "@/data/handoff";

const CAT_CHIPS = ["Food", "Stays", "Viewpoints", "Cafés"] as const;

export function NearMeContent() {
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [located, setLocated] = useState(false);

  const filtered = useMemo(() => {
    const activeCats = CAT_CHIPS.filter((c) => active[c]);
    const onlyOpen = !!active["Open Now"];
    let results = nearItems.slice();
    if (activeCats.length) {
      results = results.filter((r) => activeCats.includes(r.cat));
    }
    if (onlyOpen) results = results.filter((r) => r.open);
    return results;
  }, [active]);

  return (
    <>
      <section className="page-hero-light">
        <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-10 md:pb-12 md:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a6b1a]">
            <span className="h-1.5 w-1.5 animate-hk-pulse rounded-full bg-accent" />
            Location-aware discovery
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,2.625rem)] font-bold leading-[1.05] tracking-[-0.03em] text-primary">
            What&apos;s Near You?
          </h1>
          <p className="mt-3.5 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            Stays, food, viewpoints and cafés around you — sorted by how far
            you&apos;d actually travel.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] bg-white px-6">
        <div className="relative z-2 -mt-6 flex flex-col items-stretch gap-5 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_32px_-12px_rgba(29,58,88,0.12)] md:flex-row md:items-center md:p-6">
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas-subtle shadow-sm">
            <Crosshair className="h-6 w-6 text-steel" strokeWidth={1.7} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold text-primary">
              Showing results around{" "}
              <span className="text-steel">
                {located ? "your location" : "Kotagiri town"}
              </span>
            </div>
            <div className="mt-0.5 text-[13.5px] text-muted">
              Enable precise location for live distances and open-now status.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  () => setLocated(true),
                  () => setLocated(false),
                );
              }
            }}
            className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-canvas hover:bg-primary-mid"
          >
            <Crosshair className="h-4 w-4" strokeWidth={1.9} />
            Enable Location
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pt-8">
        <FilterChips
          filters={nearFilters}
          active={active}
          onToggle={(l) => setActive((a) => toggleFilter(a, l))}
        />
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-[72px] pt-6">
        <div className="mb-[18px] flex items-center justify-between">
          <span className="text-sm text-muted">
            <span className="font-mono font-semibold text-primary">{filtered.length}</span>{" "}
            places near you
          </span>
          <span className="font-mono text-xs text-muted">Sorted by distance</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[22px]">
          {filtered.map((r) => (
            <NearCard key={r.id} item={r} />
          ))}
        </div>
      </section>
    </>
  );
}
