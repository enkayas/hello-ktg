export type Coordinates = { latitude: number; longitude: number };

export type BaseLocationId =
  | "kotagiri"
  | "ooty"
  | "coonoor"
  | "gudalur"
  | "masinagudi"
  | "coonoor-road"
  | "aravenu"
  | "kodanad";

export type BaseLocation = {
  id: BaseLocationId;
  label: string;
} & Coordinates;

/** Approximate town centres in the Nilgiris (mock reference points). */
export const BASE_LOCATIONS: BaseLocation[] = [
  { id: "kotagiri", label: "Kotagiri", latitude: 11.4204, longitude: 76.8654 },
  { id: "ooty", label: "Ooty", latitude: 11.4102, longitude: 76.695 },
  { id: "coonoor", label: "Coonoor", latitude: 11.353, longitude: 76.793 },
  { id: "gudalur", label: "Gudalur", latitude: 11.5012, longitude: 76.4934 },
  { id: "masinagudi", label: "Masinagudi", latitude: 11.5612, longitude: 76.6412 },
  { id: "coonoor-road", label: "Coonoor Road", latitude: 11.385, longitude: 76.82 },
  { id: "aravenu", label: "Aravenu", latitude: 11.448, longitude: 76.84 },
  { id: "kodanad", label: "Kodanad", latitude: 11.392, longitude: 76.918 },
];

export const DEFAULT_BASE = BASE_LOCATIONS[0];

export function getBaseById(id: string): BaseLocation {
  return BASE_LOCATIONS.find((b) => b.id === id) ?? DEFAULT_BASE;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance in kilometres (Haversine). */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
