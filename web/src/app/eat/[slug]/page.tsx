import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HKDetailShell from "@/components/hk/DetailShell";
import ListingDetail from "@/components/ListingDetail";
import { eatItems } from "@/data/handoff";
import { getRestaurantForDetail } from "@/lib/listings/catalog";
import { getPublishedRestaurants } from "@/lib/queries";

export const dynamicParams = true;
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const catalog = eatItems.map((item) => ({ slug: item.id }));
  try {
    const fromDb = await getPublishedRestaurants();
    const dbParams = fromDb.map((r) => ({ slug: r.slug ?? r.id }));
    return [...catalog, ...dbParams];
  } catch {
    return catalog;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getRestaurantForDetail(slug);
  if (!listing) return { title: "Restaurant not found" };
  return {
    title: `${listing.name} — Eat in ${listing.locationName}`,
    description: listing.description,
    openGraph: {
      title: listing.name,
      description: listing.shortDescription,
      images: listing.images[0] ? [{ url: listing.images[0] }] : undefined,
    },
  };
}

export default async function EatDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getRestaurantForDetail(slug);
  if (!listing) notFound();

  return (
    <HKDetailShell>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ListingDetail listing={listing} backHref="/eat" backLabel="Eat" />
      </div>
    </HKDetailShell>
  );
}
