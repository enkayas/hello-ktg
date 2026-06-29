import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { TripPlanner } from "@/components/hk/Features";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";

export default async function PlanMyTripPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);

  return (
    <HKShell>
      <PageHero
        eyebrow={t.plan.eyebrow}
        title={t.plan.title}
        subtitle={t.plan.subtitle}
        goldEyebrow
      />
      <TripPlanner />
    </HKShell>
  );
}
