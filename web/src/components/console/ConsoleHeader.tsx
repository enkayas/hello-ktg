"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/hk/BrandLogo";
import SignOutButton from "@/components/SignOutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/components/LocaleProvider";
import type { SiteAsset } from "@/lib/brand";

type ConsoleHeaderProps = {
  variant?: "owner" | "admin";
  assets: SiteAsset[];
  /** Setup / login — logo and sign out only */
  minimal?: boolean;
};

const logoClass =
  "!max-h-[52px] sm:!max-h-[60px] md:!max-h-[68px]";

export default function ConsoleHeader({
  variant = "owner",
  assets,
  minimal = false,
}: ConsoleHeaderProps) {
  const pathname = usePathname();
  const isAdmin = variant === "admin";
  const t = useTranslations();

  const ownerLinks = [
    {
      href: "/owner",
      label: t.nav.businesses,
      active:
        pathname === "/owner" || pathname.startsWith("/owner/properties"),
    },
    {
      href: "/owner/bookings",
      label: t.nav.bookings,
      active: pathname.startsWith("/owner/bookings"),
    },
  ];

  const adminLinks = [
    { href: "/admin", label: "Listings", active: pathname === "/admin" },
    {
      href: "/admin/leads",
      label: "Leads",
      active: pathname.startsWith("/admin/leads"),
    },
  ];

  const links = isAdmin ? adminLinks : ownerLinks;

  const linkBase = isAdmin
    ? "border-b-2 pb-[23px] pt-[25px] text-sm font-semibold tracking-[-0.01em] transition-colors duration-160"
    : "border-b-2 pb-[23px] pt-[25px] text-sm font-semibold tracking-[-0.01em] text-primary transition-colors duration-160";

  const linkActive = isAdmin
    ? "border-accent text-canvas"
    : "border-accent text-primary";
  const linkIdle = isAdmin
    ? "border-transparent text-canvas/85 hover:text-accent"
    : "border-transparent hover:opacity-80";

  return (
    <header
      className={
        isAdmin
          ? "sticky top-0 z-50 border-b border-primary-dark bg-primary text-canvas"
          : "sticky top-0 z-50 border-b border-line bg-white"
      }
    >
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-6 px-6">
        <BrandLogo
          assets={assets}
          background={isAdmin ? "dark" : "light"}
          href={isAdmin ? "/admin" : "/owner"}
          height={68}
          className={logoClass}
          priority
        />

        <div className="flex items-center gap-5 sm:gap-6">
          {!minimal ? (
            <nav className="flex items-center gap-5 sm:gap-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${linkBase} ${l.active ? linkActive : linkIdle}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <LanguageSwitcher />

          {!minimal && !isAdmin ? (
            <span className="hidden h-6 w-px bg-line sm:block" aria-hidden />
          ) : null}

          <SignOutButton
            className={
              isAdmin
                ? "text-sm font-semibold text-canvas/80 hover:text-accent"
                : "text-sm font-semibold text-primary hover:opacity-80"
            }
          />
        </div>
      </div>
    </header>
  );
}
