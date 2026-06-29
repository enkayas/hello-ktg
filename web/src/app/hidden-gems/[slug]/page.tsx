import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HKDetailShell from "@/components/hk/DetailShell";
import ListingDetail from "@/components/ListingDetail";
import { getAllHiddenGems, getHiddenGemBySlug } from "@/lib/listings/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllHiddenGems().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getHiddenGemBySlug(slug);
  if (!listing) return { title: "Hidden gem not found" };
  return {
    title: `${listing.name} — Hidden Gem near Kotagiri`,
    description: listing.description,
    openGraph: {
      title: listing.name,
      description: listing.shortDescription,
      images: listing.images[0] ? [{ url: listing.images[0] }] : undefined,
    },
  };
}

export default async function HiddenGemDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = getHiddenGemBySlug(slug);
  if (!listing) notFound();

  return (
    <HKDetailShell>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ListingDetail listing={listing} backHref="/hidden-gems" backLabel="Hidden Gems" />
      </div>
    </HKDetailShell>
  );
}
