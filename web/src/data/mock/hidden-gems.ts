import type { HiddenGem } from "./types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

export const hiddenGems: HiddenGem[] = [
  {
    id: "elk-view",
    name: "Elk Falls Quiet Viewpoint",
    category: "Quiet viewpoint",
    description: "A peaceful alternative to Catherine — misty mornings and fewer crowds.",
    badges: ["Local Pick", "Best Morning", "Guide Recommended"],
    image: img("1439069582845-503a2728edca"),
    distance: "7 km from Kotagiri",
  },
  {
    id: "kookal",
    name: "Kookal Echoing Valley",
    category: "Scenic route",
    description: "Hidden valley where the hills answer back — pair with a Uyilathi visit.",
    badges: ["Hidden Gem", "Photography"],
    image: img("1441974231531-c6227db76b6e"),
    distance: "Near Uyilathi",
  },
  {
    id: "tea-valley",
    name: "Ellad Tea Valley Drive",
    category: "Tea valley drive",
    description: "Unmarked estate roads with no ticket counters — just hills and tea.",
    badges: ["Local Pick", "Good for Families"],
    image: img("1558618666-fcd25c85cd64"),
    distance: "Near Kotagiri",
  },
  {
    id: "rainy-cafe",
    name: "Rainy Day Corner Café",
    category: "Rainy day café",
    description: "Warm wood-fired oven, Nilgiri tea and a window seat for the mist.",
    badges: ["Best Morning", "Workcation"],
    image: img("1509042239860-f550ce710b93"),
    distance: "Kotagiri town",
  },
  {
    id: "bakery",
    name: "Johnston Square Bakery",
    category: "Local bakery",
    description: "Fresh buns and local short eats before the day-trippers arrive.",
    badges: ["Local Pick", "Good for Families"],
    image: img("1509440159596-0248e577bbef"),
    distance: "Kotagiri town",
  },
  {
    id: "photo-spot",
    name: "Moyar Valley Photo Ledge",
    category: "Photo spot",
    description: "Unmarked ledge off the Kodanad road — best in clear November light.",
    badges: ["Photography", "Guide Recommended"],
    image: img("1464822759023-fed622ff2f3b"),
    distance: "16 km from Kotagiri",
  },
  {
    id: "short-route",
    name: "Longwood to Town Short Loop",
    category: "Short scenic route",
    description: "45-minute shola-to-town walk through tea and pine — no guide needed.",
    badges: ["Good for Families", "Best Morning"],
    image: img("1441974231531-c6227db76b6e"),
    distance: "3 km loop",
  },
  {
    id: "sunset-ledge",
    name: "Moon Road Sunset Ledge",
    category: "Quiet viewpoint",
    description: "West-facing pull-off on Moon Road — golden hour without the Ooty crowds.",
    badges: ["Local Pick", "Photography"],
    image: img("1478134347167-52561ae399af"),
    distance: "5 km from Kotagiri",
  },
];
