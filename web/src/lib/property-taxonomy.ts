export const PROPERTY_TYPES = [
  "Homestay",
  "Resort",
  "Estate",
  "Villa",
  "Camping",
  "B&B",
  "Hotel",
] as const;

export const UNIT_TYPES = [
  { value: "room", labelEn: "Room", labelTa: "அறை" },
  { value: "villa", labelEn: "Villa", labelTa: "வில்லா" },
  { value: "cottage", labelEn: "Cottage", labelTa: "குடிசை" },
  { value: "tent", labelEn: "Tent / Camping", labelTa: "கூடாரம்" },
  { value: "dome", labelEn: "Dome", labelTa: "குவிமாடம்" },
  { value: "suite", labelEn: "Suite", labelTa: "சூட்" },
  { value: "cabin", labelEn: "Cabin", labelTa: "கேபின்" },
  { value: "dormitory", labelEn: "Dormitory", labelTa: "தங்கும் அறை" },
  { value: "other", labelEn: "Other", labelTa: "மற்றவை" },
] as const;

export type UnitTypeValue = (typeof UNIT_TYPES)[number]["value"];

export function unitTypeLabel(value: string, locale: "en" | "ta"): string {
  const row = UNIT_TYPES.find((u) => u.value === value);
  if (!row) return value;
  return locale === "ta" ? row.labelTa : row.labelEn;
}
