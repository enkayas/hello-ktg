import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";

const styles: Record<Variant, string> = {
  primary:
    "bg-tea text-white shadow-md hover:bg-primary hover:shadow-lg",
  secondary:
    "bg-white text-primary shadow-md hover:shadow-lg hover:text-tea",
  outline:
    "border-2 border-tea/30 bg-transparent text-primary hover:border-tea hover:bg-white",
  ghost: "bg-transparent text-primary hover:bg-cloud/80",
  gold: "bg-gold text-primary shadow-md hover:brightness-105",
};

type Props = {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `tap inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={rest.type ?? "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}
