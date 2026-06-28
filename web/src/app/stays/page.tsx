import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StaySearch from "@/components/StaySearch";
import { getPublishedStays } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Stays in Kotagiri",
  description:
    "Browse verified homestays, cottages, resorts and glamping in Kotagiri and around the Nilgiris.",
};

// Revalidate the directory periodically (ISR).
export const revalidate = 300;

export default async function StaysPage() {
  const stays = await getPublishedStays();

  return (
    <>
      <SiteNav variant="solid" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-24 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
          Where to stay
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-forest">
          Stays in &amp; around Kotagiri
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          {stays.length} verified places — tea-estate homestays, cottages,
          resorts and glamping at 1,793&nbsp;m.
        </p>
        <div className="mt-8">
          <StaySearch stays={stays} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
