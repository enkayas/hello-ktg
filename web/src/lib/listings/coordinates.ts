/** Mock coordinates for Nilgiris listings (approximate). */

export type LatLng = { latitude: number; longitude: number };

const KOTAGIRI: LatLng = { latitude: 11.4204, longitude: 76.8654 };

export const LISTING_COORDINATES: Record<string, LatLng> = {
  // Restaurants
  "silvertip-cafe": { latitude: 11.4212, longitude: 76.8648 },
  select: { latitude: 11.4205, longitude: 76.866 },
  dosapoint: { latitude: 11.4208, longitude: 76.8658 },
  hobbit: { latitude: 11.419, longitude: 76.8685 },
  badaga: { latitude: 11.4185, longitude: 76.867 },
  crown: { latitude: 11.4215, longitude: 76.864 },

  // Places / things
  kodanad: { latitude: 11.4489, longitude: 76.8936 },
  catherine: { latitude: 11.464, longitude: 76.7858 },
  longwood: { latitude: 11.454, longitude: 76.842 },
  sullivan: { latitude: 11.412, longitude: 76.872 },
  rangaswamy: { latitude: 11.478, longitude: 76.812 },
  "tea-drive": { latitude: 11.425, longitude: 76.858 },
  mudumalai: { latitude: 11.56, longitude: 76.52 },
  "catherine-trek": { latitude: 11.464, longitude: 76.7858 },

  // Hidden gems
  "elk-view": { latitude: 11.458, longitude: 76.79 },
  kookal: { latitude: 11.44, longitude: 76.88 },
  "tea-valley": { latitude: 11.428, longitude: 76.855 },
  "rainy-cafe": { latitude: 11.4209, longitude: 76.8656 },
  bakery: { latitude: 11.421, longitude: 76.8665 },
  "photo-spot": { latitude: 11.445, longitude: 76.89 },
  "short-route": { latitude: 11.454, longitude: 76.842 },
  "sunset-ledge": { latitude: 11.415, longitude: 76.852 },
};

export function coordsFor(id: string): LatLng {
  return LISTING_COORDINATES[id] ?? KOTAGIRI;
}
