"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, MessageCircle, Navigation } from "lucide-react";
import { CardImage, TagChip } from "./PageHero";
import { diffStyles } from "@/data/handoff";
import type { EatItem, NearItem, StayItem, ThingItem } from "@/data/handoff/types";

/* ── Stay card ── */
export function StayCard({ item }: { item: StayItem }) {
  const href = item.slug ? `/stays/${item.slug}` : "/stay";
  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]">
      <CardImage image={item.image} gradient={item.gradient}>
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 font-mono text-[13px] font-semibold text-primary shadow-[0_2px_8px_-2px_rgba(29,58,88,0.15)]">
          {item.price}
        </span>
      </CardImage>
      <div className="flex flex-1 flex-col p-4 pb-[18px]">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-primary">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-steel" strokeWidth={1.9} />
          {item.where} · <span className="font-mono">{item.dist}</span> · Best for{" "}
          <span className="font-medium text-steel">{item.bestFor}</span>
        </p>
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
          {item.amenities.map((a) => (
            <TagChip key={a}>{a}</TagChip>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {item.whatsapp ? (
            <a
              href={`https://wa.me/${item.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap inline-flex shrink-0 items-center gap-1.5 rounded-[11px] bg-whatsapp px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#188c4d]"
            >
              <MessageCircle className="h-[15px] w-[15px]" strokeWidth={1.9} />
              WhatsApp
            </a>
          ) : null}
          <Link
            href={href}
            className="tap flex flex-1 items-center justify-center rounded-xl border border-line bg-white py-2.5 text-[13.5px] font-semibold text-primary shadow-sm transition hover:border-steel hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Eat card ── */
export function EatCard({ item }: { item: EatItem }) {
  const color = item.open ? "#128A4F" : "#C9610B";
  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]">
      <CardImage image={item.image} gradient={item.gradient} height="h-40">
        <span
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold backdrop-blur-sm"
          style={{ color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          {item.status}
        </span>
      </CardImage>
      <div className="flex flex-1 flex-col p-4 pb-[18px]">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-primary">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
          <MapPin className="h-3.5 w-3.5 text-steel" strokeWidth={1.9} />
          {item.where}
        </p>
        <p className="mt-2 text-[13.5px] leading-snug text-ink">
          Known for <span className="font-medium text-steel">{item.knownFor}</span>
        </p>
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
          {item.tags.map((t) => (
            <TagChip key={t}>{t}</TagChip>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="tap flex flex-1 rounded-[11px] border border-grey py-2.5 text-[13.5px] font-semibold text-primary hover:border-steel"
          >
            View Menu
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(item.name + " Kotagiri")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center gap-1.5 rounded-[11px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-canvas hover:bg-primary-mid"
          >
            <Navigation className="h-3.5 w-3.5" strokeWidth={1.9} />
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Near Me card ── */
export function NearCard({ item }: { item: NearItem }) {
  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]">
      <CardImage image={item.image} gradient={item.gradient} height="h-40">
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-sm">
          {item.category}
        </span>
        {item.open ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-open backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-open" />
            Open now
          </span>
        ) : null}
      </CardImage>
      <div className="flex flex-1 flex-col p-4 pb-[18px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16.5px] font-semibold tracking-[-0.01em] text-primary">
            {item.name}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[12.5px] font-semibold text-steel">
            <MapPin className="h-3 w-3" strokeWidth={2.1} />
            {item.dist}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          Best for <span className="font-medium text-steel">{item.bestFor}</span>
        </p>
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
          {item.tags.map((t) => (
            <TagChip key={t}>{t}</TagChip>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="tap flex flex-1 rounded-[11px] border border-grey py-2.5 text-[13.5px] font-semibold text-primary hover:border-steel"
          >
            View Details
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(item.name + " Kotagiri")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center gap-1.5 rounded-[11px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-canvas hover:bg-primary-mid"
          >
            <Navigation className="h-3.5 w-3.5" strokeWidth={1.9} />
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Things To Do card ── */
export function ThingCard({ item }: { item: ThingItem }) {
  const diff = diffStyles[item.difficulty];
  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]">
      <CardImage image={item.image} gradient={item.gradient} height="h-[166px]">
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-sm">
          {item.type}
        </span>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-[rgba(11,42,31,0.55)] px-2.5 py-1 font-mono text-[11.5px] text-white backdrop-blur-sm">
          <MapPin className="h-[11px] w-[11px]" strokeWidth={2.2} />
          {item.dist}
        </span>
      </CardImage>
      <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-4">
        <h3 className="text-[17.5px] font-semibold tracking-[-0.015em] text-primary">
          {item.name}
        </h3>
        <div className="mt-3 flex flex-1 flex-col gap-2.5">
          <DetailRow label="Best time" value={item.bestTime} />
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] text-muted">Difficulty</span>
            <span
              className="ml-auto rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold"
              style={{ background: diff.bg, color: diff.fg }}
            >
              {item.difficulty}
            </span>
          </div>
          <DetailRow label="Suits" value={item.suits} />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="tap flex flex-1 rounded-[11px] border border-grey py-2.5 text-[13.5px] font-semibold text-primary hover:border-steel"
          >
            View Details
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(item.name + " Kotagiri Nilgiris")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center gap-1.5 rounded-[11px] bg-primary px-4 py-2.5 text-[13.5px] font-semibold text-canvas hover:bg-primary-mid"
          >
            <Navigation className="h-3.5 w-3.5" strokeWidth={1.9} />
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13.5px] text-muted">{label}</span>
      <span className="ml-auto text-[13.5px] font-medium text-ink">{value}</span>
    </div>
  );
}
