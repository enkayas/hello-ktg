import Button from "./Button";

type Props = {
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "default" | "business";
};

export default function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = "default",
}: Props) {
  return (
    <section
      className={`mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 ${
        variant === "business" ? "" : ""
      }`}
    >
      <div
        className={`overflow-hidden rounded-3xl p-8 md:p-12 ${
          variant === "business"
            ? "hero-gradient text-white"
            : "border border-cloud bg-white shadow-sm"
        }`}
      >
        <div className="max-w-2xl">
          <h2
            className={`font-serif text-2xl font-semibold md:text-3xl ${
              variant === "business" ? "text-white" : "text-primary"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-4 text-base leading-relaxed ${
              variant === "business" ? "text-white/85" : "text-charcoal/70"
            }`}
          >
            {subtitle}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta ? (
                <Button
                  href={primaryCta.href}
                  variant={variant === "business" ? "gold" : "primary"}
                >
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  href={secondaryCta.href}
                  variant={variant === "business" ? "secondary" : "outline"}
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
