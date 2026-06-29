import { createPublicClient } from "@/lib/supabase/public";
import type { StayWithPhotos } from "@/lib/types";

const SELECT =
  "*, homestay_photos(id, storage_path, is_cover, sort_order, unit_id), property_units(*)";

// Public, published stays — ordered featured-first then by sort_order.
// Degrades to an empty list if Supabase is unreachable (e.g. egress blocked at
// build time) so the build/render never hard-crashes.
export async function getPublishedStays(): Promise<StayWithPhotos[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("homestays")
      .select(SELECT)
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("rating", { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data ?? []) as StayWithPhotos[];
  } catch (err) {
    console.error("getPublishedStays failed:", err);
    return [];
  }
}

export async function getStayBySlug(
  slug: string,
): Promise<StayWithPhotos | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("homestays")
      .select(SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return (data as StayWithPhotos) ?? null;
  } catch (err) {
    console.error("getStayBySlug failed:", err);
    return null;
  }
}

export type PublishedRestaurant = {
  id: string;
  slug: string | null;
  name: string;
  cuisine: string | null;
  area: string | null;
  description: string | null;
  image_url: string | null;
  host_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  is_featured: boolean | null;
  is_published: boolean | null;
};

export async function getPublishedRestaurants(): Promise<PublishedRestaurant[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("restaurants")
      .select(
        "id, slug, name, cuisine, area, description, image_url, host_phone, latitude, longitude, is_featured, is_published",
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublishedRestaurant[];
  } catch (err) {
    console.error("getPublishedRestaurants failed:", err);
    return [];
  }
}

/** Lookup a published restaurant by curated slug or Supabase id. */
export async function getPublishedRestaurantBySlugOrId(
  slugOrId: string,
): Promise<PublishedRestaurant | null> {
  try {
    const supabase = createPublicClient();
    const select =
      "id, slug, name, cuisine, area, description, image_url, host_phone, latitude, longitude, is_featured, is_published";

    const { data: bySlug, error: slugErr } = await supabase
      .from("restaurants")
      .select(select)
      .eq("is_published", true)
      .eq("slug", slugOrId)
      .maybeSingle();
    if (slugErr) throw slugErr;
    if (bySlug) return bySlug as PublishedRestaurant;

    const { data: byId, error: idErr } = await supabase
      .from("restaurants")
      .select(select)
      .eq("is_published", true)
      .eq("id", slugOrId)
      .maybeSingle();
    if (idErr) throw idErr;
    return (byId as PublishedRestaurant) ?? null;
  } catch (err) {
    console.error("getPublishedRestaurantBySlugOrId failed:", err);
    return null;
  }
}

export type PublishedPlace = {
  id: string;
  slug: string | null;
  name: string;
  place_type: string | null;
  area: string | null;
  description: string | null;
  image_url: string | null;
  host_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  best_time: string | null;
  difficulty: string | null;
  suits: string | null;
  filters: string[] | null;
  badges: string[] | null;
  is_featured: boolean | null;
  is_published: boolean | null;
};

export type PublishedHiddenGem = {
  id: string;
  slug: string | null;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  host_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_label: string | null;
  badges: string[] | null;
  is_featured: boolean | null;
  is_published: boolean | null;
};

const PLACE_SELECT =
  "id, slug, name, place_type, area, description, image_url, host_phone, latitude, longitude, best_time, difficulty, suits, filters, badges, is_featured, is_published";

const GEM_SELECT =
  "id, slug, name, category, description, image_url, host_phone, latitude, longitude, distance_label, badges, is_featured, is_published";

export async function getPublishedPlaces(): Promise<PublishedPlace[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("places")
      .select(PLACE_SELECT)
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublishedPlace[];
  } catch (err) {
    console.error("getPublishedPlaces failed:", err);
    return [];
  }
}

export async function getPublishedPlaceBySlugOrId(
  slugOrId: string,
): Promise<PublishedPlace | null> {
  try {
    const supabase = createPublicClient();
    const { data: bySlug, error: slugErr } = await supabase
      .from("places")
      .select(PLACE_SELECT)
      .eq("is_published", true)
      .eq("slug", slugOrId)
      .maybeSingle();
    if (slugErr) throw slugErr;
    if (bySlug) return bySlug as PublishedPlace;

    const { data: byId, error: idErr } = await supabase
      .from("places")
      .select(PLACE_SELECT)
      .eq("is_published", true)
      .eq("id", slugOrId)
      .maybeSingle();
    if (idErr) throw idErr;
    return (byId as PublishedPlace) ?? null;
  } catch (err) {
    console.error("getPublishedPlaceBySlugOrId failed:", err);
    return null;
  }
}

export async function getPublishedHiddenGems(): Promise<PublishedHiddenGem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("hidden_gems")
      .select(GEM_SELECT)
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PublishedHiddenGem[];
  } catch (err) {
    console.error("getPublishedHiddenGems failed:", err);
    return [];
  }
}

export async function getPublishedHiddenGemBySlugOrId(
  slugOrId: string,
): Promise<PublishedHiddenGem | null> {
  try {
    const supabase = createPublicClient();
    const { data: bySlug, error: slugErr } = await supabase
      .from("hidden_gems")
      .select(GEM_SELECT)
      .eq("is_published", true)
      .eq("slug", slugOrId)
      .maybeSingle();
    if (slugErr) throw slugErr;
    if (bySlug) return bySlug as PublishedHiddenGem;

    const { data: byId, error: idErr } = await supabase
      .from("hidden_gems")
      .select(GEM_SELECT)
      .eq("is_published", true)
      .eq("id", slugOrId)
      .maybeSingle();
    if (idErr) throw idErr;
    return (byId as PublishedHiddenGem) ?? null;
  } catch (err) {
    console.error("getPublishedHiddenGemBySlugOrId failed:", err);
    return null;
  }
}
