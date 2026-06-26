import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/owner/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/owner" className="font-serif text-lg font-bold text-forest">
            Host <span className="text-leaf">dashboard</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/owner" className="font-medium text-ink hover:text-leaf">
              Properties
            </Link>
            <Link
              href="/owner/bookings"
              className="font-medium text-ink hover:text-leaf"
            >
              Bookings
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
