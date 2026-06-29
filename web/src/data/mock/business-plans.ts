import type { BusinessPlan, FeaturedPick, TravellerIntent } from "./types";

export const businessPlans: BusinessPlan[] = [
  {
    id: "free",
    name: "Free Listing",
    price: "₹0",
    period: "forever",
    description: "Get discovered by travellers exploring the Nilgiris.",
    features: [
      "Basic business profile",
      "Location on map (Phase 2)",
      "WhatsApp enquiry button",
      "Up to 3 photos",
    ],
  },
  {
    id: "verified",
    name: "Verified Listing",
    price: "₹999",
    period: "/ month",
    description: "Build trust with a verified badge and better placement.",
    features: [
      "Everything in Free",
      "Verified badge after visit",
      "Priority in Near Me results",
      "Up to 10 photos",
      "Monthly enquiry stats",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium Partner",
    price: "₹2,499",
    period: "/ month",
    description: "Maximum visibility across intent-based discovery.",
    features: [
      "Everything in Verified",
      "Featured on homepage",
      "Traveller intent matching",
      "Trip planner recommendations",
      "Analytics dashboard (Phase 2)",
      "Dedicated support",
    ],
  },
];

export const travellerIntents: TravellerIntent[] = [
  {
    id: "family",
    title: "Family Trips",
    description: "Kid-friendly stays, easy viewpoints & safe dining",
    icon: "👨‍👩‍👧‍👦",
    href: "/stay?family=family",
  },
  {
    id: "couple",
    title: "Couple Getaways",
    description: "Quiet cottages, sunset spots & cosy cafés",
    icon: "💑",
    href: "/stay?intent=couple",
  },
  {
    id: "food",
    title: "Food & Cafés",
    description: "Local flavours, estate tea & hill-station bakeries",
    icon: "☕",
    href: "/eat",
  },
  {
    id: "hidden",
    title: "Hidden Gems",
    description: "Curated spots locals actually visit",
    icon: "✨",
    href: "/hidden-gems",
  },
  {
    id: "workcation",
    title: "Workcation",
    description: "Wi-Fi stays, quiet cafés & scenic drives",
    icon: "💻",
    href: "/stay?intent=workcation",
  },
  {
    id: "weekend",
    title: "Weekend Plans",
    description: "2-day itineraries from Bangalore & Coimbatore",
    icon: "🗓",
    href: "/plan-my-trip",
  },
];

export const featuredPicks: FeaturedPick[] = [
  {
    id: "fp1",
    kind: "Stay",
    name: "Silvertip Homestay",
    location: "Aravenu",
    highlight: "Tea-estate suites · workcation friendly",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    href: "/stay",
  },
  {
    id: "fp2",
    kind: "Restaurant",
    name: "Silvertip Cafe",
    location: "Aravenu",
    highlight: "Estate tea & garden seating",
    image: "https://images.unsplash.com/photo-1495474473367-a7fedd892b71?w=800&q=80",
    href: "/eat",
  },
  {
    id: "fp3",
    kind: "Viewpoint",
    name: "Kodanad View Point",
    location: "18 km from Kotagiri",
    highlight: "Sunrise panorama over Moyar valley",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodanad.jpg?width=900",
    href: "/things-to-do",
  },
  {
    id: "fp4",
    kind: "Experience",
    name: "Shola Birding Walk",
    location: "Longwood Shola",
    highlight: "Naturalist-led · 100+ species",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nilgiri_Flycatcher_by_N.A._Naseer.jpg?width=900",
    href: "/things-to-do",
  },
];

export const businessBenefits = [
  "Location-aware discovery",
  "WhatsApp leads",
  "Featured placement",
  "Verified badge",
  "Traveller intent matching",
  "Analytics-ready (Phase 2)",
];
