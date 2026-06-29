import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { TripPlanner } from "@/components/hk/Features";

export default function PlanMyTripPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Trip planner"
        title="Plan My Trip"
        subtitle="Tell us how you travel and we'll sketch a day-by-day Nilgiris itinerary — yours to tweak."
        goldEyebrow
      />
      <TripPlanner />
    </HKShell>
  );
}
