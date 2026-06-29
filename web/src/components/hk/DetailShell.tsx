import type { ReactNode } from "react";
import { DEFAULT_BRAND_ASSETS } from "@/lib/brand";
import HKFooter from "./Footer";
import HKHeader from "./Header";

/**
 * Lightweight shell for listing detail pages — uses local brand assets only
 * (no async Supabase fetch). Avoids client-side navigation 404s on Cloudflare.
 */
export default function HKDetailShell({ children }: { children: ReactNode }) {
  const assets = DEFAULT_BRAND_ASSETS;
  return (
    <>
      <HKHeader assets={assets} />
      <main className="flex-1 bg-white">{children}</main>
      <HKFooter assets={assets} />
    </>
  );
}
