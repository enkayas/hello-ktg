import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { EatGrid } from "@/components/hk/EatPage";
import { eatItems } from "@/data/handoff";
import { mapRestaurantToEatItem } from "@/lib/directory-mappers";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";
import { getPublishedRestaurants } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Eat in Kotagiri — Cafés & restaurants",
  description:
    "Curated cafés, South Indian breakfasts, and garden restaurants in Kotagiri and the Nilgiris.",
};

export default async function EatPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const fromDb = await getPublishedRestaurants();
  const items = fromDb.length > 0 ? fromDb.map(mapRestaurantToEatItem) : eatItems;

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
