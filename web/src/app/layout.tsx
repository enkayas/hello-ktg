import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getServerLocale } from "@/lib/i18n/server";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HelloKotagiri — Discover Nilgiris Like a Local",
    template: "%s · HelloKotagiri",
  },
  description:
    "Smart stays, local food, scenic routes, hidden gems and nearby experiences across Kotagiri and the Nilgiris.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className={`${GeistSans.className} flex min-h-full flex-col`}>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
