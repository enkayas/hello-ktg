type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  goldEyebrow?: boolean;
};

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="page-hero-light">
      <div className="mx-auto max-w-[1240px] px-6 py-10 md:py-14">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a6b1a]">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-4 max-w-[20ch] text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-primary">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function CardImage({
  image,
  gradient,
  height = "h-[174px]",
  children,
}: {
  image?: string;
  gradient: string;
  height?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${height}`} style={{ background: gradient }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[rgba(18,40,60,0.28)]" />
      {children}
    </div>
  );
}

export function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-canvas-subtle px-2.5 py-1 text-[11.5px] font-medium text-muted shadow-[0_1px_2px_rgba(29,58,88,0.04)]">
      {children}
    </span>
  );
}
