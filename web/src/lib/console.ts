/** console.hellokotagiri.com — owner & admin subsite */

export const CONSOLE_HOST = "console.hellokotagiri.com";

export const CONSOLE_URL =
  process.env.NEXT_PUBLIC_CONSOLE_URL ?? `https://${CONSOLE_HOST}`;

export function consoleUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    const host = window.location.host;
    if (host === CONSOLE_HOST || host.startsWith("localhost")) {
      return p;
    }
  }
  return `${CONSOLE_URL}${p}`;
}

export function isConsoleHost(host: string | null): boolean {
  if (!host) return false;
  const h = host.split(":")[0];
  return h === CONSOLE_HOST || h === "console.localhost";
}
