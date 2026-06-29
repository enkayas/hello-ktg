import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { EatGrid } from "@/components/hk/EatPage";
import { eatItems } from "@/data/handoff";
import type { EatItem } from "@/data/handoff/types";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";
import { getPublishedRestaurants, type PublishedRestaurant } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Eat in Kotagiri — Cafés & restaurants",
  description:
    "Curated cafés, South Indian breakfasts, and garden restaurants in Kotagiri and the Nilgiris.",
};

function mapRestaurant(r: PublishedRestaurant): EatItem {
  const slug = r.slug ?? r.id;
  return {
    id: slug,
    name: r.name,
    where: r.area ?? "Kotagiri",
    knownFor: r.cuisine ?? r.description ?? "local food",
    open: true,
    status: "Open now",
    tags: [r.cuisine ?? "Restaurant", "Verified"],
    filters: r.cuisine ? [r.cuisine] : ["Family Friendly"],
    gradient: "steel",
    image:
      r.image_url ??
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  };
}

export default async function EatPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const fromDb = await getPublishedRestaurants();
  const items = fromDb.length > 0 ? fromDb.map(mapRestaurant) : eatItems;

  return (
    <HKShell>
      <PageHero
        eyebrow={t.eat.eyebrow}
        title={t.eat.title}
        subtitle={t.eat.subtitle}
      />
      <EatGrid items={items} />
    </HKShell>
  );
}
