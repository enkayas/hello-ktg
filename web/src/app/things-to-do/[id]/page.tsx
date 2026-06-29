import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HKDetailShell from "@/components/hk/DetailShell";
import ListingDetail from "@/components/ListingDetail";
import { things } from "@/data/handoff";
import { getPlaceBySlug } from "@/lib/listings/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return things.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = getPlaceBySlug(id);
  if (!listing) return { title: "Activity not found" };
  return {
    title: `${listing.name} — Things to do in the Nilgiris`,
    description: listing.description,
    openGraph: {
      title: listing.name,
      description: listing.shortDescription,
      images: listing.images[0] ? [{ url: listing.images[0] }] : undefined,
    },
  };
}

export default async function ThingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = getPlaceBySlug(id);
  if (!listing) notFound();

  return (
    <HKDetailShell>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ListingDetail listing={listing} backHref="/things-to-do" backLabel="Things to do" />
      </div>
    </HKDetailShell>
  );
}
