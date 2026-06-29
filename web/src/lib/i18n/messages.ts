import { en, type Messages } from "./en";
import { ta } from "./ta";

export type { Messages };
export type Locale = "en" | "ta";

export const LOCALES: Locale[] = ["en", "ta"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "hk_locale";

export function getMessages(locale: Locale): Messages {
  return locale === "ta" ? ta : en;
}
