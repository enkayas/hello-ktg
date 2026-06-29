export type RouteCard = {
  slug: string;
  title: string;
  from: string;
  to: string;
  distance: string;
  travelTime: string;
  bestStops: string[];
  foodStops: string[];
  restroomStop: string;
  cautions: string[];
  description: string;
  bestTime: string;
  viewpoints: string[];
  nearbyStays: string[];
};

export const ROUTES: RouteCard[] = [
  {
    slug: "coimbatore-kotagiri",
    title: "Coimbatore to Kotagiri",
    from: "Coimbatore",
    to: "Kotagiri",
    distance: "~68 km",
    travelTime: "2–2.5 hrs",
    bestStops: ["Mettupalayam tea stalls", "Kallar viewpoint"],
    foodStops: ["Mettupalayam breakfast", "Kotagiri town square"],
    restroomStop: "Mettupalayam bypass",
    cautions: ["Ghat hairpins after Mettupalayam; use engine braking."],
    description: "Classic ascent into the oldest Nilgiri hill station.",
    bestTime: "Morning departure avoids afternoon mist.",
    viewpoints: ["Kallar", "Rangaswamy cliff glimpses"],
    nearbyStays: ["Silvertip Homestay", "Tea Estate Homestay"],
  },
  {
    slug: "coimbatore-ooty",
    title: "Coimbatore to Ooty",
    from: "Coimbatore",
    to: "Ooty",
    distance: "~86 km",
    travelTime: "3–3.5 hrs",
    bestStops: ["Coonoor", "Wellington"],
    foodStops: ["Coonoor bakeries", "Ooty chocolates"],
    restroomStop: "Coonoor town",
    cautions: ["Heavy weekend traffic on Ooty routes."],
    description: "Longer but scenic route via Coonoor.",
    bestTime: "Start before 8 AM on weekends.",
    viewpoints: ["Dolphin's Nose (detour)", "Sim's Park area"],
    nearbyStays: ["Kotagiri base (quieter)", "Ooty town hotels"],
  },
  {
    slug: "bangalore-ooty-mysore",
    title: "Bangalore to Ooty via Mysore",
    from: "Bangalore",
    to: "Ooty",
    distance: "~280 km",
    travelTime: "7–8 hrs",
    bestStops: ["Mysore Palace", "Bandipur edge"],
    foodStops: ["Mysore tiffin", "Gundlupet"],
    restroomStop: "Mysore highway plazas",
    cautions: ["Bandipur night driving restricted for wildlife."],
    description: "Two-day friendly route with Mysore stopover.",
    bestTime: "Split across two days; reach hills before dusk.",
    viewpoints: ["Mysore", "Masinagudi ghats"],
    nearbyStays: ["Mysore hotels", "Masinagudi camps"],
  },
  {
    slug: "mysore-masinagudi",
    title: "Mysore to Masinagudi",
    from: "Mysore",
    to: "Masinagudi",
    distance: "~95 km",
    travelTime: "2.5–3 hrs",
    bestStops: ["Bandipur safari gates", "Theppakadu"],
    foodStops: ["Gundlupet"],
    restroomStop: "Gundlupet town",
    cautions: ["Watch for wildlife on road at dawn/dusk."],
    description: "Gateway to Mudumalai and glamping stays.",
    bestTime: "Daylight hours only through forest stretch.",
    viewpoints: ["Moyar river views"],
    nearbyStays: ["Sunset Camping & Glamping"],
  },
  {
    slug: "kotagiri-coonoor",
    title: "Kotagiri to Coonoor",
    from: "Kotagiri",
    to: "Coonoor",
    distance: "~22 km",
    travelTime: "45–60 min",
    bestStops: ["Coonoor Road viewpoints", "Lamb's Rock (detour)"],
    foodStops: ["Coonoor bakeries"],
    restroomStop: "Coonoor town",
    cautions: ["Narrow bends; mist in evenings."],
    description: "Short hop between two quiet hill towns.",
    bestTime: "Clear mornings for views.",
    viewpoints: ["Lamb's Rock", "Dolphin's Nose"],
    nearbyStays: ["Kotagiri homestays"],
  },
  {
    slug: "kotagiri-kodanad",
    title: "Kotagiri to Kodanad",
    from: "Kotagiri",
    to: "Kodanad",
    distance: "~18 km",
    travelTime: "40–50 min",
    bestStops: ["Tea estates en route"],
    foodStops: ["Silvertip Cafe (Aravenu)"],
    restroomStop: "Kodanad viewpoint parking",
    cautions: ["Sunrise crowds on weekends."],
    description: "Popular sunrise panorama over the Moyar valley.",
    bestTime: "Leave by 5:30 AM for sunrise.",
    viewpoints: ["Kodanad Viewpoint"],
    nearbyStays: ["Aravenu homestays"],
  },
  {
    slug: "ooty-avalanche",
    title: "Ooty to Avalanche",
    from: "Ooty",
    to: "Avalanche",
    distance: "~28 km",
    travelTime: "1–1.5 hrs",
    bestStops: ["Emerald Dam area"],
    foodStops: ["Pack snacks — limited options"],
    restroomStop: "Ooty before departure",
    cautions: ["Forest permit may be required; check locally."],
    description: "Shola forest and reservoir — quiet alternative to Ooty crowds.",
    bestTime: "Weekday mornings.",
    viewpoints: ["Avalanche Lake", "Emerald reservoir"],
    nearbyStays: ["Ooty town", "Kotagiri (quieter base)"],
  },
];

export function getRouteBySlug(slug: string): RouteCard | null {
  return ROUTES.find((r) => r.slug === slug) ?? null;
}
