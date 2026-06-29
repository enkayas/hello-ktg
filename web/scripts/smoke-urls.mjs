#!/usr/bin/env node
/**
 * Smoke test — run against production or local: BASE_URL=https://hellokotagiri.com node scripts/smoke-urls.mjs
 */
const BASE = process.env.BASE_URL ?? "https://hellokotagiri.com";

const urls = [
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
  "/eat/silvertip-cafe",
  "/things-to-do/kodanad",
  "/hidden-gems/elk-view",
  "/stays/silvertip-homestay",
  "/routes/coimbatore-kotagiri",
];

let failed = 0;

for (const path of urls) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const ok = res.status >= 200 && res.status < 400;
  console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${path}`);
  if (!ok) failed++;
}

// Eat UUID from live Supabase (regression test)
const eatRes = await fetch(`${BASE}/eat/c8074d30-c966-421b-809b-85ccce9e17ff`);
console.log(`${eatRes.status === 200 ? "OK" : "FAIL"} ${eatRes.status} /eat/{supabase-uuid}`);
if (eatRes.status !== 200) failed++;

const planRes = await fetch(`${BASE}/api/plan-trip`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ days: 1, baseLocation: "Kotagiri", travellerType: "Family", interests: ["Food"] }),
});
const planOk = planRes.ok && (await planRes.json()).days?.length > 0;
console.log(`${planOk ? "OK" : "FAIL"} ${planRes.status} POST /api/plan-trip`);
if (!planOk) failed++;

process.exit(failed > 0 ? 1 : 0);
