import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONSOLE_HOST, CONSOLE_URL } from "@/lib/console";

const MAIN_HOSTS = new Set(["hellokotagiri.com", "www.hellokotagiri.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const { pathname, search } = request.nextUrl;

  if (MAIN_HOSTS.has(host)) {
    if (
      pathname.startsWith("/owner") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth")
    ) {
      return NextResponse.redirect(
        new URL(`${pathname}${search}`, CONSOLE_URL),
      );
    }
    if (
      pathname === "/list-your-business" ||
      pathname.startsWith("/list-your-business/") ||
      pathname === "/list-your-property"
    ) {
      return NextResponse.redirect(new URL("/owner/login", CONSOLE_URL));
    }
  }

  if (host === CONSOLE_HOST && pathname === "/") {
    return NextResponse.redirect(new URL("/owner", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/owner/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/list-your-business",
    "/list-your-business/:path*",
    "/list-your-property",
  ],
};
