import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";

export const metadata: Metadata = {
  title: "Privacy Policy — HelloKotagiri",
  description: "How HelloKotagiri handles your data when you browse, save places, or enquire.",
};

export default function PrivacyPage() {
  return (
    <HKShell>
      <LegalLayout title="Privacy Policy">
        <p>
          HelloKotagiri (hellokotagiri.com) is operated by Silvertip Ventures. We collect only
          what is needed to run the site: enquiry details you submit, optional location when you
          use Near Me, and saved places stored in your browser.
        </p>
        <p>
          Bookings and owner accounts use Supabase authentication. We do not sell personal data.
          Contact enkayas@gmail.com for data requests.
        </p>
      </LegalLayout>
    </HKShell>
  );
}

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 pb-20 prose prose-sm">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">{children}</div>
    </article>
  );
}
