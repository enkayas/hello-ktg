import { eatItems, things } from "@/data/handoff";
import { hiddenGems } from "@/data/mock/hidden-gems";
import type {
  AnyListing,
  BadgeType,
  HiddenGemListing,
  ListingNotes,
  PlaceListing,
  RestaurantListing,
} from "./types";
import { coordsFor } from "./coordinates";
import { haversineKm } from "@/lib/geo";

const DEFAULT_WHATSAPP = "919962541214";

function notesFromFilters(
  filters: string[],
  difficulty?: string,
): ListingNotes {
  const senior = filters.some((f) => f.includes("Senior"));
  const family = filters.some((f) => f.includes("Family"));
  return {
    parking: filters.includes("Parking") ? "Parking available nearby" : undefined,
    walkingDifficulty: difficulty,
    seniorFriendly: senior || difficulty === "Easy" || difficulty === "No walk",
    kidFriendly: family,
    weatherCaution:
      difficulty === "Hard"
        ? "Check weather before trekking; avoid monsoon trail sections."
        : undefined,
  };
}

function buildRestaurant(item: (typeof eatItems)[0]): RestaurantListing {
  const c = coordsFor(item.id);
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    category: "Restaurant",
    subcategory: item.filters[0],
    description: `${item.name} in ${item.where}. Known for ${item.knownFor}. A local favourite on the HelloKotagiri curated eat list.`,
    shortDescription: item.knownFor,
    locationName: item.where,
    latitude: c.latitude,
    longitude: c.longitude,
    images: [item.image],
    tags: item.tags,
    badges: item.open ? (["Local Pick"] as BadgeType[]) : [],
    bestFor: item.knownFor.split(",")[0] ?? "dining",
    openingHours: item.status,
    whatsapp: DEFAULT_WHATSAPP,
    priceRange: "₹₹",
    isVerified: true,
    isFeatured: item.id === "silvertip-cafe",
    highlights: item.tags.slice(0, 4),
    amenities: item.filters,
    notes: { kidFriendly: item.filters.includes("Family Friendly") },
    kind: "restaurant",
    openNow: item.open,
    gradient: item.gradient,
  };
}

function buildPlace(item: (typeof things)[0]): PlaceListing {
  const c = coordsFor(item.id);
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    category: "Experience",
    subcategory: item.type,
    description: `${item.name} — ${item.type} in the Nilgiris. Best visited ${item.bestTime.toLowerCase()}. Suits ${item.suits.toLowerCase()}.`,
    shortDescription: `${item.type} · ${item.dist}`,
    locationName: item.dist,
    latitude: c.latitude,
    longitude: c.longitude,
    images: [item.image],
    tags: item.filters,
    badges: item.filters.includes("Nature")
      ? (["Guide Recommended"] as BadgeType[])
      : (["Local Pick"] as BadgeType[]),
    bestFor: item.suits,
    whatsapp: DEFAULT_WHATSAPP,
    priceRange: item.type.includes("₹") ? item.type : "Free–₹₹",
    isVerified: true,
    isFeatured: ["kodanad", "catherine", "longwood"].includes(item.id),
    highlights: [item.bestTime, item.difficulty, ...item.filters.slice(0, 2)],
    amenities: item.filters,
    notes: notesFromFilters(item.filters, item.difficulty),
    kind: "place",
    difficulty: item.difficulty,
    bestTime: item.bestTime,
    gradient: item.gradient,
  };
}

function buildGem(gem: (typeof hiddenGems)[0]): HiddenGemListing {
  const c = coordsFor(gem.id);
  return {
    id: gem.id,
    slug: gem.id,
    name: gem.name,
    category: "Hidden Gem",
    subcategory: gem.category,
    description: gem.description,
    shortDescription: gem.category,
    locationName: gem.distance,
    latitude: c.latitude,
    longitude: c.longitude,
    images: [gem.image],
    tags: gem.badges,
    badges: gem.badges as BadgeType[],
    bestFor: gem.category,
    whatsapp: DEFAULT_WHATSAPP,
    isVerified: false,
    isFeatured: false,
    highlights: gem.badges,
    amenities: [],
    notes: {
      weatherCaution: gem.category.toLowerCase().includes("viewpoint")
        ? "Mist and low visibility common in monsoon mornings."
        : undefined,
    },
    kind: "hidden_gem",
  };
}

const restaurants: RestaurantListing[] = eatItems.map(buildRestaurant);
const places: PlaceListing[] = things.map(buildPlace);
const gems: HiddenGemListing[] = hiddenGems.map(buildGem);

const all: AnyListing[] = [...restaurants, ...places, ...gems];

export function getAllListings(): AnyListing[] {
  return all;
}

export function getRestaurantBySlug(slug: string): RestaurantListing | null {
  return restaurants.find((r) => r.slug === slug) ?? null;
}

export function getPlaceBySlug(slug: string): PlaceListing | null {
  return places.find((p) => p.slug === slug) ?? null;
}

export function getHiddenGemBySlug(slug: string): HiddenGemListing | null {
  return gems.find((g) => g.slug === slug) ?? null;
}

export function getListingBySlug(
  slug: string,
  kind?: AnyListing["kind"],
): AnyListing | null {
  if (kind === "restaurant") return getRestaurantBySlug(slug);
  if (kind === "place") return getPlaceBySlug(slug);
  if (kind === "hidden_gem") return getHiddenGemBySlug(slug);
  return (
    getRestaurantBySlug(slug) ??
    getPlaceBySlug(slug) ??
    getHiddenGemBySlug(slug)
  );
}

export function getAllHiddenGems(): HiddenGemListing[] {
  return gems;
}


export function getNearbyFromCatalog(
  lat: number,
  lng: number,
  limit = 4,
): AnyListing[] {
  return [...all]
    .map((item) => ({
      item,
      km: haversineKm(
        { latitude: lat, longitude: lng },
        { latitude: item.latitude, longitude: item.longitude },
      ),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map((x) => x.item);
}
