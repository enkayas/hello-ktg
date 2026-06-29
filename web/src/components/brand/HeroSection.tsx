import Button from "./Button";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  compact?: boolean;
  image?: string;
};

export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  compact = false,
  image,
}: Props) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "py-14 md:py-20" : "py-20 md:py-32"}`}
    >
      {image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="cinematic-overlay absolute inset-0" />
        </>
      ) : (
        <div className="hero-gradient absolute inset-0" />
      )}

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {eyebrow ? (
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`font-serif font-semibold leading-tight text-white ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"}`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {subtitle}
          </p>
        ) : null}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta ? (
              <Button href={primaryCta.href} variant="gold">
                {primaryCta.label}
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
