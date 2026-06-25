const BUCKET = "property-photos";

// Public URL for a file in the property-photos Storage bucket.
export function photoUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

export type StayPhoto = {
  storage_path: string;
  is_cover: boolean | null;
  sort_order: number | null;
};

// Pick the cover image for a stay: explicit cover → first by sort_order → null.
export function coverPhotoUrl(
  photos: StayPhoto[] | null | undefined,
  fallback?: string | null,
): string | null {
  if (photos && photos.length > 0) {
    const sorted = [...photos].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    const cover = sorted.find((p) => p.is_cover) ?? sorted[0];
    return photoUrl(cover.storage_path);
  }
  return fallback ?? null;
}
