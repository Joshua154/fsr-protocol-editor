"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type Language,
  type TranslationKey,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  t as translate,
} from "@/common/i18n";

const STORAGE_KEY = "fsr-protocol-lang";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  languages: readonly Language[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "de";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const browser = window.navigator?.language ?? "de";
    return normalizeLanguage(stored ?? browser);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
  };

  const value = useMemo<I18nContextType>(
    () => ({
      lang,
      setLang,
      t: (key) => translate(lang, key),
      languages: SUPPORTED_LANGUAGES,
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
