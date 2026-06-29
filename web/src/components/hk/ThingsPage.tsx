"use client";

import { useMemo, useState } from "react";
import FilterChips, { toggleFilter } from "./FilterChips";
import { ThingCard } from "./Cards";
import { thingFilters, things } from "@/data/handoff";
import type { ThingItem } from "@/data/handoff/types";

export function ThingsGrid({ items = things }: { items?: ThingItem[] }) {
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
          filters={thingFilters}
          active={active}
          onToggle={(l) => setActive((a) => toggleFilter(a, l))}
        />
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-[72px] pt-[22px]">
        <p className="mb-[18px] text-sm text-muted">
          <span className="font-mono font-semibold text-primary">{filtered.length}</span>{" "}
          places to explore
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
          {filtered.map((r) => (
            <ThingCard key={r.id} item={r} />
          ))}
        </div>
      </section>
    </>
  );
}
