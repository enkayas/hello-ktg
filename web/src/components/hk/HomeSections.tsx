"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Crosshair,
  Gem,
  Heart,
  Map,
  Users,
  UtensilsCrossed,
  Laptop,
} from "lucide-react";
import type { CarouselSlide, FeaturedPick, IntentTile } from "@/data/handoff/types";
import { gradients } from "@/lib/images";
import { ChevronLeft, ChevronRight } from "lucide-react";

const intentIcons = {
  family: Users,
  couple: Heart,
  food: UtensilsCrossed,
  gem: Gem,
  work: Laptop,
  weekend: Calendar,
};

export function HomeHero() {
  return (
    <section className="home-hero-bg relative overflow-hidden">
      <div
        aria-hidden
        className="animate-hk-mist absolute inset-0 bg-[radial-gradient(50%_42%_at_72%_16%,rgba(221,162,60,0.16),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -left-[30%] -right-[30%] bottom-[-150px] h-[360px] rounded-t-[50%] bg-steel opacity-30 blur-[6px]"
      />
      <div
        aria-hidden
        className="absolute -left-[30%] -right-[30%] bottom-[-185px] h-[360px] rounded-t-[50%] bg-[color-mix(in_srgb,var(--primary),#000_14%)] opacity-60"
      />
      <div
        aria-hidden
        className="absolute -left-[30%] -right-[30%] bottom-[-215px] h-[360px] rounded-t-[50%] bg-[color-mix(in_srgb,var(--primary),#000_38%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-6 pb-[104px] pt-20 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-[#C3D4E2]">
          <span className="h-1.5 w-1.5 animate-hk-pulse rounded-full bg-accent" />
          Kotagiri · Ooty · Coonoor · Gudalur · Masinagudi
        </span>
        <h1 className="mx-auto max-w-[18ch] text-[clamp(38px,8vw,58px)] font-bold leading-[1.04] tracking-[-0.03em] text-[#FBFCFB]">
          Discover Nilgiris Like a Local
        </h1>
        <p className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed text-white/78">
          Smart stays, local food, scenic routes, hidden gems and nearby
          experiences across Kotagiri and the Nilgiris — curated by people who
          actually live in these hills.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/plan-my-trip"
            className="tap inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-[15px] font-semibold text-[#2A2010] shadow-[0_10px_30px_-12px_rgba(200,155,60,0.6)] hover:bg-accent-hover"
          >
            <Map className="h-4 w-4" strokeWidth={1.9} />
            Plan My Trip
          </Link>
          <Link
            href="/near-me"
            className="tap inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/7 px-6 py-4 text-[15px] font-semibold text-white hover:bg-white/14"
          >
            <Crosshair className="h-4 w-4" strokeWidth={1.9} />
            Explore Near Me
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LocationBanner() {
  return (
    <section className="mx-auto max-w-[1240px] px-6">
      <div className="relative z-2 -mt-[52px] flex flex-col items-stretch gap-6 rounded-[20px] border border-line bg-surface p-[26px] shadow-[0_24px_60px_-34px_rgba(18,60,46,0.4)] md:flex-row md:items-center md:gap-6 md:p-[26px_30px]">
        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas">
          <Crosshair className="h-[26px] w-[26px] text-steel" strokeWidth={1.7} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-primary">
            Discover what&apos;s around you
          </h3>
          <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-normal text-muted">
            Allow location to surface stays, food, viewpoints, cafés, fuel stops
            and local experiences near you — ranked by how far you&apos;d actually
            travel.
          </p>
        </div>
        <Link
          href="/near-me"
          className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-canvas hover:bg-primary-mid"
        >
          <Crosshair className="h-4 w-4" strokeWidth={1.9} />
          Enable Location
        </Link>
      </div>
    </section>
  );
}

export function ImageCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-2 pt-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
            Postcards from the hills
          </span>
          <h2 className="text-[32px] font-bold leading-tight tracking-[-0.025em] text-primary">
            A first look at Kotagiri
          </h2>
        </div>
      </div>
      <div className="relative h-[clamp(320px,46vw,500px)] overflow-hidden rounded-[22px] bg-primary shadow-[0_24px_60px_-34px_rgba(18,40,60,0.5)]">
        <div
          className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((s) => (
            <div
              key={s.id}
              className="relative min-w-full"
              style={{ background: gradients[s.gradient] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-[rgba(11,28,45,0.74)]" />
              <div className="pointer-events-none absolute bottom-[30px] left-[30px] right-[30px]">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                  {s.eyebrow}
                </span>
                <div className="mt-1.5 text-[27px] font-bold tracking-[-0.02em] text-white">
                  {s.title}
                </div>
                <p className="mt-1 max-w-[48ch] text-sm leading-normal text-white/84">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setIdx((i) => (i + slides.length - 1) % slides.length)}
          className="absolute left-4 top-1/2 z-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 shadow-md hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-primary" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIdx((i) => (i + 1) % slides.length)}
          className="absolute right-4 top-1/2 z-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 shadow-md hover:bg-white"
        >
          <ChevronRight className="h-5 w-5 text-primary" strokeWidth={2.2} />
        </button>
        <div className="absolute bottom-[18px] left-0 right-0 z-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className="h-[9px] rounded-full border-none p-0 transition-all duration-200"
              style={{
                width: i === idx ? 26 : 9,
                background: i === idx ? "var(--accent)" : "rgba(255,255,255,0.55)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function IntentGrid({ tiles }: { tiles: IntentTile[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-2 pt-[72px]">
      <div className="mx-auto mb-9 max-w-[60ch] text-center">
        <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
          Start with how you travel
        </span>
        <h2 className="text-[32px] font-bold leading-tight tracking-[-0.025em] text-primary">
          What brings you to the hills?
        </h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[18px]">
        {tiles.map((it) => {
          const Icon = intentIcons[it.icon];
          return (
            <Link
              key={it.id}
              href={it.href}
              className="card-hover relative block min-h-[168px] overflow-hidden rounded-[18px] shadow-[0_1px_2px_rgba(18,60,46,0.06)]"
              style={{ background: gradients[it.gradient] }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,42,31,0.05)] to-[rgba(11,42,31,0.55)]" />
              <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/16 text-white backdrop-blur-sm">
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-base font-semibold tracking-[-0.01em] text-white">
                  {it.label}
                </div>
                <div className="mt-0.5 text-[12.5px] text-white/78">{it.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function FeaturedGrid({ picks }: { picks: FeaturedPick[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-2 pt-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
            Hand-picked this week
          </span>
          <h2 className="text-[32px] font-bold leading-tight tracking-[-0.025em] text-primary">
            Featured local picks
          </h2>
        </div>
        <Link
          href="/things-to-do"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel"
        >
          See everything
          <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2} />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[22px]">
        {picks.map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className="card-hover flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_rgba(18,60,46,0.05)]"
          >
            <div
              className="relative h-[170px]"
              style={{ background: gradients[f.gradient] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt={f.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-[rgba(18,40,60,0.34)]" />
              <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary backdrop-blur-sm">
                {f.kind}
              </span>
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[rgba(11,42,31,0.55)] px-2 py-1 font-mono text-[11.5px] text-white backdrop-blur-sm">
                <Crosshair className="h-[11px] w-[11px]" strokeWidth={2.2} />
                {f.dist}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 pb-[18px]">
              <div className="text-[16.5px] font-semibold tracking-[-0.01em] text-primary">
                {f.name}
              </div>
              <div className="mt-1 text-[13px] text-muted">
                {f.where} ·{" "}
                <span className="font-medium text-steel">Best for {f.bestFor}</span>
              </div>
              <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                {f.tags.map((tg) => (
                  <span
                    key={tg}
                    className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-muted"
                  >
                    {tg}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-sm font-semibold text-primary">
                  {f.price}
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-steel">
                  View
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PlannerTeaser() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-[72px]">
      <div className="flex flex-col overflow-hidden rounded-3xl border border-line shadow-[0_24px_60px_-34px_rgba(18,60,46,0.45)] md:flex-row">
        <div className="flex-[1.15] bg-[radial-gradient(120%_130%_at_0%_0%,color-mix(in_srgb,var(--primary),#fff_16%)_0%,var(--primary)_55%,color-mix(in_srgb,var(--primary),#000_36%)_100%)] p-12 text-white">
          <span className="mb-3.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            Trip planner
          </span>
          <h2 className="max-w-[18ch] text-[32px] font-bold leading-tight tracking-[-0.025em] text-[#FBFCFB]">
            Tell us how you travel. We&apos;ll plan the days.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-white/76">
            Pick your base, your pace and what you love — get a day-by-day
            Nilgiris itinerary tuned to the weather and the season.
          </p>
          <Link
            href="/plan-my-trip"
            className="tap mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-[#2A2010] hover:bg-accent-hover"
          >
            Start planning
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
        <div className="flex flex-[0.85] flex-col justify-center gap-4 bg-surface p-10">
          {[
            "Choose a base — Kotagiri, Ooty or Coonoor",
            "Set your days, pace and interests",
            "Get a ready-to-go local itinerary",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3.5">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-line bg-canvas font-mono text-sm font-semibold text-steel">
                {i + 1}
              </span>
              <span className="text-[15px] text-ink">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BusinessStrip() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 px-6 py-[60px]">
        <div className="max-w-[46ch]">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            For locals
          </span>
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-primary">
            Run a homestay, café or taxi? Get found by the right travellers.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            List free, get WhatsApp leads, and show up by location — not by who
            paid the most.
          </p>
        </div>
        <Link
          href="/list-your-business"
          className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-canvas hover:bg-primary-mid"
        >
          List Your Business
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
