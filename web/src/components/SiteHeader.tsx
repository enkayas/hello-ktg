import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-serif text-lg font-bold text-forest">
          Travel <span className="text-leaf">Kotagiri</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/stay" className="font-medium text-ink hover:text-tea">
            Stays
          </Link>
          <Link
            href="/list-your-business"
            className="tap inline-flex items-center rounded-full bg-leaf px-4 py-2 font-semibold text-white hover:bg-pine"
          >
            List your stay
          </Link>
        </nav>
      </div>
    </header>
  );
}
