"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/messages";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  async function setLocale(next: Locale) {
    if (next === locale) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  return (
    <div
      className={`inline-flex rounded-full border border-line bg-surface p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`tap rounded-full px-2.5 py-1.5 transition ${
          locale === "en" ? "bg-primary text-canvas" : "text-muted hover:text-primary"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ta")}
        className={`tap rounded-full px-2.5 py-1.5 transition ${
          locale === "ta" ? "bg-primary text-canvas" : "text-muted hover:text-primary"
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
}
