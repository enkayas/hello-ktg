import curated from "@/data/curated.json";

export type ExploreSpot = (typeof curated.explore)[number] & { image: string };
export type Activity = (typeof curated.activities)[number] & { image: string };
export type Restaurant = {
  id: string;
  name: string;
  tag: string;
  description: string;
  rating?: string;
  location: string;
  featured?: boolean;
  verified?: boolean;
  image: string;
  website?: string;
  enquireName: string;
  hostPhone: string;
};

const wiki = (file: string, w = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

const EXPLORE_IMAGES: Record<string, string> = {
  kodanad: wiki("Kodanad.jpg"),
  catherine: wiki("Catherine_Falls_view_from_Dolphin's_Nose.jpg"),
  longwood: wiki("Shola.jpg"),
  sullivan: wiki("John_Sullivan_Ootacamund.jpg"),
  rangaswamy: wiki("Rangasamy_Peak_seen_from_Kodanad.jpg"),
  nehru: wiki("Kotagiri_Town.jpg"),
  nilgiritrains: wiki("NMR_train_at_Ketti_05-02-26_75.jpeg"),
};

const ACTIVITY_IMAGES: Record<string, string> = {
  catherine_trek: wiki("CATHERINE_WATER_FALLS.jpg"),
  tea_factory: wiki("Nilgiritea.jpg"),
  birding: wiki("Nilgiri_Flycatcher_by_N.A._Naseer.jpg"),
  sullivan_trail: wiki("Shola-grass-mountain-Grass_HillsNP.jpg"),
  jeep_safari: wiki("Rangasamy_Peak_seen_from_Kodanad.jpg"),
  plantation: wiki("Nilgiritea.jpg"),
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "silvertip-cafe",
    name: "Silvertip Cafe",
    tag: "CAFÉ",
    description:
      "A quaint café just before Aravenu — estate teas & coffee, sandwiches, noodles, muffins and brownies, with a mini book-shop and plants for sale.",
    rating: "★ 4.5",
    location: "Aravenu, SH-15",
    featured: true,
    verified: true,
    image: "https://silvertipcafe.com/wp-content/uploads/2024/06/DB_1927.jpeg",
    website: "https://silvertipcafe.com/",
    enquireName: "Silvertip Cafe (table)",
    hostPhone: "919381107922",
  },
  {
    id: "dosapoint",
    name: "Dosapoint by Silvertip",
    tag: "SOUTH INDIAN",
    description:
      "Warm, cosy diner in Johnstone Square serving dosas and Tamil Nadu favourites. Opens early (9 AM); dine-in & delivery, with a kids' menu.",
    rating: "★ 4.4",
    location: "Johnstone Square, Kotagiri",
    featured: true,
    verified: true,
    image: wiki("Masala_Dosa_from_Karnataka.jpg"),
    website: "https://silvertipcafe.com/dosapoint/",
    enquireName: "Dosapoint by Silvertip (table)",
    hostPhone: "919381107922",
  },
  {
    id: "silvertip-select",
    name: "Silvertip Cafe Select",
    tag: "SPECIALTY COFFEE",
    description:
      "An elevated coffee experience in Kotagiri town — artisanal blends, gourmet pastries and contemporary plates. Famed brownies & lemon tea.",
    rating: "★ 4.5 (306 reviews)",
    location: "Johnstone Square",
    featured: true,
    verified: true,
    image: wiki("A_cup_of_coffee_with_latte_art.jpg"),
    website: "https://silvertipcafe.com/silvertip-select/",
    enquireName: "Silvertip Cafe Select (table)",
    hostPhone: "919381107922",
  },
  {
    id: "hobbit-garden",
    name: "Hobbit Garden Restaurant",
    tag: "GARDEN DINING",
    description:
      "A whimsical, hobbit-inspired garden restaurant in Aravenu — international dishes and local specialities from fresh, locally-sourced produce.",
    location: "Kesalada Rd, Aravenu · Open daily 12–8:30 PM",
    featured: true,
    verified: true,
    image: wiki("Shola_forest_and_grassland.jpg"),
    website: "https://www.thehobbitrestaurant.in/",
    enquireName: "Hobbit Garden Restaurant (table)",
    hostPhone: "919381107922",
  },
  {
    id: "tea-county",
    name: "Tea County Restaurant",
    tag: "TEA & DINING",
    description:
      "A well-loved spot for its ambience and food — and tea brewed from the finest Nilgiri leaves. A reliable sit-down meal in town.",
    rating: "★ 4.2",
    location: "Kotagiri town",
    verified: true,
    image: wiki("Nilgiritea.jpg"),
    enquireName: "Tea County Restaurant (table)",
    hostPhone: "919962541214",
  },
  {
    id: "manna-jsp",
    name: "Manna JSP Restaurant",
    tag: "PURE VEG",
    description:
      "Popular vegetarian multi-cuisine — South Indian, North Indian, Chinese and tandoori — a dependable, value-friendly meal loved by locals and visitors.",
    rating: "★ 4.1",
    location: "near Johnston Square",
    verified: true,
    image: wiki("Masala_Dosa_from_Karnataka.jpg"),
    enquireName: "Manna JSP Restaurant (table)",
    hostPhone: "919962541214",
  },
];

