"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Map,
  MessageCircle,
  Sparkles,
  Star,
  Target,
  BarChart3,
} from "lucide-react";
import {
  badgeStyles,
  businessCategories,
  gemCollections,
  planBaseKey,
  plans,
  pricingPlans,
  benefits,
} from "@/data/handoff";
import type { GemCollection } from "@/data/handoff/types";
import { gradients } from "@/lib/images";

const benefitIcons = {
  pin: Map,
  chat: MessageCircle,
  star: Star,
  badge: Sparkles,
  target: Target,
  chart: BarChart3,
};

export function GemCard({ gem }: { gem: GemCollection }) {
  const badge = badgeStyles[gem.badge] ?? badgeStyles["Local Pick"];
  return (
    <article className="gem-card-hover card-hover flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_1px_2px_rgba(18,40,60,0.05)]">
      <div
        className="relative h-[200px]"
        style={{ background: gradients[gem.gradient] }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,42,31,0.15)] via-[rgba(11,42,31,0.05)] from-0% via-35% to-[rgba(11,42,31,0.4)]" />
        <span
          className="absolute left-[15px] top-[15px] rounded-full px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em]"
          style={{ background: badge.bg, color: badge.fg }}
        >
          {gem.badge}
        </span>
        <span className="absolute bottom-[15px] right-[15px] font-mono text-xs font-medium text-white/92">
          {gem.count} spots
        </span>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-primary">
          {gem.title}
        </h3>
        <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-muted">
          {gem.story}
        </p>
        <div className="mt-[18px] flex items-center gap-2.5 border-t border-line pt-[15px]">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: gradients[gem.gradient] }}
          >
            {gem.initial}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink">
              Curated by {gem.curator}
            </div>
            <div className="text-xs text-muted">{gem.role}</div>
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-steel">
            Open
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function TripPlanner() {
  const [base, setBase] = useState("Kotagiri");
  const [days, setDays] = useState(2);
  const [traveller, setTraveller] = useState("Family");
  const [interests, setInterests] = useState<Record<string, boolean>>({
    Nature: true,
    Food: true,
  });
  const [budget, setBudget] = useState("Mid-range");
  const [generated, setGenerated] = useState(false);

  const bases = ["Kotagiri", "Ooty", "Coonoor", "Gudalur", "Masinagudi"];
  const travellers = ["Family", "Couple", "Friends", "Senior Citizens", "Solo"];
  const interestList = [
    "Nature",
    "Food",
    "Relaxation",
    "Adventure",
    "Workcation",
    "Photography",
  ];
  const budgets = ["Budget", "Mid-range", "Premium"];

  const key = planBaseKey[base] ?? "kotagiri";
  const src = plans[key];
  const plan = Array.from({ length: days }, (_, i) => {
    const d = src[i % src.length];
    return { day: i + 1, ...d };
  });
  const chosen = interestList.filter((i) => interests[i]);
  const summary = `${days} days · ${base} · ${traveller} · ${budget}${
    chosen.length ? ` · ${chosen.join(", ")}` : ""
  }`;

  return (
    <>
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-10">
        <div className="rounded-[22px] border border-line bg-surface p-[34px] shadow-[0_18px_50px_-34px_rgba(18,60,46,0.35)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[26px]">
            <Field label="Starting from">
              <div className="flex items-center gap-2 rounded-xl border border-grey px-3.5 py-2.5">
                <Building2 className="h-[17px] w-[17px] text-steel" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Your city — e.g. Bangalore, Coimbatore"
                  className="min-w-0 flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none"
                />
              </div>
            </Field>
            <Field label="Number of days">
              <div className="inline-flex overflow-hidden rounded-xl border border-grey">
                <button
                  type="button"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="flex h-[46px] w-[46px] items-center justify-center bg-surface text-xl text-primary hover:bg-canvas"
                >
                  −
                </button>
                <span className="min-w-16 border-x border-line py-3 text-center font-mono text-[17px] font-semibold text-primary">
                  {days}
                </span>
                <button
                  type="button"
                  onClick={() => setDays((d) => Math.min(5, d + 1))}
                  className="flex h-[46px] w-[46px] items-center justify-center bg-surface text-xl text-primary hover:bg-canvas"
                >
                  +
                </button>
              </div>
            </Field>
          </div>

          <SegField label="Destination base">
            {bases.map((b) => (
              <SegBtn key={b} active={base === b} onClick={() => setBase(b)}>
                {b}
              </SegBtn>
            ))}
          </SegField>

          <SegField label="Who's travelling">
            {travellers.map((t) => (
              <SegBtn key={t} active={traveller === t} onClick={() => setTraveller(t)}>
                {t}
              </SegBtn>
            ))}
          </SegField>

          <SegField label="Interests · pick a few">
            {interestList.map((i) => (
              <SegBtn
                key={i}
                active={!!interests[i]}
                onClick={() =>
                  setInterests((prev) => {
                    const n = { ...prev };
                    if (n[i]) delete n[i];
                    else n[i] = true;
                    return n;
                  })
                }
              >
                {i}
              </SegBtn>
            ))}
          </SegField>

          <SegField label="Budget">
            {budgets.map((b) => (
              <SegBtn key={b} active={budget === b} onClick={() => setBudget(b)}>
                {b}
              </SegBtn>
            ))}
          </SegField>

          <button
            type="button"
            onClick={() => setGenerated(true)}
            className="tap mt-[30px] flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-accent py-4 text-base font-bold text-[#2A2010] hover:bg-accent-hover"
          >
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.9} />
            Generate My Plan
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-6 pb-20 pt-5">
        {generated ? (
          <>
            <div className="mb-5 mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-[26px] font-bold tracking-[-0.02em] text-primary">
                Your {days}-day plan
              </h2>
              <span className="font-mono text-[12.5px] text-muted">{summary}</span>
            </div>
            <div className="flex flex-col gap-[18px]">
              {plan.map((d) => (
                <div
                  key={d.day}
                  className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(18,40,60,0.05)]"
                >
                  <div className="mb-[18px] flex items-center gap-3">
                    <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary font-mono text-[15px] font-semibold text-canvas">
                      D{d.day}
                    </span>
                    <div>
                      <div className="text-[17px] font-semibold tracking-[-0.01em] text-primary">
                        {d.title}
                      </div>
                      <div className="text-[12.5px] text-muted">Day {d.day}</div>
                    </div>
                  </div>
                  <div className="pl-1.5">
                    {d.stops.map((s, i) => (
                      <div
                        key={i}
                        className="relative ml-1 border-l-[1.5px] border-line pb-[18px] pl-6 last:pb-0"
                      >
                        <span className="absolute -left-[7px] top-[3px] h-3 w-3 rounded-full border-[3px] border-steel bg-surface" />
                        <span className="mb-0.5 block font-mono text-xs font-semibold text-steel">
                          {s.time}
                        </span>
                        <div className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                          {s.title}
                        </div>
                        <div className="mt-0.5 text-[13px] text-muted">{s.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/stay"
                className="tap inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-canvas hover:bg-primary-mid"
              >
                Add stays to this plan
                <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2} />
              </Link>
              <button
                type="button"
                className="tap inline-flex items-center gap-2 rounded-full border border-grey bg-surface px-5 py-3 text-sm font-semibold text-primary hover:border-steel"
              >
                Share plan
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-[18px] border border-dashed border-grey bg-surface px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-canvas">
              <Map className="h-[26px] w-[26px] text-steel" strokeWidth={1.6} />
            </div>
            <div className="text-[17px] font-semibold text-primary">
              Your itinerary will appear here
            </div>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm text-muted">
              Set your base, days and interests above, then hit Generate My Plan for
              a day-by-day preview.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export function BusinessPageContent() {
  const [category, setCategory] = useState("Homestay");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="hero-radial relative overflow-hidden text-white">
        <div
          aria-hidden
          className="absolute -left-[25%] -right-[25%] bottom-[-150px] h-[320px] rounded-t-[50%] bg-primary-dark"
        />
        <div className="relative mx-auto max-w-[1240px] px-6 pb-[72px] pt-[60px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            For homestays, cafés, taxis & shops
          </span>
          <h1 className="mt-3.5 max-w-[20ch] text-[46px] font-bold leading-[1.06] tracking-[-0.03em]">
            Grow Your Local Business with HelloKotagiri
          </h1>
          <p className="mt-4 max-w-[60ch] text-[17.5px] leading-relaxed text-white/80">
            Reach travellers actively looking for trusted stays, restaurants,
            cafés, taxis, local stores and experiences across the Nilgiris — found
            by location, not by ad budget.
          </p>
          <div className="mt-[26px] flex flex-wrap gap-7">
            {[
              { v: "0%", l: "Booking commission" },
              { v: "5", l: "Towns live" },
              { v: "WhatsApp", l: "Direct leads" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-mono text-[26px] font-semibold">{s.v}</div>
                <div className="text-[13px] text-white/65">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1240px] px-6 pb-2 pt-14">
        <div className="mb-[34px] text-center">
          <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
            Simple plans
          </span>
          <h2 className="text-[30px] font-bold tracking-[-0.025em] text-primary">
            Start free. Upgrade when it pays off.
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
          {pricingPlans.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-[20px] p-[28px_26px] ${
                p.popular
                  ? "border-2 border-primary shadow-[0_22px_50px_-28px_rgba(18,40,60,0.45)]"
                  : "border border-line shadow-[0_1px_2px_rgba(18,40,60,0.05)]"
              } bg-surface`}
            >
              {p.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#2A2010]">
                  MOST POPULAR
                </span>
              ) : null}
              <div className="text-[15px] font-semibold text-primary">{p.name}</div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="font-mono text-[34px] font-semibold text-primary">
                  {p.price}
                </span>
                <span className="text-[13px] text-muted">{p.per}</span>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-snug text-muted">{p.tagline}</p>
              <ul className="mt-[18px] flex flex-1 flex-col gap-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-steel" strokeWidth={2.2} />
                    <span className="text-[13.5px] leading-snug text-ink">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#enquiry"
                className={`mt-[22px] flex items-center justify-center rounded-xl py-3 text-[14.5px] font-semibold ${
                  p.variant === "primary"
                    ? "bg-primary text-canvas hover:bg-primary-mid"
                    : p.variant === "gold"
                      ? "bg-accent text-[#2A2010] hover:bg-accent-hover"
                      : "border border-grey bg-surface text-primary hover:border-steel"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-2 pt-16">
        <h2 className="mb-7 text-center text-2xl font-bold tracking-[-0.02em] text-primary">
          Why list with us
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[18px]">
          {benefits.map((b) => {
            const Icon = benefitIcons[b.icon];
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-line bg-surface p-[22px]"
              >
                <div className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-line bg-canvas text-steel">
                  <Icon className="h-[21px] w-[21px]" strokeWidth={1.7} />
                </div>
                <div className="text-[15.5px] font-semibold text-primary">{b.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="enquiry" className="mx-auto max-w-[840px] px-6 pb-[88px] pt-16">
        <div className="rounded-[22px] border border-line bg-surface p-[34px] shadow-[0_18px_50px_-34px_rgba(18,60,46,0.35)]">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-[18px] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#DCF0E2]">
                <Check className="h-[30px] w-[30px] text-open" strokeWidth={2.2} />
              </div>
              <h2 className="text-2xl font-bold text-primary">Enquiry received</h2>
              <p className="mx-auto mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-muted">
                Thanks — our team will reach out on WhatsApp within two working days
                to set up your listing.
              </p>
              <Link
                href="/"
                className="tap mt-[22px] inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-canvas hover:bg-primary-mid"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
                Get listed
              </span>
              <h2 className="mb-[22px] text-[26px] font-bold tracking-[-0.02em] text-primary">
                Tell us about your business
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
                <FormInput label="Business name" placeholder="e.g. Mist Garden Homestay" />
                <FormInput label="Contact person" placeholder="Your name" />
              </div>
              <div className="mt-[18px]">
                <label className="mb-2 block text-[13px] font-semibold text-primary">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {businessCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-4 py-2.5 text-[13px] font-semibold transition ${
                        category === c
                          ? "border border-primary bg-primary text-canvas"
                          : "border border-grey bg-surface text-muted"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
                <FormInput label="Phone" type="tel" placeholder="+91" />
                <FormInput label="WhatsApp" type="tel" placeholder="+91" />
              </div>
              <div className="mt-[18px]">
                <FormInput label="Location" placeholder="Town / area — e.g. Kotagiri, Aravenu" />
              </div>
              <div className="mt-[18px]">
                <label className="mb-1.5 block text-[13px] font-semibold text-primary">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you offer and which plan you're interested in."
                  className="w-full resize-y rounded-[11px] border border-grey px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel"
                />
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="tap mt-6 w-full rounded-[13px] bg-primary py-4 text-[15.5px] font-bold text-canvas hover:bg-primary-mid"
              >
                Submit Enquiry
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                We onboard a handful of businesses each week to keep curation tight.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 text-[13px] font-semibold text-primary">{label}</div>
      {children}
    </div>
  );
}

function SegField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-[26px]">
      <div className="mb-2.5 text-[13px] font-semibold text-primary">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition ${
        active
          ? "border border-primary bg-primary text-canvas"
          : "border border-grey bg-surface text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function FormInput({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-primary">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-[11px] border border-grey px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel"
      />
    </div>
  );
}

export function GemsGrid() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-12">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
        {gemCollections.map((g) => (
          <GemCard key={g.id} gem={g} />
        ))}
      </div>
    </section>
  );
}
