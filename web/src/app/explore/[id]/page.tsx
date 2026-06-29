import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { Btn } from "@/components/ui";
import { getExploreSpot, getExploreSpots } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getExploreSpots().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const spot = getExploreSpot(id);
  if (!spot) return { title: "Not found" };
  return {
    title: spot.name,
    description: spot.description,
  };
}

export default async function ExploreDetailPage({ params }: Props) {
  const { id } = await params;
  const spot = getExploreSpot(id);
  if (!spot) notFound();

  return (
    <>
      <SiteNav variant="solid" />
      <header className="relative flex min-h-[40vh] items-end text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${spot.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-12 pt-28">
          <p className="text-sm text-white/80">
            <Link href="/" className="text-gold-soft">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/explore" className="text-gold-soft">
              Explore
            </Link>
          </p>
          <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            {spot.tag}
          </span>
          <h1 className="display mt-3 text-4xl font-bold">{spot.name}</h1>
          <p className="mt-2 text-white/90">{spot.distance}</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-lg text-ink">{spot.details}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-leaf bg-mist p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
              Best time
            </h4>
            <p className="mt-1 text-sm font-medium text-forest">{spot.timing}</p>
          </div>
          <div className="rounded-xl border-l-4 border-leaf bg-mist p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
              Entry fee
            </h4>
            <p className="mt-1 text-sm font-medium text-forest">{spot.entryFee}</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="display text-xl font-semibold text-forest">Highlights</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {spot.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-forest"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        {spot.contact ? (
          <p className="mt-8 text-sm text-muted">
            <b className="text-forest">Contact:</b> {spot.contact}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Btn href="/stay">Find a place to stay</Btn>
          <Btn href="/explore" variant="outline">
            ← All places
          </Btn>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
