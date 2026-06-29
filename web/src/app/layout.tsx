import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HelloKotagiri — Discover Nilgiris Like a Local",
    template: "%s · HelloKotagiri",
  },
  description:
    "Smart stays, local food, scenic routes, hidden gems and nearby experiences across Kotagiri and the Nilgiris.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className={`${GeistSans.className} flex min-h-full flex-col`}>
        {children}
      </body>
    </html>
  );
}
