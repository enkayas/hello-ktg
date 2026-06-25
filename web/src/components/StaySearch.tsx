"use client";

import { useMemo, useState } from "react";
import type { Homestay } from "@/lib/types";
import StayCard from "@/components/StayCard";

export default function StaySearch({ stays }: { stays: Homestay[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const types = useMemo(
    () => ["all", ...Array.from(new Set(stays.map((s) => s.type)))],
    [stays],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return stays.filter((s) => {
      const matchesType = type === "all" || s.type === type;
      const matchesText =
        !needle ||
        [s.name, s.area, s.type]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle));
      return matchesType && matchesText;
    });
  }, [stays, q, type]);

  return (
    <div>
      <div className="sticky top-[57px] z-40 -mx-5 mb-6 bg-cream/95 px-5 py-3 backdrop-blur">
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search by name or area…"
          className="w-full rounded-full border border-forest/15 bg-white px-5 py-3 text-base outline-none focus:border-leaf"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`tap whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                type === t
                  ? "bg-forest text-white"
                  : "bg-white text-ink ring-1 ring-forest/10"
              }`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No stays match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StayCard key={s.id} stay={s} />
          ))}
        </div>
      )}
    </div>
  );
}
