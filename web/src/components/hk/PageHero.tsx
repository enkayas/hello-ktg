import { gradients, type GradientKey } from "@/lib/images";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  goldEyebrow?: boolean;
};

export default function PageHero({ eyebrow, title, subtitle, goldEyebrow }: Props) {
  return (
    <section className="hero-radial text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-[52px] pb-14">
        {eyebrow ? (
          <span
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${
              goldEyebrow ? "text-accent" : "text-[#C3D4E2]"
            }`}
          >
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3.5 text-[42px] font-bold leading-[1.05] tracking-[-0.03em]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3.5 max-w-[58ch] text-[17px] leading-relaxed text-white/78">
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
  gradient: GradientKey;
  height?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${height}`} style={{ background: gradients[gradient] }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-[rgba(18,40,60,0.34)]" />
      {children}
    </div>
  );
}

export function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-muted">
      {children}
    </span>
  );
}
