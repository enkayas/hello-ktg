import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { Btn, PageHero, SectionHeader } from "@/components/ui";
import { HIDDEN_SPOTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hidden Kotagiri",
  description: "Off-the-beaten-path Kotagiri — sacred peaks, quiet falls and echoing valleys.",
};

export default function HiddenKotagiriPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Off the beaten path"
        title="Hidden Kotagiri"
        lede="Beyond the famous viewpoints lie sacred peaks, quiet waterfalls, echoing valleys and tea-estate paths where you'll often have the hills to yourself."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/Rangasamy_Peak_seen_from_Kodanad.jpg?width=1600"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <SectionHeader
          eyebrow="Lesser-known spots"
          title="Places most visitors miss"
          lede="Researched, real, and refreshingly uncrowded — each a short, scenic trip from town."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {HIDDEN_SPOTS.map((spot) => (
            <Link
              key={spot.id}
              href={spot.href}
              className="group relative block min-h-[300px] overflow-hidden rounded-[22px] shadow-lg"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition group-hover:scale-105"
                style={{ backgroundImage: `url('${spot.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                {spot.tag}
              </span>
              <div className="absolute bottom-0 p-5 text-white">
                <span className="text-xs font-semibold text-gold-soft">{spot.distance}</span>
                <h3 className="display mt-1 text-xl font-semibold">{spot.title}</h3>
                <p className="mt-1 text-sm text-white/85">{spot.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-forest/10 border-l-4 border-l-sun bg-mist p-5 text-sm">
          <b className="text-forest">Travel responsibly.</b> Several of these sit on or near
          Reserve Forest land and sacred sites. A Forest Department permit and/or a registered
          local guide may be required — check current access locally before setting out.
        </div>
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-forest to-pine p-10 text-center text-white">
          <h2 className="display text-2xl font-semibold">Want a local to take you there?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            Our hosts and registered guides know these paths, the permits, and the best light.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Btn href="/stays" variant="gold">
              Find a host →
            </Btn>
            <Btn href="/things-to-do" variant="light">
              See guided treks →
            </Btn>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
