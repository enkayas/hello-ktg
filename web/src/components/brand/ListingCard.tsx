import Badge from "./Badge";
import Button from "./Button";

type Props = {
  name: string;
  location: string;
  distance?: string;
  price?: string;
  bestFor?: string;
  knownFor?: string;
  openNow?: boolean;
  tags: string[];
  amenities?: string[];
  image: string;
  whatsapp?: string;
  href?: string;
  variant?: "stay" | "eat" | "place" | "gem";
  type?: string;
  bestTime?: string;
  difficulty?: string;
  familyFriendly?: boolean;
  seniorFriendly?: boolean;
  badges?: string[];
  description?: string;
};

export default function ListingCard(props: Props) {
  const {
    name,
    location,
    distance,
    price,
    bestFor,
    knownFor,
    openNow,
    tags,
    amenities,
    image,
    whatsapp,
    href = "#",
    variant = "stay",
    type,
    bestTime,
    difficulty,
    familyFriendly,
    seniorFriendly,
    badges,
    description,
  } = props;

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
        {price ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {price}
          </span>
        ) : null}
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
        {type ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-tea">
            {type}
          </p>
        ) : null}
        <h3 className="font-serif text-lg font-semibold text-primary">{name}</h3>
        <p className="mt-1 text-sm text-charcoal/60">
          {location}
          {distance ? ` · ${distance}` : ""}
        </p>

        {bestFor ? (
          <p className="mt-2 text-sm text-charcoal/70">
            Best for: <span className="font-medium">{bestFor}</span>
          </p>
        ) : null}
        {knownFor ? (
          <p className="mt-2 text-sm text-charcoal/70">
            Known for: <span className="font-medium">{knownFor}</span>
          </p>
        ) : null}
        {description ? (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">{description}</p>
        ) : null}

        {(bestTime || difficulty) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-charcoal/60">
            {bestTime ? <span>⏰ {bestTime}</span> : null}
            {difficulty ? <span>🥾 {difficulty}</span> : null}
          </div>
        )}

        {(familyFriendly !== undefined || seniorFriendly !== undefined) && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {familyFriendly ? (
              <Badge variant="success">Family Friendly</Badge>
            ) : null}
            {seniorFriendly ? (
              <Badge variant="success">Senior Friendly</Badge>
            ) : null}
          </div>
        )}

        {badges && badges.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Badge key={b} variant="gold">
                {b}
              </Badge>
            ))}
          </div>
        ) : null}

        {amenities && amenities.length > 0 ? (
          <p className="mt-3 text-xs text-charcoal/60">
            {amenities.join(" · ")}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {variant === "stay" ? (
            <>
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'd like to enquire about ${name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap inline-flex items-center justify-center rounded-full bg-tea px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary"
                >
                  WhatsApp
                </a>
              ) : null}
              <Button href={href} variant="outline" className="!px-4 !py-2 !text-xs">
                View Details
              </Button>
            </>
          ) : variant === "eat" ? (
            <>
              <Button href={href} variant="outline" className="!px-4 !py-2 !text-xs">
                View Menu
              </Button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(name + " " + location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tap inline-flex items-center justify-center rounded-full border-2 border-tea/30 px-4 py-2 text-xs font-semibold text-primary transition hover:border-tea"
              >
                Directions
              </a>
            </>
          ) : (
            <Button href={href} variant="outline" className="!px-4 !py-2 !text-xs">
              Learn More
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
