import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-cloud bg-primary text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-semibold text-white">
            HelloKotagiri
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Discover Nilgiris Like a Local — smart stays, local food, scenic
            routes and hidden gems across Kotagiri, Ooty, Coonoor and beyond.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Discover</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/stay" className="hover:text-white">Stay</Link>
            <Link href="/eat" className="hover:text-white">Eat</Link>
            <Link href="/things-to-do" className="hover:text-white">Things To Do</Link>
            <Link href="/hidden-gems" className="hover:text-white">Hidden Gems</Link>
            <Link href="/near-me" className="hover:text-white">Near Me</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Business</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/list-your-business" className="hover:text-white">
              List Your Business
            </Link>
            <Link href="/plan-my-trip" className="hover:text-white">
              Plan My Trip
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} HelloKotagiri · Kotagiri, Nilgiris, Tamil Nadu
      </div>
    </footer>
  );
}
