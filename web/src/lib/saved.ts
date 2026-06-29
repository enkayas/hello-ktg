import type { SavedItemRef } from "@/lib/listings/types";

const STORAGE_KEY = "hellokotagiri_saved";

export function getSavedItems(): SavedItemRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedItemRef[];
  } catch {
    return [];
  }
}

export function isSaved(kind: SavedItemRef["kind"], slug: string): boolean {
  return getSavedItems().some((s) => s.kind === kind && s.slug === slug);
}

export function toggleSaved(kind: SavedItemRef["kind"], slug: string): boolean {
  const items = getSavedItems();
  const idx = items.findIndex((s) => s.kind === kind && s.slug === slug);
  if (idx >= 0) {
    items.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return false;
  }
  items.push({ kind, slug, savedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return true;
}

export function removeSaved(kind: SavedItemRef["kind"], slug: string): void {
  const items = getSavedItems().filter(
    (s) => !(s.kind === kind && s.slug === slug),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
