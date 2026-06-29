import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendations";
import { getAllListings } from "@/lib/listings/catalog";
import { plans, planBaseKey } from "@/data/handoff";

type PlanPayload = {
  base: string;
  summary: string;
  days: {
    day: number;
    title: string;
    stops: { time: string; title: string; note: string }[];
  }[];
  foodSuggestions: string[];
  staySuggestions: string[];
  gemSuggestions: string[];
  cautionNotes: string[];
  responsibleTravel: string[];
};

function buildRuleBasedPlan(
  days: number,
  base: string,
  travellerType: string,
  interests: string[],
  budget: string,
  weather: "Sunny" | "Rainy" | "Misty",
  timeOfDay: "Morning" | "Afternoon" | "Evening",
): PlanPayload {
  const recs = getRecommendations({
    travellerType,
    interests,
    baseLocation: base,
    weather,
    timeOfDay,
  });

  const key = planBaseKey[base] ?? "kotagiri";
  const src = plans[key] ?? plans.kotagiri;
  const itineraryDays = Array.from({ length: days }, (_, i) => {
    const d = src[i % src.length];
    return {
      day: i + 1,
      title: d.title,
      stops: d.stops,
    };
  });

  return {
    base,
    summary: `${days} days · ${base} · ${travellerType} · ${budget}`,
    days: itineraryDays,
    foodSuggestions: recs.food.map((f) => f.name),
    staySuggestions: recs.stays.map((s) => s.name),
    gemSuggestions: recs.places
      .filter((p) => p.kind === "hidden_gem")
      .map((g) => g.name),
    cautionNotes: recs.cautions,
    responsibleTravel: [
      "Carry your litter back — shola forests are fragile.",
      "Ask before photographing local residents or private estates.",
      "Stick to marked paths; do not enter restricted plantation areas.",
      "Do not trek unmarked forest trails at night or in heavy rain.",
    ],
  };
}

async function tryOpenAiPlan(
  input: [
    number,
    string,
    string,
    string[],
    string,
    "Sunny" | "Rainy" | "Misty",
    "Morning" | "Afternoon" | "Evening",
  ],
): Promise<PlanPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const [days, base, travellerType, interests, budget, weather] = input;
  const listings = getAllListings()
    .slice(0, 20)
    .map((l) => `${l.name} (${l.kind}, ${l.locationName})`)
    .join("; ");

  const prompt = `You are a Nilgiri hills travel planner for Kotagiri, Ooty, Coonoor.
Create a ${days}-day itinerary for ${travellerType} travellers based in ${base}.
Interests: ${interests.join(", ")}. Weather: ${weather}. Budget: ${budget}.
Use ONLY these real places where possible: ${listings}.
Return strict JSON: { "days": [{ "day": 1, "title": "...", "stops": [{ "time": "8:00 AM", "title": "...", "note": "..." }] }], "cautionNotes": ["..."], "foodSuggestions": ["..."], "staySuggestions": ["..."], "gemSuggestions": ["..."] }
Never invent unsafe trails or private estate access. Include road/weather cautions.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as Partial<PlanPayload>;
    const fallback = buildRuleBasedPlan(...input);
    return {
      base,
      summary: `${days} days · ${base} · ${travellerType} · ${budget}`,
      days: parsed.days ?? fallback.days,
      foodSuggestions: parsed.foodSuggestions ?? fallback.foodSuggestions,
      staySuggestions: parsed.staySuggestions ?? fallback.staySuggestions,
      gemSuggestions: parsed.gemSuggestions ?? fallback.gemSuggestions,
      cautionNotes: parsed.cautionNotes ?? fallback.cautionNotes,
      responsibleTravel: fallback.responsibleTravel,
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const days = Math.min(5, Math.max(1, Number(body.days) || 2));
  const base = String(body.baseLocation || body.base || "Kotagiri");
  const travellerType = String(body.travellerType || "Family");
  const interests: string[] = Array.isArray(body.interests)
    ? body.interests
    : ["Nature", "Food"];
  const budget = String(body.budget || "Mid-range");
  const weather = (body.weather as "Sunny" | "Rainy" | "Misty") || "Sunny";
  const timeOfDay =
    (body.timeOfDay as "Morning" | "Afternoon" | "Evening") || "Morning";

  const args: [
    number,
    string,
    string,
    string[],
    string,
    "Sunny" | "Rainy" | "Misty",
    "Morning" | "Afternoon" | "Evening",
  ] = [days, base, travellerType, interests, budget, weather, timeOfDay];
  const aiPlan = await tryOpenAiPlan(args);
  const plan = aiPlan ?? buildRuleBasedPlan(...args);

  return NextResponse.json(plan);
}
