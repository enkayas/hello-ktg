import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Full page navigation link — required for listing detail routes on Cloudflare
 * OpenNext where Next.js client-side <Link> can incorrectly show 404.
 */
export default function HardNavLink({ href, className, children }: Props) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
