import type { AnyListing } from "@/lib/listings/types";
import {
  getAllHiddenGems,
  getAllListings,
} from "@/lib/listings/catalog";

export type RecommendationInput = {
  travellerType: string;
  interests: string[];
  baseLocation: string;
  weather: "Sunny" | "Rainy" | "Misty";
  timeOfDay: "Morning" | "Afternoon" | "Evening";
};

export type RecommendationResult = {
  places: AnyListing[];
  food: AnyListing[];
  stays: AnyListing[];
  cautions: string[];
};

function score(listing: AnyListing, input: RecommendationInput): number {
  let s = 0;
  const tags = listing.tags.join(" ").toLowerCase();
  const name = listing.name.toLowerCase();

  if (input.interests.some((i) => i.toLowerCase() === "food") && listing.kind === "restaurant") {
    s += 10;
  }
  if (input.interests.some((i) => i.toLowerCase() === "nature") && tags.includes("nature")) {
    s += 8;
  }
  if (input.travellerType.includes("Senior")) {
    if (listing.notes.seniorFriendly) s += 6;
    if (listing.notes.walkingDifficulty === "Hard") s -= 10;
    if (listing.notes.parking) s += 3;
  }
  if (input.travellerType.includes("Family")) {
    if (listing.notes.kidFriendly) s += 5;
    if (tags.includes("family")) s += 4;
  }
  if (input.weather === "Rainy") {
    if (tags.includes("waterfall") || name.includes("falls")) s -= 8;
    if (listing.kind === "restaurant" || tags.includes("café")) s += 6;
    if (listing.kind === "hidden_gem" && tags.includes("rainy")) s += 5;
  }
  if (input.timeOfDay === "Evening") {
    if (tags.includes("sunset") || name.includes("sunset")) s += 7;
    if (listing.kind === "restaurant") s += 4;
  }
  if (listing.isFeatured) s += 2;
  return s;
}

export function getRecommendations(input: RecommendationInput): RecommendationResult {
  const all = getAllListings();
  const ranked = [...all].sort((a, b) => score(b, input) - score(a, input));

  const places = ranked.filter((l) => l.kind === "place").slice(0, 4);
  const food = ranked.filter((l) => l.kind === "restaurant").slice(0, 3);
  const stays = ranked.filter((l) => l.kind === "stay").slice(0, 2);
  const gems = getAllHiddenGems().slice(0, 2);

  const cautions: string[] = [];
  if (input.weather === "Rainy") {
    cautions.push("Skip waterfall treks and slippery forest trails in heavy rain.");
    cautions.push("Tea shops and estate cafés are better rainy-day picks.");
  }
  if (input.travellerType.includes("Senior")) {
    cautions.push("Prefer viewpoints with parking and short walks from the road.");
  }
  if (input.timeOfDay === "Evening") {
    cautions.push("Nilgiri roads get foggy after sunset — plan drives before dark.");
  }
  cautions.push("Private estate roads may be closed without notice — ask locals first.");

  return {
    places: [...places, ...gems],
    food,
    stays,
    cautions,
  };
}
