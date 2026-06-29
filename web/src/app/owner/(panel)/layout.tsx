import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSiteAssets } from "@/lib/queries/brand";
import { getOwnerOnboardingStatus } from "@/lib/owner-onboarding";
import ConsoleHeader from "@/components/console/ConsoleHeader";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/owner/login");

  const onboarding = await getOwnerOnboardingStatus();
  if (!onboarding.complete) {
    redirect("/owner/setup");
  }

  const assets = await getSiteAssets();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsoleHeader variant="owner" assets={assets} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
