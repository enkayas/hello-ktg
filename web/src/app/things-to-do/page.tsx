import type { Metadata } from "next";
import ActivityCard from "@/components/ActivityCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { PageHero } from "@/components/ui";
import { getActivities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Things to Do in Kotagiri",
  description: "Treks, tea tours, birding walks and heritage trails in Kotagiri.",
};

export default function ThingsToDoPage() {
  const activities = getActivities();

  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Experience"
        title="Things to do, the local way"
        lede="Guided by people from Kotagiri — naturalists, estate workers and trail walkers."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/CATHERINE_WATER_FALLS.jpg?width=1600"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
