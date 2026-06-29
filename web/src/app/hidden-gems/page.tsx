import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { GemsGrid } from "@/components/hk/Features";
import { getAllHiddenGems } from "@/lib/listings/catalog";
import { mapHiddenGemRow } from "@/lib/directory-mappers";
import { getPublishedHiddenGems } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Hidden gems of the Nilgiris — local picks",
  description:
    "Quiet viewpoints, tea valley drives, rainy-day cafés and photo spots — curated by locals who know Kotagiri.",
  openGraph: {
    title: "Hidden Gems of the Nilgiris",
    description: "Off-list corners of Kotagiri, Ooty and Coonoor.",
  },
};

export const revalidate = 300;

export default async function HiddenGemsPage() {
  const fromDb = await getPublishedHiddenGems();
  const gems = fromDb.length > 0 ? fromDb.map(mapHiddenGemRow) : getAllHiddenGems();

  return (
    <HKShell>
      <PageHero
        eyebrow="Curated, not crowdsourced"
        title="Hidden Gems of the Nilgiris"
        subtitle="The corners that never make the lists — gathered and vouched for by stewards, guides and growers who've walked these hills for years."
        goldEyebrow
      />
      <GemsGrid gems={gems} />
    </HKShell>
  );
}
