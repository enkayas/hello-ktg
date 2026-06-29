"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  getMessages,
  type Locale,
  type Messages,
} from "@/lib/i18n/messages";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslations(): Messages {
  const locale = useLocale();
  return getMessages(locale);
}
