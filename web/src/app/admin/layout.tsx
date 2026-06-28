import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/owner/login");
  if (profile.role !== "admin") redirect("/owner");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-forest/10 bg-forest text-cream">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/admin" className="font-serif text-lg font-bold">
            Admin <span className="text-tea">console</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="font-medium hover:text-tea">
              Listings
            </Link>
            <Link href="/admin/leads" className="font-medium hover:text-tea">
              Leads
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
