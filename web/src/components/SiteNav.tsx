"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = { variant?: "hero" | "solid" };

export default function SiteNav({ variant = "hero" }: Props) {
  const [scrolled, setScrolled] = useState(variant === "solid");

  useEffect(() => {
    if (variant === "solid") return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const solid = scrolled || variant === "solid";

  return (
    <nav
      className={`fixed left-1/2 z-50 w-[min(1180px,calc(100%-28px))] -translate-x-1/2 rounded-full border transition-all duration-300 ${
        solid
          ? "top-2 border-forest/10 bg-cream/95 shadow-lg shadow-forest/10 backdrop-blur-md"
          : "top-3.5 border-white/20 bg-[rgba(20,38,52,0.28)] backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2.5 pl-6">
        <Link
          href="/"
          className={`display text-xl font-bold no-underline transition-colors ${
            solid ? "text-forest" : "text-white"
          }`}
        >
          <span
            className={`font-[family-name:var(--font-script)] text-[27px] font-bold not-italic ${
              solid ? "text-leaf" : "text-[#f3d391]"
            }`}
          >
            hello
          </span>
          Kotagiri
        </Link>
        <div className="flex items-center gap-1">
          {[
            { href: "/explore", label: "Explore" },
            { href: "/hidden-gems", label: "Hidden Gems" },
            { href: "/nature-birding", label: "Sholas & Birding" },
            { href: "/stay", label: "Stay" },
            { href: "/eat", label: "Eat" },
            { href: "/plan-my-trip", label: "Plan My Trip" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`tap hidden rounded-full px-3.5 py-2 text-sm font-medium no-underline transition md:inline-flex ${
                solid
                  ? "text-ink hover:bg-leaf/10 hover:text-leaf"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/list-your-business"
            className={`tap ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold no-underline transition ${
              solid
                ? "bg-white text-forest shadow-md hover:text-pine"
                : "bg-white text-forest shadow-md hover:text-pine"
            }`}
          >
            List Your Business
          </Link>
        </div>
      </div>
    </nav>
  );
}
