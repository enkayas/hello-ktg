import type { GradientKey } from "@/lib/images";

export type NavKey =
  | "home"
  | "stay"
  | "eat"
  | "things"
  | "gems"
  | "plan"
  | "near"
  | "list";

export type StayItem = {
  id: string;
  name: string;
  where: string;
  dist: string;
  price: string;
  bestFor: string;
  amenities: string[];
  filters: string[];
  gradient: GradientKey;
  image: string;
  whatsapp?: string;
  slug?: string;
};

export type EatItem = {
  id: string;
  name: string;
  where: string;
  knownFor: string;
  open: boolean;
  status: string;
  tags: string[];
  filters: string[];
  gradient: GradientKey;
  image: string;
};

export type NearItem = {
  id: string;
  name: string;
  category: string;
  cat: "Food" | "Stays" | "Viewpoints" | "Cafés";
  dist: string;
  bestFor: string;
  open: boolean;
  tags: string[];
  gradient: GradientKey;
  image: string;
};

export type ThingItem = {
  id: string;
  name: string;
  type: string;
  dist: string;
  bestTime: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "No walk";
  suits: string;
  filters: string[];
  gradient: GradientKey;
  image: string;
};

export type GemCollection = {
  id: string;
  title: string;
  badge: string;
  story: string;
  count: number;
  curator: string;
  role: string;
  initial: string;
  gradient: GradientKey;
};

export type PlanStop = { time: string; title: string; note: string };
export type PlanDay = { title: string; stops: PlanStop[] };

export type CarouselSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  gradient: GradientKey;
};

export type IntentTile = {
  id: string;
  label: string;
  desc: string;
  href: string;
  gradient: GradientKey;
  icon: "family" | "couple" | "food" | "gem" | "work" | "weekend";
};

export type FeaturedPick = {
  id: string;
  kind: string;
  name: string;
  where: string;
  dist: string;
  bestFor: string;
  price: string;
  tags: string[];
  gradient: GradientKey;
  image: string;
  href: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  per: string;
  tagline: string;
  popular: boolean;
  features: string[];
  cta: string;
  variant: "outline" | "primary" | "gold";
};

export type Benefit = {
  id: string;
  title: string;
  desc: string;
  icon: "pin" | "chat" | "star" | "badge" | "target" | "chart";
};
