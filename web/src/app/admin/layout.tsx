import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getSiteAssets } from "@/lib/queries/brand";
import ConsoleHeader from "@/components/console/ConsoleHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/owner/login?next=/admin");
  if (profile.role !== "admin") {
    redirect("/owner/login?error=forbidden&next=/admin");
  }

  const assets = await getSiteAssets();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsoleHeader variant="admin" assets={assets} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
