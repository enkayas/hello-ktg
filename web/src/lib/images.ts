/** Shared image URLs — Wikimedia (live site) + curated placeholders */

export const wiki = (file: string, width = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const images = {
  kodanad: wiki("Kodanad.jpg", 1600),
  catherine: wiki("Catherine_Falls_view_from_Dolphin's_Nose.jpg", 1600),
  longwood: wiki("Shola.jpg", 1600),
  teaEstate: wiki("Nilgiritea.jpg", 1600),
  rangaswamy: wiki("Rangaswamy_Peak_seen_from_Kodanad.jpg", 1600),
  kotagiriTown: wiki("Kotagiri_Town.jpg", 1600),
  sholaGrass: wiki("Shola_forest_and_grassland.jpg", 1600),
  nmrTrain: wiki("NMR_train_at_Ketti_05-02-26_75.jpeg", 1600),
  cafe:
    "https://images.unsplash.com/photo-1495474473367-a7fedd892b71?w=900&q=80&auto=format&fit=crop",
  homestay:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&auto=format&fit=crop",
  glamping:
    "https://images.unsplash.com/photo-1478134347167-52561ae399af?w=900&q=80&auto=format&fit=crop",
  garden:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop",
  bakery:
    "https://images.unsplash.com/photo-1509440159596-0248e577bbef?w=900&q=80&auto=format&fit=crop",
  futsal:
    "https://images.unsplash.com/photo-1574629810360-7aec2a9ac2c1?w=900&q=80&auto=format&fit=crop",
} as const;

/** Gradient fallbacks matching design prototypes */
export const gradients = {
  tea: "linear-gradient(150deg,#1D3A58,#3B6E9C)",
  valley: "linear-gradient(150deg,#16304A,#2A557D)",
  gold: "linear-gradient(150deg,#6E521F,#DDA23C)",
  mist: "linear-gradient(150deg,#2A557D,#C3D4E2)",
  forest: "linear-gradient(150deg,#122740,#3B6E9C)",
  dawn: "linear-gradient(150deg,#21456A,#5E7488)",
  slate: "linear-gradient(150deg,#16304A,#2A557D)",
  steel: "linear-gradient(150deg,#1D3A58,#3B6E9C)",
  deep: "linear-gradient(150deg,#122740,#3B6E9C)",
  dusk: "linear-gradient(150deg,#21456A,#5E7488)",
} as const;

export type GradientKey = keyof typeof gradients;
