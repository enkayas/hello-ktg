import type { Metadata } from "next";
import HardNavLink from "@/components/hk/HardNavLink";
import HKDetailShell from "@/components/hk/DetailShell";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found on HelloKotagiri.",
};

export default function NotFound() {
  return (
    <HKDetailShell>
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-mono text-sm font-semibold uppercase tracking-wide text-steel">404</p>
        <h1 className="mt-3 text-2xl font-bold text-primary">Page not found</h1>
        <p className="mt-2 text-muted">
          The link may be outdated, or the listing may have moved. Try exploring from home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <HardNavLink
            href="/"
            className="tap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Home
          </HardNavLink>
          <HardNavLink
            href="/near-me"
            className="tap rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Near me
          </HardNavLink>
        </div>
      </div>
    </HKDetailShell>
  );
}
