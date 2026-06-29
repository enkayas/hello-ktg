import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "https://hellokotagiri.com";

const cases = [
  { from: "/eat", clickText: "View Details", expectUrl: /\/eat\//, expectText: /WhatsApp|Good to know|Directions/ },
  { from: "/things-to-do", clickText: "View Details", expectUrl: /\/things-to-do\//, expectText: /Highlights|WhatsApp|Good to know/ },
  { from: "/hidden-gems", clickText: null, expectUrl: /\/hidden-gems\//, expectText: /WhatsApp|Good to know/, linkSelector: 'a[href^="/hidden-gems/"]' },
  { from: "/stay", clickText: "View Details", expectUrl: /\/stays\//, expectText: /book|WhatsApp|Enquir/i },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

let failed = 0;

for (const c of cases) {
  try {
    await page.goto(`${BASE}${c.from}`, { waitUntil: "networkidle", timeout: 60000 });
    if (c.clickText) {
      const btn = page.getByRole("link", { name: c.clickText }).first();
      await btn.click();
    } else {
      await page.locator(c.linkSelector).first().click();
    }
    await page.waitForURL(c.expectUrl, { timeout: 15000 });
    const body = await page.textContent("body");
    const has404 = /could not be found|404/i.test(body ?? "");
    const hasContent = c.expectText.test(body ?? "");
    if (has404 || !hasContent) {
      console.log(`FAIL ${c.from} -> ${page.url()} (404=${has404} content=${hasContent})`);
      failed++;
    } else {
      console.log(`OK   ${c.from} -> ${page.url()}`);
    }
  } catch (err) {
    console.log(`FAIL ${c.from}: ${err.message}`);
    failed++;
  }
}

await browser.close();
process.exit(failed > 0 ? 1 : 0);
