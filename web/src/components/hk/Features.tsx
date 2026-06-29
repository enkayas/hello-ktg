"use client";

import Link from "next/link";
import HardNavLink from "@/components/hk/HardNavLink";
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
  pricingPlans,
  benefits,
} from "@/data/handoff";
import type { GemCollection } from "@/data/handoff/types";
import { getAllHiddenGems } from "@/lib/listings/catalog";
import { gradients } from "@/lib/images";
import { useTranslations } from "@/components/LocaleProvider";

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
    <article className="gem-card-hover card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(29,58,88,0.1)]">
      <div
        className="relative h-[200px]"
        style={{ background: gradients[gem.gradient] }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(18,40,60,0.12)] via-[rgba(18,40,60,0.04)] from-0% via-35% to-[rgba(18,40,60,0.38)]" />
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
  const t = useTranslations();
  const [base, setBase] = useState("Kotagiri");
  const [days, setDays] = useState(2);
  const [traveller, setTraveller] = useState("Family");
  const [interests, setInterests] = useState<Record<string, boolean>>({
    Nature: true,
    Food: true,
  });
  const [budget, setBudget] = useState("Mid-range");
  const [weather, setWeather] = useState<"Sunny" | "Rainy" | "Misty">("Sunny");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<{
    base: string;
    summary: string;
    days: {
      day: number;
      title: string;
      stops: { time: string; title: string; note: string }[];
    }[];
    foodSuggestions: string[];
    staySuggestions: string[];
    gemSuggestions: string[];
    cautionNotes: string[];
    responsibleTravel: string[];
  } | null>(null);

  const bases = ["Kotagiri", "Ooty", "Coonoor", "Gudalur", "Masinagudi"];
  const travellers = [
    { id: "Family", label: t.plan.travellerFamily },
    { id: "Couple", label: t.plan.travellerCouple },
    { id: "Friends", label: t.plan.travellerFriends },
    { id: "Senior Citizens", label: t.plan.travellerSenior },
    { id: "Solo", label: t.plan.travellerSolo },
  ];
  const interestList = [
    { id: "Nature", label: t.plan.interestNature },
    { id: "Food", label: t.plan.interestFood },
    { id: "Relaxation", label: t.plan.interestRelaxation },
    { id: "Adventure", label: t.plan.interestAdventure },
    { id: "Workcation", label: t.plan.interestWorkcation },
    { id: "Photography", label: t.plan.interestPhotography },
  ];
  const budgets = [
    { id: "Budget", label: t.plan.budgetLow },
    { id: "Mid-range", label: t.plan.budgetMid },
    { id: "Premium", label: t.plan.budgetPremium },
  ];

  const interestIds = interestList.filter((i) => interests[i.id]).map((i) => i.id);
  const travellerLabel =
    travellers.find((x) => x.id === traveller)?.label ?? traveller;
  const budgetLabel = budgets.find((b) => b.id === budget)?.label ?? budget;
  const summary =
    planResult?.summary ??
    `${days} days · ${base} · ${travellerLabel} · ${budgetLabel}${
      interestIds.length ? ` · ${interestIds.join(", ")}` : ""
    }`;

  async function generatePlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseLocation: base,
          days,
          travellerType: traveller,
          interests: interestIds,
          budget,
          weather,
          timeOfDay: "Morning",
        }),
      });
      const data = await res.json();
      setPlanResult(data);
      setGenerated(true);
    } catch {
      setPlanResult(null);
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  }

  function shareWhatsApp() {
    if (!planResult) return;
    const lines = [
      `HelloKotagiri trip plan — ${planResult.summary}`,
      "",
      ...planResult.days.flatMap((d) => [
        `Day ${d.day}: ${d.title}`,
        ...d.stops.map((s) => `  ${s.time} ${s.title}`),
      ]),
      planResult.cautionNotes.length
        ? `\nCautions:\n${planResult.cautionNotes.map((c) => `• ${c}`).join("\n")}`
        : "",
    ];
    window.open(
      `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      <section className="mx-auto max-w-[1080px] px-6 pb-4 pt-10">
        <div className="rounded-[22px] border border-line bg-surface p-[34px] shadow-[0_18px_50px_-34px_rgba(18,60,46,0.35)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[26px]">
            <Field label={t.plan.startingFrom}>
              <div className="flex items-center gap-2 rounded-xl border border-grey px-3.5 py-2.5">
                <Building2 className="h-[17px] w-[17px] text-steel" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder={t.plan.cityPlaceholder}
                  className="min-w-0 flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none"
                />
              </div>
            </Field>
            <Field label={t.plan.numberOfDays}>
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

          <SegField label={t.plan.destinationBase}>
            {bases.map((b) => (
              <SegBtn key={b} active={base === b} onClick={() => setBase(b)}>
                {b}
              </SegBtn>
            ))}
          </SegField>

          <SegField label={t.plan.whosTravelling}>
            {travellers.map((tr) => (
              <SegBtn key={tr.id} active={traveller === tr.id} onClick={() => setTraveller(tr.id)}>
                {tr.label}
              </SegBtn>
            ))}
          </SegField>

          <SegField label={t.plan.interests}>
            {interestList.map((i) => (
              <SegBtn
                key={i.id}
                active={!!interests[i.id]}
                onClick={() =>
                  setInterests((prev) => {
                    const n = { ...prev };
                    if (n[i.id]) delete n[i.id];
                    else n[i.id] = true;
                    return n;
                  })
                }
              >
                {i.label}
              </SegBtn>
            ))}
          </SegField>

          <SegField label={t.plan.budget}>
            {budgets.map((b) => (
              <SegBtn key={b.id} active={budget === b.id} onClick={() => setBudget(b.id)}>
                {b.label}
              </SegBtn>
            ))}
          </SegField>

          <SegField label="Weather (mock)">
            {(["Sunny", "Rainy", "Misty"] as const).map((w) => (
              <SegBtn key={w} active={weather === w} onClick={() => setWeather(w)}>
                {w}
              </SegBtn>
            ))}
          </SegField>

          <button
            type="button"
            onClick={() => void generatePlan()}
            disabled={loading}
            className="tap mt-[30px] flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-accent py-4 text-base font-bold text-[#2A2010] hover:bg-accent-hover disabled:opacity-60"
          >
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.9} />
            {loading ? "Building your plan…" : t.plan.generate}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-6 pb-20 pt-5 print:px-0">
        {generated && planResult ? (
          <>
            <div className="mb-5 mt-4 flex flex-wrap items-center gap-3 print:mb-3">
              <h2 className="text-[26px] font-bold tracking-[-0.02em] text-primary">
                {t.plan.yourPlan} {days}
                {t.plan.dayPlan}
              </h2>
              <span className="font-mono text-[12.5px] text-muted">{summary}</span>
            </div>
            <div className="flex flex-col gap-[18px]">
              {planResult.days.map((d) => (
                <div
                  key={d.day}
                  className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(18,40,60,0.05)] print:break-inside-avoid"
                >
                  <div className="mb-[18px] flex items-center gap-3">
                    <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary font-mono text-[15px] font-semibold text-canvas">
                      D{d.day}
                    </span>
                    <div>
                      <div className="text-[17px] font-semibold tracking-[-0.01em] text-primary">
                        {d.title}
                      </div>
                      <div className="text-[12.5px] text-muted">
                        {t.plan.day} {d.day}
                      </div>
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

            {planResult.foodSuggestions.length > 0 ? (
              <SuggestionBlock title="Food picks" items={planResult.foodSuggestions} />
            ) : null}
            {planResult.staySuggestions.length > 0 ? (
              <SuggestionBlock title="Stay ideas" items={planResult.staySuggestions} />
            ) : null}
            {planResult.gemSuggestions.length > 0 ? (
              <SuggestionBlock title="Hidden gems" items={planResult.gemSuggestions} />
            ) : null}
            {planResult.cautionNotes.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-closed/30 bg-closed/5 p-5">
                <h3 className="text-sm font-semibold text-closed">Caution notes</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {planResult.cautionNotes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {planResult.responsibleTravel?.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-line bg-canvas-subtle p-5">
                <h3 className="text-sm font-semibold text-primary">Responsible travel</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {planResult.responsibleTravel.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <Link
                href="/stay"
                className="tap inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-canvas hover:bg-primary-mid"
              >
                {t.plan.addStays}
                <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={shareWhatsApp}
                className="tap inline-flex items-center gap-2 rounded-full border border-grey bg-surface px-5 py-3 text-sm font-semibold text-primary hover:border-steel"
              >
                {t.plan.sharePlan}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="tap inline-flex items-center gap-2 rounded-full border border-grey bg-surface px-5 py-3 text-sm font-semibold text-primary hover:border-steel"
              >
                Print plan
              </button>
            </div>
          </>
        ) : generated ? (
          <div className="mt-4 rounded-[18px] border border-closed/30 bg-closed/5 px-6 py-8 text-center">
            <p className="text-sm text-closed">Could not build plan — try again.</p>
          </div>
        ) : (
          <div className="mt-4 rounded-[18px] border border-dashed border-grey bg-surface px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-canvas">
              <Map className="h-[26px] w-[26px] text-steel" strokeWidth={1.6} />
            </div>
            <div className="text-[17px] font-semibold text-primary">
              {t.plan.emptyTitle}
            </div>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm text-muted">
              {t.plan.emptyBody}
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    location: "",
    address: "",
    mapsLink: "",
    message: "",
    priceRange: "Mid-range",
    plan: "Free",
    amenities: [] as string[],
  });

  const amenityOptions = [
    "Parking",
    "Wi-Fi",
    "Pet friendly",
    "Wheelchair access",
    "Veg kitchen",
    "Room service",
  ];

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required";
    if (!form.contactPerson.trim()) next.contactPerson = "Contact name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.location.trim()) next.location = "Location is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit() {
    if (!validate()) return;
    const payload = { ...form, category, submittedAt: new Date().toISOString() };
    const existing = JSON.parse(
      localStorage.getItem("hellokotagiri_business_enquiries") ?? "[]",
    ) as unknown[];
    localStorage.setItem(
      "hellokotagiri_business_enquiries",
      JSON.stringify([payload, ...existing].slice(0, 50)),
    );
    console.info("Business enquiry saved locally:", payload);
    setSubmitted(true);
  }

  return (
    <>
      <section className="page-hero-light">
        <div className="relative mx-auto max-w-[1240px] px-6 pb-12 pt-10 md:pb-14 md:pt-14">
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a6b1a]">
            For homestays, cafés, taxis & shops
          </span>
          <h1 className="mt-4 max-w-[20ch] text-[clamp(2rem,4.5vw,2.875rem)] font-bold leading-[1.06] tracking-[-0.03em] text-primary">
            Grow Your Local Business with HelloKotagiri
          </h1>
          <p className="mt-4 max-w-[60ch] text-[17.5px] leading-relaxed text-muted">
            Reach travellers actively looking for trusted stays, restaurants,
            cafés, taxis, local stores and experiences across the Nilgiris — found
            by location, not by ad budget.
          </p>
          <div className="mt-7 flex flex-wrap gap-6">
            {[
              { v: "0%", l: "Booking commission" },
              { v: "5", l: "Towns live" },
              { v: "WhatsApp", l: "Direct leads" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-line bg-white px-5 py-3 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
              >
                <div className="font-mono text-2xl font-semibold text-primary">{s.v}</div>
                <div className="text-[13px] text-muted">{s.l}</div>
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
              } bg-white`}
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
                <FormInput
                  label="Business name"
                  placeholder="e.g. Mist Garden Homestay"
                  value={form.businessName}
                  error={errors.businessName}
                  onChange={(v) => setForm((f) => ({ ...f, businessName: v }))}
                />
                <FormInput
                  label="Contact person"
                  placeholder="Your name"
                  value={form.contactPerson}
                  error={errors.contactPerson}
                  onChange={(v) => setForm((f) => ({ ...f, contactPerson: v }))}
                />
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
                <FormInput
                  label="Phone"
                  type="tel"
                  placeholder="+91"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
                <FormInput
                  label="WhatsApp"
                  type="tel"
                  placeholder="+91"
                  value={form.whatsapp}
                  onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
                />
              </div>
              <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
                <FormInput
                  label="Location"
                  placeholder="Town / area — e.g. Kotagiri, Aravenu"
                  value={form.location}
                  error={errors.location}
                  onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                />
                <FormInput
                  label="Full address"
                  placeholder="Street address"
                  value={form.address}
                  onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                />
              </div>
              <div className="mt-[18px]">
                <FormInput
                  label="Google Maps link"
                  placeholder="https://maps.google.com/..."
                  value={form.mapsLink}
                  onChange={(v) => setForm((f) => ({ ...f, mapsLink: v }))}
                />
              </div>
              <div className="mt-[18px]">
                <label className="mb-2 block text-[13px] font-semibold text-primary">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
                        form.amenities.includes(a)
                          ? "border border-primary bg-primary text-canvas"
                          : "border border-grey bg-surface text-muted"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-primary">
                    Price range
                  </label>
                  <select
                    value={form.priceRange}
                    onChange={(e) => setForm((f) => ({ ...f, priceRange: e.target.value }))}
                    className="w-full rounded-[11px] border border-grey px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel"
                  >
                    {["Budget", "Mid-range", "Premium"].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-primary">
                    Preferred plan
                  </label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                    className="w-full rounded-[11px] border border-grey px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel"
                  >
                    {["Free", "Verified", "Premium"].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-[18px] rounded-xl border border-dashed border-line bg-canvas-subtle px-4 py-6 text-center text-sm text-muted">
                Photo upload — coming soon (placeholder)
              </div>
              <div className="mt-[18px]">
                <label className="mb-1.5 block text-[13px] font-semibold text-primary">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you offer and which plan you're interested in."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full resize-y rounded-[11px] border border-grey px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel"
                />
              </div>
              <button
                type="button"
                onClick={submit}
                className="tap mt-6 w-full rounded-[13px] bg-primary py-4 text-[15.5px] font-bold text-canvas hover:bg-primary-mid"
              >
                Submit Enquiry
              </button>
              <button
                type="button"
                disabled
                className="tap mt-3 w-full cursor-not-allowed rounded-[13px] border border-line bg-canvas-subtle py-3 text-sm font-semibold text-muted"
                title="Razorpay integration coming in Phase 3"
              >
                Proceed to Payment (coming soon)
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
  value = "",
  error,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-primary">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-[11px] border px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-steel ${
          error ? "border-closed" : "border-grey"
        }`}
      />
      {error ? <p className="mt-1 text-xs text-closed">{error}</p> : null}
    </div>
  );
}

export function GemsGrid() {
  const gems = getAllHiddenGems();
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-12">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
          {gemCollections.map((g) => (
            <GemCard key={g.id} gem={g} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <h2 className="mb-6 text-xl font-bold text-primary">Every hidden gem</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {gems.map((gem) => (
            <HardNavLink
              key={gem.slug}
              href={`/hidden-gems/${gem.slug}`}
              className="card-hover overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gem.images[0]} alt={gem.name} className="aspect-[16/10] w-full object-cover" />
              <div className="p-4">
                <span className="text-xs font-semibold uppercase text-steel">{gem.category}</span>
                <h3 className="mt-1 font-semibold text-primary">{gem.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{gem.description}</p>
              </div>
            </HardNavLink>
          ))}
        </div>
      </section>
    </>
  );
}

function SuggestionBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5 rounded-2xl border border-line bg-white p-5">
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line bg-canvas-subtle px-3 py-1 text-sm text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
