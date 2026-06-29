import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./messages";

export async function getServerLocale(): Promise<Locale> {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  return raw === "ta" ? "ta" : DEFAULT_LOCALE;
}
