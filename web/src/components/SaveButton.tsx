"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { SavedItemRef } from "@/lib/listings/types";
import { isSaved, toggleSaved } from "@/lib/saved";

type Props = {
  kind: SavedItemRef["kind"];
  slug: string;
  className?: string;
};

export default function SaveButton({ kind, slug, className = "" }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(kind, slug));
  }, [kind, slug]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleSaved(kind, slug))}
      className={`tap inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-primary hover:border-steel ${className}`}
      aria-pressed={saved}
    >
      <Heart
        className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`}
        strokeWidth={2}
      />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
