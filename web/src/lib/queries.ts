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
