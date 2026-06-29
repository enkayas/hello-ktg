import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import { EatGrid } from "@/components/hk/EatPage";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";

export default async function EatPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);

  return (
    <HKShell>
      <PageHero
        eyebrow={t.eat.eyebrow}
        title={t.eat.title}
        subtitle={t.eat.subtitle}
      />
      <EatGrid />
    </HKShell>
  );
}
