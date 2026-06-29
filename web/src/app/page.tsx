import HKShell from "@/components/hk/Shell";
import {
  BusinessStrip,
  FeaturedGrid,
  HomeHero,
  ImageCarousel,
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
      <HomeHero />
      <LocationBanner />
      <ImageCarousel slides={carouselSlides} />
      <IntentGrid tiles={intentTiles} />
      <FeaturedGrid picks={featuredPicks} />
      <PlannerTeaser />
      <BusinessStrip />
    </HKShell>
  );
}
