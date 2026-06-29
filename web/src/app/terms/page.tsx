import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";

export const metadata: Metadata = {
  title: "Terms of Use — HelloKotagiri",
  description: "Terms for using HelloKotagiri discovery and booking services.",
};

export default function TermsPage() {
  return (
    <HKShell>
      <article className="mx-auto max-w-2xl px-6 py-12 pb-20">
        <h1 className="text-3xl font-bold text-primary">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            Listings are curated or owner-submitted. HelloKotagiri connects travellers with hosts
            and businesses; we are not the accommodation or food provider.
          </p>
          <p>
            Request-to-book stays require host approval. Prices and availability may change.
            Use Nilgiri roads responsibly and follow local estate and forest rules.
          </p>
        </div>
      </article>
    </HKShell>
  );
}
