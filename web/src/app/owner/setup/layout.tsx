import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSiteAssets } from "@/lib/queries/brand";
import { getOwnerOnboardingStatus } from "@/lib/owner-onboarding";
import ConsoleHeader from "@/components/console/ConsoleHeader";

export default async function OwnerSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/owner/login?next=/owner/setup");

  const status = await getOwnerOnboardingStatus();
  if (status.complete) redirect("/owner");

  const assets = await getSiteAssets();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsoleHeader variant="owner" assets={assets} minimal />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">{children}</main>
      <footer className="border-t border-line bg-white py-4 text-center text-xs text-muted">
        <Link href="https://hellokotagiri.com" className="text-steel hover:text-primary">
          ← Back to hellokotagiri.com
        </Link>
      </footer>
    </div>
  );
}
