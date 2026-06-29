"use client";

import { useState } from "react";

type Props = {
  filters: readonly string[];
  active: Record<string, boolean>;
  onToggle: (label: string) => void;
};

export default function FilterChips({ filters, active, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {filters.map((label) => {
        const on = !!active[label];
        return (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(label)}
            className={`rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all duration-160 shadow-sm ${
              on
                ? "border border-primary bg-primary text-white shadow-[0_4px_12px_-4px_rgba(29,58,88,0.35)]"
                : "border border-line bg-white text-muted hover:border-steel/50 hover:shadow-md"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function useFilterState() {
  return useState<Record<string, boolean>>({});
}

export function toggleFilter(
  active: Record<string, boolean>,
  label: string,
): Record<string, boolean> {
  const next = { ...active };
  if (next[label]) delete next[label];
  else next[label] = true;
  return next;
}
