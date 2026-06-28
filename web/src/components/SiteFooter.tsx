import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#15263a] px-5 py-12 text-sm text-[#a9bccf]">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <div>
          <div className="display text-xl font-bold text-white">
            <span className="font-[family-name:var(--font-script)] text-[26px] text-gold-soft">
              hello
            </span>
            Kotagiri
          </div>
          <p className="mt-3 max-w-xs leading-relaxed">
            A local guide to the oldest hill station in the Nilgiris — stays,
            sights, food and bookings.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Discover</h4>
          <Link href="/explore" className="mb-2 block hover:text-white">
            Places to visit
          </Link>
          <Link href="/hidden-kotagiri" className="mb-2 block hover:text-white">
            Hidden Kotagiri
          </Link>
          <Link href="/nature-birding" className="mb-2 block hover:text-white">
            Sholas &amp; Birding
          </Link>
          <Link href="/eat" className="mb-2 block hover:text-white">
            Where to eat
          </Link>
          <Link href="/things-to-do" className="mb-2 block hover:text-white">
            Treks &amp; trails
          </Link>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Plan &amp; host</h4>
          <Link href="/stays" className="mb-2 block hover:text-white">
            Where to stay
          </Link>
          <Link href="/plan" className="mb-2 block hover:text-white">
            Plan your trip
          </Link>
          <Link href="/list-your-property" className="mb-2 block hover:text-white">
            List your property
          </Link>
          <Link href="/owner/login" className="mb-2 block hover:text-white">
            Owner login
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-6 text-center text-xs text-[#7f93a8]">
        © 2026 helloKotagiri · Made in the Nilgiris
      </p>
    </footer>
  );
}
