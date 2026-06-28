import Link from "next/link";
import type { ReactNode } from "react";

export function Btn({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "light" | "gold";
  className?: string;
}) {
  const styles = {
    primary: "bg-leaf text-white shadow-md hover:bg-pine",
    outline:
      "border border-forest/25 bg-transparent text-forest hover:bg-forest hover:text-white",
    light: "bg-white text-forest shadow-md hover:text-pine",
    gold: "bg-sun text-[#2a1d05] hover:bg-[#b07f33] hover:text-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`tap inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold no-underline transition hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  light,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <span className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</span>
      <h2 className="display mt-2 text-3xl font-semibold text-forest md:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-3 text-base text-muted">{lede}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <header
      className="relative flex min-h-[52vh] items-end text-white"
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(20,32,52,.45),rgba(20,32,52,.78)),url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-14 pt-32">
        {breadcrumb ? (
          <p className="mb-2 text-sm text-white/80">
            {breadcrumb.map((b, i) => (
              <span key={b.href}>
                {i > 0 ? " / " : ""}
                <Link href={b.href} className="font-semibold text-gold-soft">
                  {b.label}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h1 className="display mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">{lede}</p>
      </div>
    </header>
  );
}
