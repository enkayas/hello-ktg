/** Unified listing types — mock today, Supabase-ready in Phase 3. */

export type BadgeType =
  | "Local Pick"
  | "Guide Recommended"
  | "Hidden Gem"
  | "Best Morning"
  | "Photography"
  | "Good for Families"
  | "Workcation"
  | "Verified"
  | "Featured";

export type ListingKind = "stay" | "restaurant" | "place" | "hidden_gem";

export type ListingNotes = {
  parking?: string;
  walkingDifficulty?: string;
  seniorFriendly?: boolean;
  kidFriendly?: boolean;
  weatherCaution?: string;
};

export type BusinessListing = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  locationName: string;
  latitude: number;
  longitude: number;
  images: string[];
  tags: string[];
  badges: BadgeType[];
  bestFor: string;
  openingHours?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  priceRange?: string;
  isVerified: boolean;
  isFeatured: boolean;
  highlights: string[];
  amenities: string[];
  notes: ListingNotes;
  kind: ListingKind;
  gradient?: string;
};

export type StayListing = BusinessListing & { kind: "stay"; priceLabel?: string };
export type RestaurantListing = BusinessListing & { kind: "restaurant"; openNow?: boolean };
export type PlaceListing = BusinessListing & {
  kind: "place";
  difficulty?: string;
  bestTime?: string;
};
export type HiddenGemListing = BusinessListing & { kind: "hidden_gem" };

export type AnyListing =
  | StayListing
  | RestaurantListing
  | PlaceListing
  | HiddenGemListing;

export type TravellerProfile = {
  type: string;
  interests: string[];
  baseLocation: string;
  budget: string;
  days: number;
};

export type ItineraryDay = {
  day: number;
  title: string;
  stops: { time: string; title: string; note: string }[];
};

export type Itinerary = {
  base: string;
  summary: string;
  days: ItineraryDay[];
  foodSuggestions: string[];
  staySuggestions: string[];
  gemSuggestions: string[];
  cautionNotes: string[];
};

export type BusinessPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type SavedItemRef = {
  kind: ListingKind | "stay";
  slug: string;
  savedAt: string;
};
