import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { Btn, PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sholas & Birding",
  description:
    "Longwood Shola, the shola-grassland mosaic, and Western Ghats endemic birds in Kotagiri.",
};

const ENDEMICS = [
  "Nilgiri Laughingthrush",
  "Nilgiri Blue Robin",
  "Nilgiri Wood Pigeon",
  "Black-and-orange Flycatcher",
  "Nilgiri Pipit",
  "White-bellied Shortwing",
  "Malabar Whistling Thrush",
  "Crimson-backed Sunbird",
  "Grey-headed Bulbul",
  "Indian Scimitar Babbler",
];

export default function NatureBirdingPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <PageHero
        eyebrow="Forests & wild birds"
        title="Sholas & Birding"
        lede="Understand the shola–grassland mosaic and find Western Ghats endemics in Kotagiri's surviving rainforest pockets."
        image="https://commons.wikimedia.org/wiki/Special:FilePath/Shola_forest_and_grassland.jpg?width=1600"
        breadcrumb={[{ label: "Home", href: "/" }]}
      />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            className="aspect-[4/3] rounded-2xl bg-cover bg-center shadow-lg"
            style={{
              backgroundImage:
                "url('https://commons.wikimedia.org/wiki/Special:FilePath/Shola.jpg?width=1100')",
            }}
          />
          <div>
            <SectionHeader
              eyebrow="Longwood Shola"
              title="A rare surviving shola rainforest"
              lede="116 hectares of Ramsar wetland and shola forest with an official guided trail — home to over 100 bird species."
            />
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { n: "100+", l: "bird species" },
                { n: "116 ha", l: "shola forest" },
                { n: "₹50", l: "entry fee" },
              ].map((f) => (
                <div
                  key={f.l}
                  className="rounded-xl border border-forest/5 bg-white p-3 text-center"
                >
                  <b className="display block text-xl text-forest">{f.n}</b>
                  <span className="text-xs text-muted">{f.l}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Btn href="/explore/longwood">Longwood Shola details →</Btn>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader
            eyebrow="Checklist"
            title="Western Ghats endemics to look for"
            lede="10 of the 16 Nilgiri endemics can be found around Kotagiri with an early-morning walk and a good guide."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {ENDEMICS.map((bird) => (
              <span
                key={bird}
                className="rounded-full border border-forest/10 bg-white px-4 py-2 text-sm font-semibold text-forest"
              >
                {bird}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-forest/5 bg-white p-6 shadow-sm">
            <h4 className="display font-semibold text-forest">Best for birding</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>• Longwood Shola — 6–8 am, guided walk recommended</li>
              <li>• Tea estate edges at dawn — pipits and bushchats</li>
              <li>• Nov–Feb peak season for migrants and clear skies</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-forest/5 bg-white p-6 shadow-sm">
            <h4 className="display font-semibold text-forest">Book a naturalist</h4>
            <p className="mt-2 text-sm text-muted">
              Shola Birding Walk from ₹600/person — binoculars, guide and tea included.
            </p>
            <div className="mt-4">
              <Btn href="/things-to-do/birding">Book birding walk →</Btn>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
