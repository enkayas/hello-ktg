import Link from "next/link";
import type { ExploreSpot } from "@/lib/content";

export default function AttractionCard({ spot }: { spot: ExploreSpot }) {
  return (
    <Link
      href={`/explore/${spot.id}`}
      className="group relative block min-h-[280px] overflow-hidden rounded-[22px] shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${spot.image}')`, backgroundColor: "#7fa6cc" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,22,38,.9)] via-[rgba(13,22,38,.32)] to-transparent" />
      <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
        {spot.tag}
      </span>
      <span className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-forest transition group-hover:rotate-45 group-hover:bg-sun group-hover:text-white">
        ↗
      </span>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pr-16 text-white">
        <span className="text-xs font-semibold text-gold-soft">{spot.distance}</span>
        <h3 className="display mt-1 text-xl font-semibold">{spot.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/85">{spot.description}</p>
      </div>
    </Link>
  );
}
