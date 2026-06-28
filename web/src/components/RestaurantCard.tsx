import Link from "next/link";
import type { Restaurant } from "@/lib/content";

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-forest/5 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div
        className="relative h-48 bg-cover bg-center transition duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url('${r.image}')`, backgroundColor: "#7fa6cc" }}
      >
        <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white">
          {r.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          {r.featured ? (
            <span className="rounded-full bg-sun/20 px-2 py-0.5 text-[10px] font-bold text-forest">
              FEATURED
            </span>
          ) : null}
          {r.verified ? (
            <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[10px] font-bold text-leaf">
              VERIFIED
            </span>
          ) : null}
        </div>
        <h3 className="display text-lg font-semibold text-forest">{r.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        <p className="mt-2 text-sm font-medium text-forest">
          {r.rating ? `${r.rating} · ` : ""}
          {r.location}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/list-your-property?enquiry=${encodeURIComponent(r.enquireName)}`}
            className="tap inline-flex rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-pine"
          >
            Enquire
          </Link>
          {r.website ? (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-leaf no-underline hover:text-pine"
            >
              Website →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
