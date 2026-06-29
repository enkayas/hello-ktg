"use client";

import { useState } from "react";
import Button from "./Button";

const destinations = ["Kotagiri", "Ooty", "Coonoor", "Gudalur", "Masinagudi"];
const travellerTypes = ["Family", "Couple", "Friends", "Senior Citizens", "Solo"];
const interests = [
  "Nature",
  "Food",
  "Relaxation",
  "Adventure",
  "Workcation",
  "Photography",
];
const budgets = ["Budget", "Mid-range", "Premium"];

const mockItinerary = {
  Family: [
    { day: 1, title: "Arrive & settle in", items: ["Check into family-friendly homestay", "Evening walk at Longwood Shola", "Dinner at Silvertip Cafe"] },
    { day: 2, title: "Waterfalls & viewpoints", items: ["Morning: Catherine Falls", "Lunch in town", "Kodanad View Point at sunset"] },
    { day: 3, title: "Tea & departure", items: ["Tea estate drive", "Johnston Square bakery stop", "Depart with local tea"] },
  ],
  Couple: [
    { day: 1, title: "Quiet arrival", items: ["Secluded cottage check-in", "Sunset at Moon Road ledge", "Candlelit dinner at Hobbit Garden"] },
    { day: 2, title: "Scenic day", items: ["Kodanad sunrise", "Mountain Brew Café", "Tea valley drive"] },
  ],
};

export default function TripPlannerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [travellerType, setTravellerType] = useState("Family");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Nature", "Food"]);

  function toggleInterest(i: string) {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const preview =
    mockItinerary[travellerType as keyof typeof mockItinerary] ??
    mockItinerary.Family;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-cloud bg-white p-6 shadow-sm md:p-8"
      >
        <h2 className="font-serif text-xl font-semibold text-primary">
          Tell us about your trip
        </h2>
        <p className="mt-2 text-sm text-charcoal/60">
          We&apos;ll suggest a personalised Nilgiris itinerary (mock preview for now).
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-charcoal">Starting city</span>
            <input
              type="text"
              placeholder="e.g. Bangalore, Coimbatore"
              className="mt-1.5 w-full rounded-xl border border-cloud bg-mist/50 px-4 py-3 text-sm outline-none transition focus:border-tea focus:ring-2 focus:ring-tea/20"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-charcoal">Destination base</span>
            <select className="mt-1.5 w-full rounded-xl border border-cloud bg-mist/50 px-4 py-3 text-sm outline-none focus:border-tea focus:ring-2 focus:ring-tea/20">
              {destinations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-charcoal">Number of days</span>
            <input
              type="number"
              min={1}
              max={14}
              defaultValue={3}
              className="mt-1.5 w-full rounded-xl border border-cloud bg-mist/50 px-4 py-3 text-sm outline-none focus:border-tea focus:ring-2 focus:ring-tea/20"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-charcoal">Traveller type</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {travellerTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTravellerType(t)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    travellerType === t
                      ? "bg-primary text-white"
                      : "border border-cloud bg-white text-charcoal/80 hover:border-tea/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-charcoal">Interests</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedInterests.includes(i)
                      ? "bg-tea text-white"
                      : "border border-cloud bg-white text-charcoal/80 hover:border-tea/40"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-charcoal">Budget</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {budgets.map((b) => (
                <label
                  key={b}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud px-4 py-2 text-sm has-[:checked]:border-tea has-[:checked]:bg-tea/10"
                >
                  <input type="radio" name="budget" defaultChecked={b === "Mid-range"} />
                  {b}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <Button type="submit" variant="gold" className="mt-8 w-full">
          Generate My Plan
        </Button>
      </form>

      <div className="rounded-2xl border border-cloud bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-xl font-semibold text-primary">
          {submitted ? "Your suggested itinerary" : "Sample itinerary preview"}
        </h2>
        <p className="mt-2 text-sm text-charcoal/60">
          {submitted
            ? `Tailored for ${travellerType.toLowerCase()} travellers · ${selectedInterests.join(", ")}`
            : "Fill the form and tap Generate to see a mock plan."}
        </p>

        <div className="mt-6 space-y-6">
          {preview.map((day) => (
            <div key={day.day} className="border-l-2 border-gold pl-5">
              <p className="text-xs font-bold uppercase tracking-wide text-tea">
                Day {day.day}
              </p>
              <h3 className="font-serif text-lg font-semibold text-primary">
                {day.title}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {day.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-charcoal/70">
                    <span className="text-gold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {submitted ? (
          <p className="mt-6 rounded-xl bg-mist p-4 text-sm text-charcoal/70">
            Phase 2: AI-powered itineraries with real distances, weather and booking links.
          </p>
        ) : null}
      </div>
    </div>
  );
}
