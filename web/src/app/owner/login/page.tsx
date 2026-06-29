import { Suspense } from "react";
import { getSiteAssets } from "@/lib/queries/brand";
import OwnerLoginClient from "./OwnerLoginClient";

export default async function Page() {
  const assets = await getSiteAssets();
  return (
    <Suspense>
      <OwnerLoginClient assets={assets} />
    </Suspense>
  );
}
