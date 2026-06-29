import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_BRAND_ASSETS,
  type SiteAsset,
} from "@/lib/brand";

export async function getSiteAssets(): Promise<SiteAsset[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_assets")
      .select("id, kind, background, storage_path, alt, width, height")
      .order("id");

    if (error || !data?.length) return DEFAULT_BRAND_ASSETS;
    return data as SiteAsset[];
  } catch {
    return DEFAULT_BRAND_ASSETS;
  }
}
