#!/usr/bin/env node
/**
 * Smoke test — run: cd web && npm run smoke
 */
const BASE = process.env.BASE_URL ?? "https://hellokotagiri.com";

const HUB_PAGES = [
  "/",
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
  "/sitemap.xml",
];

let failed = 0;

function log(ok, status, label) {
  console.log(`${ok ? "OK" : "FAIL"} ${status} ${label}`);
  if (!ok) failed++;
}

async function check(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const ok = res.status >= 200 && res.status < 400;
  log(ok, res.status, path);
  return res;
}

async function detailLinksFrom(hubPath, prefix) {
  const res = await fetch(`${BASE}${hubPath}`);
  if (!res.ok) return [];
  const html = await res.text();
  const re = new RegExp(`href="(${prefix}[^"]+)"`, "g");
  const links = new Set();
  let m;
  while ((m = re.exec(html)) !== null) links.add(m[1]);
  return [...links];
}

async function checkDetailPage(link) {
  const res = await fetch(`${BASE}${link}`);
  const body = await res.text();
  const has404 = />404<|This page could not be found/.test(body);
  const ok = res.status === 200 && !has404;
  log(ok, res.status, link + (has404 ? " (404 UI)" : ""));
}

console.log("=== Hub pages ===");
for (const path of HUB_PAGES) await check(path);

console.log("\n=== View Details links ===");
const hubs = [
  ["/eat", "/eat/"],
  ["/stay", "/stays/"],
  ["/things-to-do", "/things-to-do/"],
  ["/hidden-gems", "/hidden-gems/"],
];

for (const [hub, prefix] of hubs) {
  const links = await detailLinksFrom(hub, prefix);
  console.log(`  ${hub}: ${links.length} links`);
  for (const link of links) await checkDetailPage(link);
}

console.log("\n=== APIs ===");
const planRes = await fetch(`${BASE}/api/plan-trip`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    days: 1,
    baseLocation: "Kotagiri",
    travellerType: "Family",
    interests: ["Food"],
  }),
});
const planJson = planRes.ok ? await planRes.json() : null;
log(!!(planRes.ok && planJson?.days?.length), planRes.status, "POST /api/plan-trip");

const leadsRes = await fetch(`${BASE}/api/leads`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ listingId: "test", listingType: "restaurant", actionType: "whatsapp" }),
});
const leadsJson = leadsRes.ok ? await leadsRes.json() : null;
log(!!(leadsRes.ok && leadsJson?.ok), leadsRes.status, "POST /api/leads");

console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
process.exit(failed > 0 ? 1 : 0);
