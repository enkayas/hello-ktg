import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { StayGrid } from "@/components/hk/StayPage";
import { stays as mockStays } from "@/data/handoff";
import type { StayItem } from "@/data/handoff/types";
import { getPublishedStays } from "@/lib/queries";
import { coverPhotoUrl } from "@/lib/storage";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Stays in Kotagiri — homestays & cottages",
  description:
    "Tea-view homestays, family cottages and glamping in Kotagiri and the Nilgiris — book direct with hosts on WhatsApp.",
  openGraph: {
    title: "Find your stay in the Nilgiris",
    description: "Homestays, resorts and cottages in Kotagiri, Ooty and Coonoor.",
  },
};

export const revalidate = 300;

export default async function StayPage() {
  const dbStays = await getPublishedStays();

  let items: StayItem[] = mockStays;
  if (dbStays.length > 0) {
    items = dbStays.map((s) => ({
      id: s.id,
      name: s.name,
      where: s.area ?? "Kotagiri",
      dist: s.area ?? "Kotagiri",
      price:
        s.price_text ??
        (s.base_price ? `₹${s.base_price.toLocaleString("en-IN")} / night` : "Enquire"),
      bestFor: s.type,
      amenities: [
        ...(s.rating ? [`★ ${s.rating}`] : []),
        ...(s.amenities ?? []).slice(0, 3),
      ],
      filters: [
        ...(s.badges ?? []),
        ...(s.amenities ?? []),
        s.type,
      ].filter(Boolean) as string[],
      gradient: "steel" as const,
      image: coverPhotoUrl(s.homestay_photos, s.image_url) ?? images.homestay,
      whatsapp: s.host_phone ?? undefined,
      slug: s.slug,
    }));
  }

  return (
    <HKShell>
      <PageHero
        eyebrow="Stays · Homestays · Bungalows"
        title="Find Your Stay in the Nilgiris"
        subtitle="Tea-view bungalows, family homestays and quiet workcation lofts — listed by the hosts who run them."
      />
      <StayGrid items={items} />
    </HKShell>
  );
}
