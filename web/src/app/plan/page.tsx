import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { Btn, PageHero, SectionHeader } from "@/components/ui";
import { seasons, transport } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plan Your Trip to Kotagiri",
  description: "Best time to visit, how to reach Kotagiri, and sample itineraries.",
};

export default function PlanPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Plan"
        title="Plan your Kotagiri trip"
        lede="When to come, how to get here, and what to expect in the oldest Nilgiri hill station."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/NMR_train_at_Ketti_05-02-26_75.jpeg?width=1600"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <SectionHeader
          eyebrow="Seasons"
          title="When to visit"
          lede="Kotagiri sits in a rain shadow — often clearer than Ooty during the monsoon."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {seasons.map((s) => (
            <div
              key={s.season}
              className={`rounded-2xl border p-5 ${
                s.status === "BEST_TIME"
                  ? "border-sun/40 bg-sun/10"
                  : "border-forest/5 bg-white"
              }`}
            >
              <h3 className="display font-semibold text-forest">{s.season}</h3>
              <p className="mt-1 text-sm font-medium text-leaf">{s.temperature}</p>
              <p className="mt-2 text-sm text-muted">{s.weather}</p>
              <p className="mt-2 text-xs text-muted">{s.tips}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="Getting here" title="How to reach Kotagiri" />
          <div className="mt-8 space-y-6">
            {transport.map((route) => (
              <div
                key={route.from}
                className="rounded-2xl border border-forest/5 bg-white p-6 shadow-sm"
              >
                <h3 className="display text-lg font-semibold text-forest">
                  {route.from} → {route.to}
                </h3>
                <p className="text-sm text-muted">
                  {route.distance} · {route.time}
                </p>
                <ul className="mt-4 space-y-2">
                  {route.modes.map((m) => (
                    <li key={m.type} className="text-sm">
                      <b className="text-forest">{m.type}</b> — {m.cost}
                      {m.notes ? ` · ${m.notes}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-forest to-pine p-8 text-center text-white">
          <h2 className="display text-2xl font-semibold">Ready to book a stay?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">
            Browse verified homestays and send a booking request directly to the host.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Btn href="/stays" variant="light">
              Browse stays
            </Btn>
            <Btn href="/explore" variant="outline" className="!border-white/40 !text-white">
              See places to visit
            </Btn>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
