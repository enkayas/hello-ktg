import HKShell from "@/components/hk/Shell";
import {
  FeaturedGrid,
  HeroCarousel,
  IntentGrid,
  LocationBanner,
  PlannerTeaser,
} from "@/components/hk/HomeSections";
import {
  carouselSlides,
  featuredPicks,
  intentTiles,
} from "@/data/handoff";

export default function HomePage() {
  return (
    <HKShell>
      <HeroCarousel slides={carouselSlides} />
      <LocationBanner />
      <IntentGrid tiles={intentTiles} />
      <FeaturedGrid picks={featuredPicks} />
      <PlannerTeaser />
    </HKShell>
  );
}
