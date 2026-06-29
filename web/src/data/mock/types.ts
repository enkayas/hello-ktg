export type Category =
  | "stay"
  | "restaurant"
  | "viewpoint"
  | "experience"
  | "café"
  | "parking"
  | "fuel";

export type Stay = {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  bestFor: string;
  amenities: string[];
  tags: string[];
  image: string;
  whatsapp: string;
};

export type Restaurant = {
  id: string;
  name: string;
  location: string;
  knownFor: string;
  openNow: boolean;
  hours: string;
  tags: string[];
  image: string;
};

export type Place = {
  id: string;
  name: string;
  type: string;
  distance: string;
  bestTime: string;
  difficulty: string;
  familyFriendly: boolean;
  seniorFriendly: boolean;
  image: string;
  description: string;
};

export type HiddenGem = {
  id: string;
  name: string;
  category: string;
  description: string;
  badges: string[];
  image: string;
  distance: string;
};

export type NearbyItem = {
  id: string;
  name: string;
  category: Category;
  distance: string;
  bestFor: string;
  tags: string[];
  image: string;
  openNow?: boolean;
};

export type FeaturedPick = {
  id: string;
  kind: "Stay" | "Restaurant" | "Viewpoint" | "Experience";
  name: string;
  location: string;
  highlight: string;
  image: string;
  href: string;
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

export type TravellerIntent = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};
