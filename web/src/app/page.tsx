import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import StayCard from "@/components/StayCard";
import HeroCarousel from "@/components/HeroCarousel";
import { getPublishedStays } from "@/lib/queries";

export const revalidate = 300;

export default async function Home() {
  const stays = await getPublishedStays();
  const featured = stays.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero carousel */}
        <HeroCarousel />

        {/* Featured stays */}
        <section className="mx-auto w-full max-w-5xl px-5 py-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
                Featured
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-forest">
                Places to stay
              </h2>
            </div>
            <Link
              href="/stays"
              className="text-sm font-semibold text-leaf hover:text-pine"
            >
              See all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-forest/10 px-5 py-8 text-center text-sm text-muted">
        <p>Travel Kotagiri · Kotagiri, Nilgiris, Tamil Nadu</p>
      </footer>
    </>
  );
}
