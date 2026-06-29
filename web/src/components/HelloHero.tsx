"use client";

import Link from "next/link";
import { Btn } from "@/components/ui";

const PEAK =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Kodanad.jpg?width=1600";

export default function HelloHero() {
  return (
    <header className="relative flex min-h-screen items-end justify-center overflow-hidden bg-gradient-to-b from-[#1f3a5c] via-[#2e5a86] to-[#a9c9e2] text-center text-white">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(280px 120px at 14% 60%,rgba(255,255,255,.5),transparent 70%),radial-gradient(360px 150px at 88% 52%,rgba(255,255,255,.45),transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2] bg-cover bg-[center_62%] no-repeat"
        style={{
          backgroundImage: `url('${PEAK}')`,
          WebkitMaskImage:
            "linear-gradient(to bottom,transparent 0%,transparent 28%,#000 58%)",
          maskImage:
            "linear-gradient(to bottom,transparent 0%,transparent 28%,#000 58%)",
        }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-[19%] z-[3] whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[clamp(40px,11vw,150px)] font-extrabold leading-[0.9] tracking-tight text-white/15">
        <span className="font-[family-name:var(--font-script)] text-gold-soft/50">
          hello
        </span>
        Kotagiri
      </div>
      <svg
        className="absolute bottom-0 left-0 z-[5] block w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 70 L240 40 L480 65 L720 30 L960 65 L1200 35 L1440 60 L1440 120 L0 120 Z"
          fill="#fbfcfe"
        />
      </svg>
      <div className="relative z-[4] max-w-3xl px-5 pb-32 pt-24">
        <span className="eyebrow eyebrow-light">THE NILGIRIS · TAMIL NADU · 1,793 M</span>
        <h1 className="display mt-4 text-4xl font-bold leading-tight md:text-5xl">
          The quiet side of the{" "}
          <em className="text-gold-soft not-italic">Blue Mountains</em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/90 md:text-lg">
          Kotagiri is the oldest hill station in the Nilgiris — older than Ooty,
          calmer than Coonoor. Tea estates, shola forests, waterfalls and homestays
          run by people who grew up here.
        </p>
        <div className="mx-auto mt-8 flex max-w-lg rounded-full border border-white/60 bg-white/95 p-1.5 shadow-xl">
          <input
            type="search"
            placeholder="Search stays, waterfalls, treks…"
            className="min-w-0 flex-1 rounded-full border-none bg-transparent px-5 py-3 text-sm text-ink outline-none"
            readOnly
            onFocus={(e) => e.currentTarget.blur()}
          />
          <Btn href="/stay" className="!px-5 !py-2.5">
            Explore
          </Btn>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { href: "/explore/kodanad", label: "⛰️ Kodanad Viewpoint" },
            { href: "/explore/catherine", label: "💧 Catherine Falls" },
            { href: "/explore/longwood", label: "🌿 Longwood Shola" },
            { href: "/stay", label: "🏡 Homestays" },
          ].map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-semibold text-forest no-underline backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
