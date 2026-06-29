import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HKShell from "@/components/hk/Shell";
import ListingDetail from "@/components/ListingDetail";
import { eatItems } from "@/data/handoff";
import { getRestaurantBySlug } from "@/lib/listings/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return eatItems.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getRestaurantBySlug(slug);
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
  const listing = getRestaurantBySlug(slug);
  if (!listing) notFound();

  return (
    <HKShell>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ListingDetail listing={listing} backHref="/eat" backLabel="Eat" />
      </div>
    </HKShell>
  );
}
