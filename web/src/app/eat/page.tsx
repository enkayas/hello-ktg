import type { Metadata } from "next";
import RestaurantCard from "@/components/RestaurantCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { PageHero } from "@/components/ui";
import { RESTAURANTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eat & Drink in Kotagiri",
  description: "Restaurants, cafés and local dining in Kotagiri and the Nilgiris.",
};

export default function EatPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Eat & drink"
        title="Where to eat in Kotagiri"
        lede="Nilgiri tea, hill-station cafés, crisp dosas and garden dining — verified local favourites."
        image="https://silvertipcafe.com/wp-content/uploads/2024/06/DB_1927.jpeg"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESTAURANTS.map((r) => (
            <RestaurantCard key={r.id} r={r} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
