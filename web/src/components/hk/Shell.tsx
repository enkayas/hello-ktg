import type { ReactNode } from "react";
import { getSiteAssets } from "@/lib/queries/brand";
import HKFooter from "./Footer";
import HKHeader from "./Header";

export default async function HKShell({ children }: { children: ReactNode }) {
  const brandAssets = await getSiteAssets();

  return (
    <>
      <HKHeader assets={brandAssets} />
      <main className="flex-1 bg-white">{children}</main>
      <HKFooter assets={brandAssets} />
    </>
  );
}
