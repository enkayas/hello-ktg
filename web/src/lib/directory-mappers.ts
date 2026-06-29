import type { EatItem, ThingItem } from "@/data/handoff/types";
import type { HiddenGemListing } from "@/lib/listings/types";
import type {
  PublishedHiddenGem,
  PublishedPlace,
  PublishedRestaurant,
} from "@/lib/queries";
import { images } from "@/lib/images";

const DEFAULT_FOOD_IMG =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80";

export function mapRestaurantToEatItem(r: PublishedRestaurant): EatItem {
  const id = r.slug ?? r.id;
  return {
    id,
    name: r.name,
    where: r.area ?? "Kotagiri",
    knownFor: r.cuisine ?? r.description ?? "local food",
    open: true,
    status: "Open now",
    tags: [r.cuisine ?? "Restaurant", "Verified"],
    filters: r.cuisine ? [r.cuisine] : ["Family Friendly"],
    gradient: "steel",
    image: r.image_url ?? DEFAULT_FOOD_IMG,
  };
}

export function mapPlaceToThingItem(p: PublishedPlace): ThingItem {
  const id = p.slug ?? p.id;
  const difficulty = (["Easy", "Moderate", "Hard", "No walk"] as const).includes(
    p.difficulty as ThingItem["difficulty"],
  )
    ? (p.difficulty as ThingItem["difficulty"])
    : "Easy";
  return {
    id,
    name: p.name,
    type: p.place_type ?? "Experience",
    dist: p.area ?? "Kotagiri",
    bestTime: p.best_time ?? "Daytime",
    difficulty,
    suits: p.suits ?? "All ages",
    filters: p.filters?.length ? p.filters : ["Nature"],
    gradient: "steel",
    image: p.image_url ?? images.kodanad,
  };
}

export function mapHiddenGemRow(g: PublishedHiddenGem): HiddenGemListing {
  const slug = g.slug ?? g.id;
  return {
    id: g.id,
    slug,
    name: g.name,
    category: "Hidden Gem",
    subcategory: g.category ?? undefined,
    description: g.description ?? g.name,
    shortDescription: g.category ?? "Hidden Gem",
    locationName: g.distance_label ?? "Kotagiri",
    latitude: g.latitude ?? 11.42,
    longitude: g.longitude ?? 76.87,
    images: [g.image_url ?? DEFAULT_FOOD_IMG],
    tags: g.badges ?? [],
    badges: (g.badges ?? []) as HiddenGemListing["badges"],
    bestFor: g.category ?? "exploration",
    whatsapp: g.host_phone ?? "919962541214",
    isVerified: true,
    isFeatured: !!g.is_featured,
    highlights: g.badges ?? [],
    amenities: [],
    notes: {},
    kind: "hidden_gem",
  };
}
