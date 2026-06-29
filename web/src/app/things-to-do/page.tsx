import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { ThingsGrid } from "@/components/hk/ThingsPage";

export default function ThingsToDoPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Viewpoints · Trails · Wildlife"
        title="Explore Kotagiri & Beyond"
        subtitle="From a five-minute shola walk to a day-trip safari — with the honest details: how far, when to go and who it suits."
      />
      <ThingsGrid />
    </HKShell>
  );
}
