import type { Metadata } from "next";
import AttractionCard from "@/components/AttractionCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { PageHero } from "@/components/ui";
import { getExploreSpots } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore Kotagiri",
  description: "Viewpoints, waterfalls, shola forests and heritage sites around Kotagiri.",
};

export default function ExplorePage() {
  const spots = getExploreSpots();

  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Explore"
        title="Places to visit"
        lede="Less commercial than Ooty — every spot is a short, scenic drive from town through tea gardens."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/Kodanad.jpg?width=1600"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <AttractionCard key={spot.id} spot={spot} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
