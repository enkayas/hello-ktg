"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Menu, X, BedDouble, UtensilsCrossed, Compass, Gem, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/components/LocaleProvider";
import type { NavKey } from "@/data/handoff/types";
import type { SiteAsset } from "@/lib/brand";

const nav: { href: string; labelKey: keyof ReturnType<typeof useTranslations>["nav"]; key: NavKey; icon: LucideIcon }[] = [
  { href: "/stay", labelKey: "stay", key: "stay", icon: BedDouble },
  { href: "/eat", labelKey: "eat", key: "eat", icon: UtensilsCrossed },
  { href: "/things-to-do", labelKey: "things", key: "things", icon: Compass },
  { href: "/hidden-gems", labelKey: "gems", key: "gems", icon: Gem },
  { href: "/plan-my-trip", labelKey: "plan", key: "plan", icon: Map },
];

function activeKey(pathname: string): NavKey {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/stay")) return "stay";
  if (pathname.startsWith("/eat")) return "eat";
  if (pathname.startsWith("/things-to-do")) return "things";
  if (pathname.startsWith("/hidden-gems")) return "gems";
  if (pathname.startsWith("/plan")) return "plan";
  if (pathname.startsWith("/near-me")) return "near";
  if (pathname.startsWith("/list-your")) return "list";
  return "home";
}

export default function HKHeader({ assets }: { assets: SiteAsset[] }) {
  const pathname = usePathname();
  const active = activeKey(pathname);
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-60 border-b border-line bg-white">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-4 px-6">
        <BrandLogo
          assets={assets}
          background="light"
          height={68}
          className="!max-h-[52px] sm:!max-h-[60px] md:!max-h-[68px]"
          priority
        />

        <nav className="hidden items-center gap-5 min-[880px]:flex xl:gap-[26px]">
          {nav.map((l) => {
            const Icon = l.icon;
            const isActive = active === l.key;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 border-b-2 pb-6 pt-6 text-sm font-semibold tracking-[-0.01em] text-primary transition-colors duration-160 ${
                  isActive ? "border-accent" : "border-transparent hover:opacity-80"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                {t.nav[l.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/near-me"
            className="tap inline-flex items-center gap-1.5 rounded-full border border-grey bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-primary transition hover:border-steel"
          >
            <MapPin className="h-[15px] w-[15px] text-steel" strokeWidth={1.9} />
            <span className="hidden sm:inline">{t.nav.nearMe}</span>
          </Link>
          <button
            type="button"
            className="tap flex h-10 w-10 items-center justify-center rounded-[10px] border border-grey bg-surface min-[880px]:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="h-5 w-5 text-primary" strokeWidth={1.9} />
            ) : (
              <Menu className="h-5 w-5 text-primary" strokeWidth={1.9} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line bg-white px-4 py-4 min-[880px]:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((l) => {
              const Icon = l.icon;
              const isActive = active === l.key;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`tap flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive ? "bg-canvas-subtle text-primary" : "text-primary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                  {t.nav[l.labelKey]}
                </Link>
              );
            })}
            <Link
              href="/near-me"
              className="tap rounded-xl px-4 py-3 text-sm font-medium text-ink"
              onClick={() => setOpen(false)}
            >
              {t.nav.nearMe}
            </Link>
            <div className="px-4 py-2 sm:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
