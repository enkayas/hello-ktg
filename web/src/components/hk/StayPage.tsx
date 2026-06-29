"use client";

import { useMemo, useState } from "react";
import FilterChips, { toggleFilter } from "./FilterChips";
import { StayCard } from "./Cards";
import { stays, stayFilters } from "@/data/handoff";
import type { StayItem } from "@/data/handoff/types";

export function StayGrid({ items = stays }: { items?: StayItem[] }) {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const on = Object.keys(active);
    if (on.length === 0) return items;
    return items.filter((r) => on.every((f) => r.filters.includes(f)));
  }, [active, items]);

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-6 pt-7">
        <FilterChips
          filters={stayFilters}
          active={active}
          onToggle={(l) => setActive((a) => toggleFilter(a, l))}
        />
      </section>
      <section className="mx-auto max-w-[1240px] bg-white px-6 pb-[72px] pt-6">
        <p className="mb-5 text-sm text-muted">
          <span className="font-mono font-semibold text-primary">{filtered.length}</span>{" "}
          stays
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[22px]">
          {filtered.map((r) => (
            <StayCard key={r.id} item={r} />
          ))}
        </div>
      </section>
    </>
  );
}
