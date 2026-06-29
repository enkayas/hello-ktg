import type { MetadataRoute } from "next";
import { eatItems, things } from "@/data/handoff";
import { getAllHiddenGems } from "@/lib/listings/catalog";
import { ROUTES } from "@/lib/routes-data";
import {
  getPublishedHiddenGems,
  getPublishedPlaces,
  getPublishedRestaurants,
  getPublishedStays,
} from "@/lib/queries";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hellokotagiri.com";

function entry(
  path: string,
  priority: number,
  freq: "weekly" | "monthly" = "weekly",
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/stay",
    "/eat",
    "/things-to-do",
    "/hidden-gems",
    "/near-me",
    "/plan-my-trip",
    "/saved",
    "/routes",
    "/contact",
    "/privacy",
    "/terms",
    "/responsible-travel",
  ].map((p, i) => entry(p, i === 0 ? 1 : 0.8));

  const stays = await getPublishedStays();
  const stayUrls = stays.map((s) => entry(`/stays/${s.slug}`, 0.7));

  const restaurants = await getPublishedRestaurants();
  const eatSlugs =
    restaurants.length > 0
      ? restaurants.map((r) => r.slug ?? r.id)
      : eatItems.map((e) => e.id);
  const eatUrls = eatSlugs.map((slug) => entry(`/eat/${slug}`, 0.7));

  const places = await getPublishedPlaces();
  const thingSlugs =
    places.length > 0 ? places.map((p) => p.slug ?? p.id) : things.map((t) => t.id);
  const thingUrls = thingSlugs.map((slug) => entry(`/things-to-do/${slug}`, 0.7));

  const gemsDb = await getPublishedHiddenGems();
  const gemSlugs =
    gemsDb.length > 0
      ? gemsDb.map((g) => g.slug ?? g.id)
      : getAllHiddenGems().map((g) => g.slug);
  const gemUrls = gemSlugs.map((slug) => entry(`/hidden-gems/${slug}`, 0.6, "monthly"));

  const routeUrls = ROUTES.map((r) => entry(`/routes/${r.slug}`, 0.5, "monthly"));

  return [
    ...staticPages,
    ...stayUrls,
    ...eatUrls,
    ...thingUrls,
    ...gemUrls,
    ...routeUrls,
  ];
}
