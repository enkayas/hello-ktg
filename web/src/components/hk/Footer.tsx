import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import type { SiteAsset } from "@/lib/brand";

export default function HKFooter({ assets }: { assets: SiteAsset[] }) {
  return (
    <footer className="mt-auto bg-primary text-[#D5DEE6]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-9 px-6 py-14">
        <div className="col-span-full max-w-[340px]">
          <div className="mb-3.5">
            <BrandLogo assets={assets} background="dark" height={32} />
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
            <Link href="/routes" className="hover:text-white">Scenic Routes</Link>
            <Link href="/saved" className="hover:text-white">Saved</Link>
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.07em] text-accent">
            Legal
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#BCC9D4]">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/responsible-travel" className="hover:text-white">Responsible Travel</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.07em] text-accent">
            Partners
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#BCC9D4]">
            <Link href="/list-your-business" className="hover:text-white">List your business</Link>
            <a
              href="https://console.hellokotagiri.com/owner/login"
              className="hover:text-white"
            >
              Business Console
            </a>
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
