"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "./Button";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/stay", label: "Stay" },
  { href: "/eat", label: "Eat" },
  { href: "/things-to-do", label: "Things To Do" },
  { href: "/plan-my-trip", label: "Plan My Trip" },
  { href: "/near-me", label: "Near Me" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cloud/80 bg-mist/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-serif text-xl font-semibold text-primary">
          Hello<span className="text-tea">Kotagiri</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-charcoal/80 transition hover:bg-cloud hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <Button href="/list-your-business" variant="gold" className="ml-2 !py-2 !text-xs">
            List Your Business
          </Button>
        </nav>

        <button
          type="button"
          className="tap flex h-11 w-11 items-center justify-center rounded-full border border-cloud bg-white lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <nav className="border-t border-cloud bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="tap rounded-xl px-4 py-3 text-sm font-medium text-charcoal hover:bg-mist"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/list-your-business"
              className="tap mt-2 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-primary"
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
