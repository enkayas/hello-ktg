import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { GemsGrid } from "@/components/hk/Features";

export default function HiddenGemsPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Curated, not crowdsourced"
        title="Hidden Gems of the Nilgiris"
        subtitle="The corners that never make the lists — gathered and vouched for by stewards, guides and growers who've walked these hills for years."
        goldEyebrow
      />
      <GemsGrid />
    </HKShell>
  );
}
