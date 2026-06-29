/** Brand logos — Supabase Storage (brand-assets) with /brand/ public fallback */

export const BRAND_BUCKET = "brand-assets";

export type BrandBackground = "light" | "dark" | "neutral";
export type BrandKind = "wordmark" | "icon";

export type SiteAsset = {
  id: string;
  kind: BrandKind;
  background: BrandBackground;
  storage_path: string;
  alt: string;
  width: number | null;
  height: number | null;
};

/** Local fallbacks (same files committed under public/brand/) */
const LOCAL_FALLBACK: Record<string, string> = {
  "helloKotagiri-logo-light.png": "/brand/helloKotagiri-logo-light.png",
  "helloKotagiri-logo-dark.png": "/brand/helloKotagiri-logo-dark.png",
  "icon-ink.png": "/brand/icon-ink.png",
  "icon-white.png": "/brand/icon-white.png",
  "icon-gold.png": "/brand/icon-gold.png",
};

export function brandAssetUrl(storagePath: string): string {
  // Serve from public/brand/ (deployed with the app). site_assets in Supabase
  // holds metadata; run upload-brand-assets.mjs to sync storage + public/.
  return LOCAL_FALLBACK[storagePath] ?? `/brand/${storagePath}`;
}

/** Default asset map when DB is unreachable at build/runtime */
export const DEFAULT_BRAND_ASSETS: SiteAsset[] = [
  {
    id: "wordmark-light",
    kind: "wordmark",
    background: "light",
    storage_path: "helloKotagiri-logo-light.png",
    alt: "HelloKotagiri",
    width: 623,
    height: 152,
  },
  {
    id: "wordmark-dark",
    kind: "wordmark",
    background: "dark",
    storage_path: "helloKotagiri-logo-dark.png",
    alt: "HelloKotagiri",
    width: 623,
    height: 152,
  },
  {
    id: "icon-light",
    kind: "icon",
    background: "light",
    storage_path: "icon-ink.png",
    alt: "HelloKotagiri bird",
    width: 1043,
    height: 926,
  },
  {
    id: "icon-dark",
    kind: "icon",
    background: "dark",
    storage_path: "icon-white.png",
    alt: "HelloKotagiri bird",
    width: 1043,
    height: 926,
  },
  {
    id: "icon-neutral",
    kind: "icon",
    background: "neutral",
    storage_path: "icon-gold.png",
    alt: "HelloKotagiri bird",
    width: 1043,
    height: 926,
  },
];

export function pickBrandAsset(
  assets: SiteAsset[],
  kind: BrandKind,
  background: BrandBackground,
): SiteAsset | undefined {
  return assets.find((a) => a.kind === kind && a.background === background);
}

export function brandImageSrc(asset: SiteAsset): string {
  return brandAssetUrl(asset.storage_path);
}