export const STATS = [
  { value: "1,793 m", label: "above sea level — cool all year" },
  { value: "1819", label: "first Nilgiris settlement, by John Sullivan" },
  { value: "250 ft", label: "Catherine Falls — 2nd highest in the Nilgiris" },
  { value: "10–25°C", label: "year-round, never harsh" },
];

export function getExploreSpots(): ExploreSpot[] {
  return curated.explore.map((spot) => ({
    ...spot,
    image: EXPLORE_IMAGES[spot.id] ?? wiki("Kotagiri_Town.jpg"),
  }));
}

export function getExploreSpot(id: string): ExploreSpot | undefined {
  return getExploreSpots().find((s) => s.id === id);
}

export function getActivities(): Activity[] {
  return curated.activities.map((a) => ({
    ...a,
    image: ACTIVITY_IMAGES[a.id] ?? wiki("Shola.jpg"),
  }));
}

export function getActivity(id: string): Activity | undefined {
  return getActivities().find((a) => a.id === id);
}

export const seasons = curated.seasons;
export const transport = curated.transport;
export const localInfo = curated.localInfo;

export const HIDDEN_SPOTS = [
  {
    id: "rangaswamy",
    title: "Rangaswamy Peak & Pillar",
    tag: "SACRED · TREK",
    distance: "~20 km via Kodanad · moderate · guided",
    description:
      "A conical sacred peak and a lone rock pillar revered by the Nilgiri hill tribes — reached by guided forest trek.",
    image: wiki("Rangasamy_Peak_seen_from_Kodanad.jpg", 1100),
    href: "/explore/rangaswamy",
  },
  {
    id: "elk",
    title: "Elk Falls & Uyilathi",
    tag: "WATERFALL · VILLAGE",
    distance: "~7 km · easy–moderate · best Oct–May",
    description:
      "A quiet ~80-ft fall below Uyilathi village — the intimate alternative to Catherine, with the Echoing Valley of Kookal nearby.",
    image: wiki("CATHERINE_WATER_FALLS.jpg", 1100),
    href: "/explore/catherine",
  },
  {
    id: "kookal",
    title: "Kookal Echoing Valley",
    tag: "VIEWPOINT",
    distance: "near Uyilathi",
    description:
      "A hidden valley where the hills seem to answer back — an off-beat, uncommercial pocket that pairs with an Elk Falls visit.",
    image: wiki("Shola_forest_and_grassland.jpg", 1100),
    href: "/hidden-gems",
  },
  {
    id: "ellad",
    title: "Ellad tea-estate walk",
    tag: "WALK",
    distance: "near Kotagiri · easy",
    description:
      "A local favourite — quiet estate trails through some of Kotagiri's prettiest tea paths. No ticket counters, just hills and tea.",
    image: wiki("Nilgiritea.jpg", 1100),
    href: "/hidden-gems",
  },
];
