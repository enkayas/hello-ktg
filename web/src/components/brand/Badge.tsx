type Props = {
  children: React.ReactNode;
  variant?: "default" | "gold" | "muted" | "success";
  className?: string;
};

const variants = {
  default: "bg-cloud text-primary",
  gold: "bg-gold/15 text-primary border border-gold/30",
  muted: "bg-white/80 text-charcoal/70 border border-cloud",
  success: "bg-tea/10 text-tea border border-tea/20",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
