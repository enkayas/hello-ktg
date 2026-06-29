"use client";

type Props = {
  filters: readonly string[];
  active: string[];
  onChange: (next: string[]) => void;
};

export default function FilterChips({ filters, active, onChange }: Props) {
  function toggle(f: string) {
    if (active.includes(f)) {
      onChange(active.filter((x) => x !== f));
    } else {
      onChange([...active, f]);
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style: none] [scrollbar-width: none] [&::-webkit-scrollbar]:hidden">
      {filters.map((f) => {
        const on = active.includes(f);
        return (
          <button
            key={f}
            type="button"
            onClick={() => toggle(f)}
            className={`tap shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              on
                ? "bg-primary text-white shadow-md"
                : "border border-cloud bg-white text-charcoal/80 hover:border-tea/40 hover:text-primary"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
