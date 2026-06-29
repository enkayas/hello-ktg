import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { StayGrid } from "@/components/hk/StayPage";
import { getPublishedStays } from "@/lib/queries";
import { coverPhotoUrl } from "@/lib/storage";
import { images } from "@/lib/images";
import type { StayItem } from "@/data/handoff/types";
import { stays as mockStays } from "@/data/handoff";

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
