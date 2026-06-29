"use client";

import { useMemo, useState } from "react";
import FilterChips, { toggleFilter } from "./FilterChips";
import { EatCard } from "./Cards";
import { eatFilters, eatItems } from "@/data/handoff";

export function EatGrid() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const onlyOpen = !!active["Open Now"];
    const on = Object.keys(active).filter((k) => k !== "Open Now");
    let results = eatItems.filter((r) => on.every((f) => r.filters.includes(f)));
    if (onlyOpen) results = results.filter((r) => r.open);
    return results;
  }, [active]);

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-6 pt-7">
        <FilterChips
          filters={eatFilters}
          active={active}
          onToggle={(l) => setActive((a) => toggleFilter(a, l))}
        />
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-[72px] pt-[22px]">
        <p className="mb-[18px] text-sm text-muted">
          <span className="font-mono font-semibold text-primary">{filtered.length}</span>{" "}
          places to eat
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[22px]">
          {filtered.map((r) => (
            <EatCard key={r.id} item={r} />
          ))}
        </div>
      </section>
    </>
  );
}
