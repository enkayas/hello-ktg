#!/usr/bin/env node
/**
 * Upload brand logos to Supabase Storage (brand-assets bucket).
 * Run from repo root: node web/scripts/upload-brand-assets.mjs
 * Requires: supabase login + supabase link --project-ref lewhmonjzoznnqxtdkcn
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const brandDir = path.join(repoRoot, "web/public/brand");
const files = [
  "helloKotagiri-logo-light.png",
  "helloKotagiri-logo-dark.png",
  "icon-ink.png",
  "icon-white.png",
  "icon-gold.png",
];

for (const file of files) {
  const src = path.join(brandDir, file);
  const dst = `ss:///brand-assets/${file}`;
  console.log(`Uploading ${file}…`);
  execSync(`supabase storage cp "${src}" "${dst}" --linked --experimental`, {
    stdio: "inherit",
    cwd: repoRoot,
  });
}

console.log("Done. Assets are in the brand-assets bucket.");
