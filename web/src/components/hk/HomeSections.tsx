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
import { useTranslations } from "@/components/LocaleProvider";

const intentIcons = {
  family: Users,
  couple: Heart,
  food: UtensilsCrossed,
  gem: Gem,
  work: Laptop,
  weekend: Calendar,
};

export function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const t = useTranslations();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (next: number) => setIdx((next + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      6000,
    );
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const slide = slides[idx];

  return (
    <section
      className="relative min-h-[clamp(560px,82vh,760px)] bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backgrounds — overflow hidden only here (ken burns), not the whole hero */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
              i === idx ? "hero-slide-active opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== idx}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
            />
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(11,28,45,0.55)] via-[rgba(11,28,45,0.25)] via-40% to-[rgba(11,28,45,0.92)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(221,162,60,0.12),transparent_65%)]"
        />
      </div>

      {/* Hero copy */}
      <div className="absolute inset-x-0 top-0 z-2 flex flex-col items-center px-6 pb-48 pt-[4.5rem] text-center md:pb-56">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-[#C3D4E2] backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-hk-pulse rounded-full bg-[#DDA23C]" />
          {t.home.regionPill}
        </span>
        <h1 className="mx-auto max-w-[18ch] text-[clamp(34px,6.5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em] text-white drop-shadow-lg">
          {t.home.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[56ch] text-base leading-relaxed text-white/85 md:text-lg">
          {t.home.subtitle}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/plan-my-trip"
            className="tap inline-flex items-center gap-2 rounded-full bg-[#DDA23C] px-6 py-3.5 text-[15px] font-semibold text-[#2A2010] no-underline shadow-[0_8px_28px_-8px_rgba(221,162,60,0.7)] transition hover:bg-[#E7B255]"
          >
            <Map className="h-4 w-4" strokeWidth={1.9} />
            {t.home.planTrip}
          </Link>
          <Link
            href="/near-me"
            className="tap inline-flex items-center gap-2 rounded-full bg-[#DDA23C] px-6 py-3.5 text-[15px] font-semibold text-[#2A2010] no-underline shadow-[0_8px_28px_-8px_rgba(221,162,60,0.7)] transition hover:bg-[#E7B255]"
          >
            <Crosshair className="h-4 w-4" strokeWidth={1.9} />
            {t.home.exploreNearMe}
          </Link>
        </div>
      </div>

      {/* Bottom dock — destination picker strip (Pinterest-style countries carousel) */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[rgba(11,28,45,0.97)] via-[rgba(11,28,45,0.85)] to-transparent pt-16 pb-5 md:pt-20 md:pb-6">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#DDA23C]">
                {t.home.firstLook}
              </p>
              <h2
                key={slide.id}
                className="mt-1 text-xl font-bold tracking-[-0.02em] text-white md:text-2xl"
              >
                {slide.title}
              </h2>
              <p className="mt-1 hidden max-w-md text-sm text-white/65 md:block">
                {slide.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm text-white/50">
                <span className="text-2xl font-semibold text-white">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="mx-1">/</span>
                {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  aria-label={t.home.prev}
                  onClick={() => go(idx - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  aria-label={t.home.next}
                  onClick={() => go(idx + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>

          <div className="hero-thumb-scroll flex items-stretch gap-2.5 overflow-x-auto px-1 pt-4 pb-2 md:gap-3">
            {slides.map((s, i) => {
              const active = i === idx;
              return (
                <div
                  key={s.id}
                  className={`shrink-0 rounded-[14px] p-[2px] transition-all duration-500 md:rounded-2xl ${
                    active ? "bg-[#DDA23C]" : "bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`View ${s.title}`}
                    aria-current={active ? "true" : undefined}
                    className={`group relative block overflow-hidden rounded-xl transition-all duration-500 ease-out md:rounded-[14px] ${
                      active
                        ? "w-[126px] md:w-[164px]"
                        : "w-[84px] opacity-75 hover:opacity-100 md:w-[104px]"
                    }`}
                  >
                    <div
                      className="relative aspect-[4/3] w-full"
                      style={{ background: gradients[s.gradient] }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    <div
                      className={`absolute inset-0 transition-colors ${
                        active
                          ? "bg-gradient-to-t from-[rgba(11,28,45,0.85)] via-transparent to-transparent"
                          : "bg-gradient-to-t from-[rgba(11,28,45,0.75)] to-[rgba(11,28,45,0.2)]"
                      }`}
                    />
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <p className="truncate font-mono text-[9px] uppercase tracking-wide text-[#DDA23C] md:text-[10px]">
                        {s.eyebrow.split("·")[0]?.trim()}
                      </p>
                      <p
                        className={`truncate font-semibold text-white ${active ? "text-xs md:text-sm" : "text-[10px] md:text-xs"}`}
                      >
                        {s.title}
                      </p>
                    </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#DDA23C] transition-all duration-500 ease-out"
              style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImageCarousel({ slides }: { slides: CarouselSlide[] }) {
  return <HeroCarousel slides={slides} />;
}

export function LocationBanner() {
  const t = useTranslations();
  return (
    <section className="relative z-10 mx-auto max-w-[1240px] px-6 pb-4 pt-0">
      <div className="flex flex-col items-stretch gap-6 rounded-2xl border border-line bg-white p-7 shadow-[0_8px_40px_-12px_rgba(29,58,88,0.12)] md:flex-row md:items-center md:gap-8 md:p-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas-subtle shadow-sm">
          <Crosshair className="h-[26px] w-[26px] text-steel" strokeWidth={1.7} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-primary">
            {t.home.locationTitle}
          </h3>
          <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-normal text-muted">
            {t.home.locationBody}
          </p>
        </div>
        <Link
          href="/near-me"
          className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-[#DDA23C] px-5 py-3.5 text-sm font-semibold text-[#2A2010] no-underline shadow-[0_4px_14px_-4px_rgba(221,162,60,0.5)] transition hover:bg-[#E7B255]"
        >
          <Crosshair className="h-4 w-4 text-[#2A2010]" strokeWidth={1.9} />
          {t.home.enableLocation}
        </Link>
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
              className="card-hover relative block min-h-[168px] overflow-hidden rounded-2xl border border-line shadow-[0_8px_32px_-12px_rgba(29,58,88,0.18)]"
              style={{ background: gradients[it.gradient] }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(18,40,60,0.08)] to-[rgba(18,40,60,0.62)]" />
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
            className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]"
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
                    className="rounded-full border border-line bg-canvas-subtle px-2.5 py-1 text-[11.5px] font-medium text-muted shadow-sm"
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
      <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_48px_-16px_rgba(29,58,88,0.14)] md:flex-row">
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
        <div className="flex flex-[0.85] flex-col justify-center gap-4 bg-canvas-subtle p-10">
          {[
            "Choose a base — Kotagiri, Ooty or Coonoor",
            "Set your days, pace and interests",
            "Get a ready-to-go local itinerary",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-canvas-subtle font-mono text-sm font-semibold text-steel shadow-sm">
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
    <section className="border-y border-line bg-white">
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
        <a
          href="https://console.hellokotagiri.com/owner/login"
          className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-canvas hover:bg-primary-mid"
        >
          Business Console
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}
