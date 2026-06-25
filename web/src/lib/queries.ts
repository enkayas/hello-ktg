import { createPublicClient } from "@/lib/supabase/public";
import type { Homestay } from "@/lib/types";

// Public, published stays — ordered featured-first then by sort_order.
// Degrades to an empty list if Supabase is unreachable (e.g. egress blocked at
// build time) so the build/render never hard-crashes.
export async function getPublishedStays(): Promise<Homestay[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("homestays")
      .select("*")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("rating", { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data ?? []) as Homestay[];
  } catch (err) {
    console.error("getPublishedStays failed:", err);
    return [];
  }
}

export async function getStayBySlug(slug: string): Promise<Homestay | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("homestays")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Homestay) ?? null;
  } catch (err) {
    console.error("getStayBySlug failed:", err);
    return null;
  }
}
