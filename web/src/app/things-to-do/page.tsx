import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { ThingsGrid } from "@/components/hk/ThingsPage";
import { things } from "@/data/handoff";
import { mapPlaceToThingItem } from "@/lib/directory-mappers";
import { getPublishedPlaces } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Things to do in Kotagiri — viewpoints, trails & wildlife",
  description:
    "Kodanad sunrise, Catherine Falls, Longwood Shola birding, and day trips across the Nilgiris — with honest distance and difficulty notes.",
  openGraph: {
    title: "Things to do in Kotagiri",
    description: "Viewpoints, waterfalls, forest walks and wildlife near Kotagiri.",
  },
};

export const revalidate = 300;

export default async function ThingsToDoPage() {
  const fromDb = await getPublishedPlaces();
  const items = fromDb.length > 0 ? fromDb.map(mapPlaceToThingItem) : things;

  return (
    <HKShell>
      <PageHero
        eyebrow="Viewpoints · Trails · Wildlife"
        title="Explore Kotagiri & Beyond"
        subtitle="From a five-minute shola walk to a day-trip safari — with the honest details: how far, when to go and who it suits."
      />
      <ThingsGrid items={items} />
    </HKShell>
  );
}
