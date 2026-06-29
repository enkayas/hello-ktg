import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import HKShell from "@/components/hk/Shell";
import { getRouteBySlug, ROUTES } from "@/lib/routes-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return { title: "Route not found" };
  return {
    title: `${route.title} — Drive guide`,
    description: route.description,
  };
}

export default async function RouteDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  return (
    <HKShell>
      <div className="mx-auto max-w-3xl px-6 py-8 pb-20">
        <Link href="/routes" className="text-sm font-semibold text-steel hover:text-primary">
          ← Scenic routes
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-bold text-primary">{route.title}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-steel" />
            {route.distance}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-steel" />
            {route.travelTime}
          </span>
        </div>
        <p className="mt-5 text-ink leading-relaxed">{route.description}</p>

        <Section title="Overview">
          <p>
            {route.from} → {route.to}. Best time: {route.bestTime}
          </p>
        </Section>

        <Section title="Best stops">
          <ul className="list-inside list-disc space-y-1 text-muted">
            {route.bestStops.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section title="Food stops">
          <ul className="flex flex-wrap gap-2">
            {route.foodStops.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1 text-sm"
              >
                <UtensilsCrossed className="h-3 w-3 text-steel" />
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Viewpoints">
          <ul className="list-inside list-disc space-y-1 text-muted">
            {route.viewpoints.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Section>

        <Section title="Restroom stop">{route.restroomStop}</Section>

        <section className="mt-6 rounded-2xl border border-closed/30 bg-closed/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-closed">
            <AlertTriangle className="h-4 w-4" />
            Road cautions
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            {route.cautions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <Section title="Nearby stays">
          <ul className="flex flex-wrap gap-2">
            {route.nearbyStays.map((s) => (
              <li key={s}>
                <Link
                  href="/stay"
                  className="rounded-full border border-line bg-canvas-subtle px-3 py-1 text-sm text-primary hover:border-steel"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </HKShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <div className="mt-2 text-sm text-ink">{children}</div>
    </section>
  );
}
