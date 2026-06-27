"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Kotagiri & its surroundings (Wikimedia Commons, high-res). Deliberately
// excludes Coonoor/Ooty imagery.
const SLIDES = [
  { file: "Kotagiri_Town.jpg", caption: "Kotagiri town" },
  { file: "Kodanad.jpg", caption: "Kodanad viewpoint" },
  { file: "Catherine_Falls_view_from_Dolphin%27s_Nose.jpg", caption: "Catherine Falls" },
  { file: "Rangasamy_Peak_seen_from_Kodanad.jpg", caption: "Rangaswamy Peak" },
  { file: "Nilgiritea.jpg", caption: "Tea estates" },
  { file: "Shola_forest_and_grassland.jpg", caption: "Shola forests" },
];

const src = (file: string, w = 1920) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-forest">
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.file}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src(s.file)}
            alt={s.caption}
            className={`h-full w-full object-cover ${i === active ? "kenburns" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/55 via-forest/25 to-forest/85" />

      {/* Overlay content */}
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-5 text-center text-cream">
        <p className="hero-rise text-xs font-bold uppercase tracking-[0.22em] text-tea">
          The oldest hill station in the Nilgiris · 1,793 m
        </p>
        <h1
          className="hero-rise mt-3 font-serif text-4xl font-bold leading-tight drop-shadow-sm sm:text-6xl"
          style={{ animationDelay: "0.08s" }}
        >
          The quiet side of the{" "}
          <em className="text-tea">Nilgiris</em>
        </h1>
        <p
          className="hero-rise mx-auto mt-4 max-w-md text-cream/90 drop-shadow"
          style={{ animationDelay: "0.16s" }}
        >
          Tea estates, misty trails and waterfalls — and verified homestays to
          wake up in.
        </p>
        <div
          className="hero-rise mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center"
          style={{ animationDelay: "0.24s" }}
        >
          <Link
            href="/stays"
            className="tap inline-flex items-center justify-center rounded-full bg-leaf px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-pine"
          >
            Browse stays
          </Link>
          <Link
            href="/list-your-property"
            className="tap inline-flex items-center justify-center rounded-full border-2 border-cream/80 px-7 py-3 font-semibold text-cream backdrop-blur-sm transition hover:bg-cream hover:text-forest"
          >
            List your property
          </Link>
        </div>
      </div>

      {/* Location caption (changes per slide) */}
      <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 rounded-full bg-forest/45 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
        <span aria-hidden>📍</span>
        <span key={active} className="hero-rise">
          {SLIDES[active].caption}
        </span>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.file}
            onClick={() => setActive(i)}
            aria-label={`Show ${s.caption}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-cream" : "w-2 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
