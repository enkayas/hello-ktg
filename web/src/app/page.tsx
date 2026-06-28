import Link from "next/link";
import ActivityCard from "@/components/ActivityCard";
import AttractionCard from "@/components/AttractionCard";
import HelloHero from "@/components/HelloHero";
import RestaurantCard from "@/components/RestaurantCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import StayCard from "@/components/StayCard";
import { Btn, SectionHeader } from "@/components/ui";
import {
  getActivities,
  getExploreSpots,
  RESTAURANTS,
  STATS,
} from "@/lib/content";
import { getPublishedStays } from "@/lib/queries";

export const revalidate = 300;

export default async function Home() {
  const [stays, explore, activities] = await Promise.all([
    getPublishedStays(),
    Promise.resolve(getExploreSpots()),
    Promise.resolve(getActivities()),
  ]);
  const featuredStays = stays.slice(0, 3);
  const featuredExplore = explore.slice(0, 6);
  const featuredEat = RESTAURANTS.slice(0, 3);
  const featuredActivities = activities.slice(0, 4);

  return (
    <>
      <SiteNav variant="hero" />
      <HelloHero />

      {/* Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest to-pine py-10 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="relative">
              <b className="display block text-2xl font-bold text-sun md:text-3xl">
                {s.value}
              </b>
              <span className="mt-1 block text-xs opacity-80">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* Explore */}
        <section id="explore" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Explore"
              title="Places that make Kotagiri, Kotagiri"
              lede="Less commercial than Ooty, every spot here is a short, scenic drive from town — through tea gardens most of the way."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredExplore.map((spot) => (
                <AttractionCard key={spot.id} spot={spot} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Btn href="/explore" variant="outline">
                See all places →
              </Btn>
            </div>
          </div>
        </section>

        {/* Go deeper */}
        <section className="px-5 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Go deeper"
              title="For the curious traveller"
              lede="Beyond the headline sights — the quiet corners, the ancient forest, and the rare birds that make the Nilgiris special."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Link
                href="/hidden-kotagiri"
                className="group relative block min-h-[300px] overflow-hidden rounded-[22px] shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://commons.wikimedia.org/wiki/Special:FilePath/Rangasamy_Peak_seen_from_Kodanad.jpg?width=1100')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <span className="text-xs font-bold text-gold-soft">OFF THE BEATEN PATH</span>
                  <h3 className="display mt-2 text-2xl font-semibold">Hidden Kotagiri</h3>
                  <p className="mt-2 text-sm text-white/85">
                    Sacred peaks, quiet falls, echoing valleys and tea-estate walks most
                    visitors never find.
                  </p>
                </div>
              </Link>
              <Link
                href="/nature-birding"
                className="group relative block min-h-[300px] overflow-hidden rounded-[22px] shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://commons.wikimedia.org/wiki/Special:FilePath/Nilgiri_Flycatcher_by_N.A._Naseer.jpg?width=1100')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <span className="text-xs font-bold text-gold-soft">
                    FORESTS &amp; WILD BIRDS
                  </span>
                  <h3 className="display mt-2 text-2xl font-semibold">Sholas &amp; Birding</h3>
                  <p className="mt-2 text-sm text-white/85">
                    Understand the shola–grassland mosaic and find Western Ghats endemics.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stays */}
        <section id="stays" className="bg-mist/50 px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Stay"
              title="Homestays, cottages & outdoor stays"
              lede="Verified places to stay around Kotagiri — with direct host enquiries and live availability for owner-listed properties."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Btn href="/stays">See all {stays.length} stays</Btn>
            </div>
          </div>
        </section>

        {/* Eat */}
        <section id="eat" className="border-y border-forest/5 bg-mist px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Eat & drink"
              title="Culinary delights of Kotagiri"
              lede="From single-estate Nilgiri tea and hill-station cafés to crisp dosas and whimsical garden dining."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEat.map((r) => (
                <RestaurantCard key={r.id} r={r} />
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-forest/10 border-l-4 border-l-sun bg-white p-5 text-sm">
              <b className="text-forest">Taste the local flavour.</b> Kotagiri is Badaga
              country — ask your homestay host about home-cooked Badaga meals, and don&apos;t
              leave without trying single-estate Nilgiri tea.
            </div>
            <div className="mt-8 text-center">
              <Btn href="/eat">See all restaurants &amp; cafés →</Btn>
            </div>
          </div>
        </section>

        {/* Things to do */}
        <section id="todo" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Experience"
              title="Things to do, the local way"
              lede="Guided by people from Kotagiri — estate workers, naturalists and trail walkers who know these hills by name."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredActivities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Btn href="/things-to-do" variant="outline">
                All experiences →
              </Btn>
            </div>
          </div>
        </section>

        {/* Plan teaser */}
        <section id="plan" className="bg-gradient-to-b from-cream to-mist px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Plan"
              title="When to come & how to reach"
              lede="Kotagiri sits in a rain shadow behind the Doddabetta range — often clear even when Ooty is wrapped in monsoon cloud."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "✨", title: "Oct – Mar", body: "9–22°C. Crisp air, clear views. Best season." },
                { icon: "🌸", title: "Apr – Jun", body: "15–25°C. Pleasant escape from plains heat." },
                { icon: "🌦", title: "Jul – Sep", body: "Misty & green. Waterfalls at their best." },
                { icon: "🍃", title: "All year", body: "10–25°C. Never harsh." },
              ].map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-forest/5 bg-white p-5 shadow-sm"
                >
                  <div className="text-2xl">{s.icon}</div>
                  <h3 className="display mt-2 font-semibold text-forest">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Btn href="/plan">Full trip planner →</Btn>
            </div>
          </div>
        </section>

        {/* Owner CTA */}
        <section id="list" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 rounded-3xl bg-gradient-to-br from-forest to-pine p-8 text-white md:grid-cols-2 md:p-12">
              <div>
                <span className="eyebrow eyebrow-light">For property owners</span>
                <h2 className="display mt-3 text-3xl font-semibold">
                  Own a homestay in Kotagiri?
                </h2>
                <p className="mt-4 text-white/85">
                  Travellers planning a Nilgiris trip are searching for exactly what you
                  offer. Get found, take bookings, and manage everything from your phone.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/90">
                  <li>✓ Direct WhatsApp enquiries &amp; request-to-book</li>
                  <li>✓ Verified badge after our visit</li>
                  <li>✓ Owner dashboard — photos, pricing, availability</li>
                  <li>✓ Free basic listing · paid plans from ₹999/month</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="display text-xl font-semibold">List your property</h3>
                <p className="mt-2 text-sm text-white/80">
                  Submit your details — we respond within 48 hours.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn href="/list-your-property" variant="light">
                    Apply now
                  </Btn>
                  <Btn href="/owner/login" variant="outline" className="!border-white/40 !text-white hover:!bg-white hover:!text-forest">
                    Owner login
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
