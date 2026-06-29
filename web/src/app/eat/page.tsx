import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { EatGrid } from "@/components/hk/EatPage";

export default function EatPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Restaurants · Cafés · Bakeries"
        title="Eat Like a Local"
        subtitle="Badaga home kitchens, estate cafés and the bakeries that have been here for decades — where the locals actually eat."
      />
      <EatGrid />
    </HKShell>
  );
}
