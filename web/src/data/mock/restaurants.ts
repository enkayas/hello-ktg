import type { Restaurant } from "./types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

export const restaurants: Restaurant[] = [
  {
    id: "silvertip-cafe",
    name: "Silvertip Cafe",
    location: "Aravenu, SH-15",
    knownFor: "Estate tea, brownies & light meals",
    openNow: true,
    hours: "8 AM – 8 PM",
    tags: ["Café", "Breakfast", "Parking"],
    image: img("1495474473367-a7fedd892b71"),
  },
  {
    id: "dosapoint",
    name: "Dosapoint by Silvertip",
    location: "Johnstone Square",
    knownFor: "Crisp dosas & Tamil Nadu favourites",
    openNow: true,
    hours: "9 AM – 9 PM",
    tags: ["South Indian", "Breakfast", "Family Friendly"],
    image: img("1630384477427-333891a6dcfe"),
  },
  {
    id: "hobbit",
    name: "Hobbit Garden Restaurant",
    location: "Kesalada Rd, Aravenu",
    knownFor: "Garden dining & local produce",
    openNow: false,
    hours: "12 PM – 8:30 PM",
    tags: ["Non-Veg", "Family Friendly", "Parking"],
    image: img("1517248135467-4c7edcad34c4"),
  },
  {
    id: "tea-county",
    name: "Tea County Restaurant",
    location: "Kotagiri town",
    knownFor: "Nilgiri tea & sit-down meals",
    openNow: true,
    hours: "10 AM – 9 PM",
    tags: ["South Indian", "Family Friendly"],
    image: img("1555396273-367ea4d4f702"),
  },
  {
    id: "manna-jsp",
    name: "Manna JSP Restaurant",
    location: "Near Johnston Square",
    knownFor: "Pure veg multi-cuisine",
    openNow: true,
    hours: "11 AM – 10 PM",
    tags: ["South Indian", "Family Friendly", "Parking"],
    image: img("1601050690117-94fccc7e83e3"),
  },
  {
    id: "mountain-brew",
    name: "Mountain Brew Café",
    location: "Coonoor Road",
    knownFor: "Specialty coffee & pastries",
    openNow: true,
    hours: "7 AM – 7 PM",
    tags: ["Café", "Breakfast", "Workcation"],
    image: img("1509042239860-f550ce710b93"),
  },
];

export const eatFilters = [
  "Breakfast",
  "South Indian",
  "Café",
  "Non-Veg",
  "Family Friendly",
  "Parking",
  "Open Now",
] as const;
