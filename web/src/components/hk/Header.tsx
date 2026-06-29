"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { GaurLogo } from "./Logo";
import type { NavKey } from "@/data/handoff/types";

const nav: { href: string; label: string; key: NavKey }[] = [
  { href: "/stay", label: "Stay", key: "stay" },
  { href: "/eat", label: "Eat", key: "eat" },
  { href: "/things-to-do", label: "Things To Do", key: "things" },
  { href: "/hidden-gems", label: "Hidden Gems", key: "gems" },
  { href: "/plan-my-trip", label: "Plan My Trip", key: "plan" },
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

export default function HKHeader() {
  const pathname = usePathname();
  const active = activeKey(pathname);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-60 border-b border-line bg-[rgba(243,246,248,0.86)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-5 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-primary">
            <GaurLogo />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-canvas bg-accent" />
          </span>
          <span className="text-[19px] tracking-[-0.025em] text-primary">
            <span className="font-medium text-accent">Hello</span>
            <span className="font-bold">Kotagiri</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-[26px] min-[880px]:flex">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`border-b-2 pb-6 pt-6 text-sm tracking-[-0.01em] transition-colors duration-160 ${
                active === l.key
                  ? "border-accent font-semibold text-primary"
                  : "border-transparent font-medium text-muted hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/near-me"
            className="tap inline-flex items-center gap-1.5 rounded-full border border-grey bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-primary transition hover:border-steel"
          >
            <MapPin className="h-[15px] w-[15px] text-steel" strokeWidth={1.9} />
            <span className="hidden sm:inline">Near Me</span>
          </Link>
          <Link
            href="/list-your-business"
            className="tap hidden rounded-full bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-canvas transition hover:bg-primary-mid sm:inline-flex"
          >
            List Your Business
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
        <nav className="border-t border-line bg-surface px-4 py-4 min-[880px]:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`tap rounded-xl px-4 py-3 text-sm font-medium ${
                  active === l.key ? "bg-canvas text-primary" : "text-ink"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/near-me"
              className="tap rounded-xl px-4 py-3 text-sm font-medium text-ink"
              onClick={() => setOpen(false)}
            >
              Near Me
            </Link>
            <Link
              href="/list-your-business"
              className="tap mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-canvas"
              onClick={() => setOpen(false)}
            >
              List Your Business
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
