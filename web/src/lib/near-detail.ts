import { eatItems } from "@/data/handoff";
import type { NearItem } from "@/data/handoff/types";

const STAY_SLUGS: Record<string, string> = {
  "Silvertip Homestay": "silvertip-homestay",
  "Sunset Camping & Glamping": "sunset-camping-glamping",
  "Tea Estate Homestay": "tea-estate-homestay",
};

/** Resolve a near-me card to a detail page href when possible. */
export function nearItemDetailHref(item: NearItem): string | null {
  if (item.cat === "Stays") {
    const slug = STAY_SLUGS[item.name];
    return slug ? `/stays/${slug}` : "/stay";
  }
  const eat = eatItems.find((e) => e.name === item.name);
  if (eat) return `/eat/${eat.id}`;
  if (item.cat === "Viewpoints") return "/things-to-do";
  return null;
}
