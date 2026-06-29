import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { ROUTES } from "@/lib/routes-data";

export const metadata: Metadata = {
  title: "Scenic routes — HelloKotagiri",
  description:
    "Drive guides for Coimbatore to Kotagiri, Ooty, Masinagudi, Kodanad and more — stops, food, and road cautions.",
};

export default function RoutesPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Drive guides"
        title="Scenic routes"
        subtitle="Distances, best stops, food breaks, and cautions for Nilgiri hill roads."
      />
      <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-8">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {ROUTES.map((route) => (
            <article
              key={route.slug}
              className="card-hover flex flex-col rounded-2xl border border-line bg-white p-6 shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]"
            >
              <h2 className="text-lg font-semibold text-primary">{route.title}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-steel" />
                  {route.distance}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-steel" />
                  {route.travelTime}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">{route.description}</p>
              <p className="mt-3 text-xs text-muted">
                Best stops: {route.bestStops.slice(0, 2).join(" · ")}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <UtensilsCrossed className="h-3 w-3" />
                {route.foodStops[0]}
              </p>
              <Link
                href={`/routes/${route.slug}`}
                className="tap mt-5 inline-flex items-center gap-2 text-sm font-semibold text-steel hover:text-primary"
              >
                View route
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </HKShell>
  );
}
