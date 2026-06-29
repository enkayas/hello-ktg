import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import PageHero from "@/components/hk/PageHero";
import SavedPageContent from "@/components/SavedPageContent";

export const metadata: Metadata = {
  title: "Saved places — HelloKotagiri",
  description: "Your shortlist of stays, restaurants, and places in Kotagiri and the Nilgiris.",
};

export default function SavedPage() {
  return (
    <HKShell>
      <PageHero
        eyebrow="Your shortlist"
        title="Saved"
        subtitle="Stays, food, and hidden corners you've bookmarked."
      />
      <SavedPageContent />
    </HKShell>
  );
}
