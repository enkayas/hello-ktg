import type { BusinessPlan } from "@/data/mock/types";
import Button from "./Button";

type Props = {
  plan: BusinessPlan;
};

export default function BusinessPricingCard({ plan }: Props) {
  return (
    <div
      className={`card-lift flex flex-col rounded-2xl border p-6 md:p-8 ${
        plan.highlighted
          ? "border-gold bg-white shadow-lg ring-2 ring-gold/30"
          : "border-cloud bg-white shadow-sm"
      }`}
    >
      {plan.highlighted ? (
        <span className="mb-4 inline-flex w-fit rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          Most Popular
        </span>
      ) : null}
      <h3 className="font-serif text-xl font-semibold text-primary">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-serif text-3xl font-semibold text-primary">
          {plan.price}
        </span>
        <span className="text-sm text-charcoal/60">{plan.period}</span>
      </div>
      <p className="mt-3 text-sm text-charcoal/70">{plan.description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-charcoal/80">
            <span className="text-tea">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Button
        href="#enquiry-form"
        variant={plan.highlighted ? "gold" : "outline"}
        className="mt-8 w-full"
      >
        Get Started
      </Button>
    </div>
  );
}
