import Badge from "./Badge";
import Button from "./Button";

type Props = {
  name: string;
  category: string;
  distance: string;
  bestFor: string;
  tags: string[];
  image: string;
  openNow?: boolean;
  href?: string;
  showDirections?: boolean;
};

export default function ExperienceCard({
  name,
  category,
  distance,
  bestFor,
  tags,
  image,
  openNow,
  href = "#",
  showDirections = true,
}: Props) {
  return (
    <article className="card-lift overflow-hidden rounded-2xl border border-cloud bg-white shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {openNow !== undefined ? (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
              openNow ? "bg-tea text-white" : "bg-charcoal/60 text-white"
            }`}
          >
            {openNow ? "Open Now" : "Closed"}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-tea">
              {category}
            </p>
            <h3 className="font-serif text-lg font-semibold text-primary">
              {name}
            </h3>
          </div>
          <span className="shrink-0 text-sm font-medium text-charcoal/60">
            {distance}
          </span>
        </div>
        <p className="mt-2 text-sm text-charcoal/70">
          Best for: <span className="font-medium text-charcoal">{bestFor}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={href} variant="outline" className="!px-4 !py-2 !text-xs">
            View Details
          </Button>
          {showDirections ? (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(name + " Kotagiri")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap inline-flex items-center justify-center rounded-full border-2 border-tea/30 px-4 py-2 text-xs font-semibold text-primary transition hover:border-tea hover:bg-white"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
