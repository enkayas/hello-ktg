import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import StayCard from "@/components/StayCard";
import { getPublishedStays } from "@/lib/queries";

export const revalidate = 300;

export default async function Home() {
  const stays = await getPublishedStays();
  const featured = stays.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-mist to-cream px-5 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">
              The oldest hill station in the Nilgiris · 1,793 m
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-forest sm:text-5xl">
              The quiet side of the <em className="text-pine">Nilgiris</em>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Tea estates, misty trails and waterfalls — and verified homestays
              to wake up in.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/stays"
                className="tap inline-flex items-center justify-center rounded-full bg-leaf px-6 py-3 font-semibold text-white hover:bg-pine"
              >
                Browse stays
              </Link>
              <Link
                href="/list-your-property"
                className="tap inline-flex items-center justify-center rounded-full border-2 border-forest px-6 py-3 font-semibold text-forest hover:bg-forest hover:text-white"
              >
                List your property
              </Link>
            </div>
          </div>
        </section>

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
