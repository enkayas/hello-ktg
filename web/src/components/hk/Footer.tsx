import Link from "next/link";
import { GaurLogo } from "./Logo";

export default function HKFooter() {
  return (
    <footer className="mt-auto bg-primary text-[#D5DEE6]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-9 px-6 py-14">
        <div className="col-span-full max-w-[340px]">
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white/10">
              <GaurLogo size={32} fill="#DDA23C" />
            </span>
            <span className="text-lg tracking-[-0.02em] text-white">
              <span className="font-medium text-accent">Hello</span>
              <span className="font-bold">Kotagiri</span>
            </span>
          </div>
          <p className="max-w-[32ch] text-sm leading-relaxed text-[#A6B7C4]">
            Discover the Nilgiris like a local — smart stays, real food and the
            hidden corners of Kotagiri, Ooty & Coonoor.
          </p>
        </div>
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.07em] text-accent">
            Discover
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#BCC9D4]">
            <Link href="/stay" className="hover:text-white">Stay</Link>
            <Link href="/eat" className="hover:text-white">Eat</Link>
            <Link href="/things-to-do" className="hover:text-white">Things To Do</Link>
            <Link href="/hidden-gems" className="hover:text-white">Hidden Gems</Link>
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.07em] text-accent">
            Plan
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#BCC9D4]">
            <Link href="/plan-my-trip" className="hover:text-white">Plan My Trip</Link>
            <Link href="/near-me" className="hover:text-white">Near Me</Link>
            <Link href="/" className="hover:text-white">Explore</Link>
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.07em] text-accent">
            For Business
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#BCC9D4]">
            <Link href="/list-your-business" className="hover:text-white">
              List Your Business
            </Link>
            <Link href="/list-your-business#pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/owner/login" className="hover:text-white">
              Partner Login
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3.5 px-6 py-[18px]">
          <span className="font-mono text-xs text-[#8C9DA9]">
            © 2026 hellokotagiri.com
          </span>
          <span className="text-xs text-[#8C9DA9]">Made in the Nilgiris</span>
        </div>
      </div>
    </footer>
  );
}
