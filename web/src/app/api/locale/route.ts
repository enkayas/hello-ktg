import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n/messages";

export async function POST(request: Request) {
  let locale: Locale = DEFAULT_LOCALE;
  try {
    const body = await request.json();
    if (body.locale === "ta" || body.locale === "en") locale = body.locale;
  } catch {
    /* ignore */
  }

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
