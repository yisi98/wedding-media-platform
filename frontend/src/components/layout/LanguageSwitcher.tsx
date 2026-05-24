"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Language } from "@/types";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const currentLang = (typeof window !== "undefined"
    ? localStorage.getItem("language") || "en"
    : "en") as Language;

  function selectLanguage(lang: Language) {
    localStorage.setItem("language", lang);
    setOpen(false);
    // Reload to apply language — simple approach; full i18n integration uses useTranslation
    window.location.reload();
  }

  const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-gray-600 hover:text-brand-600 border border-gray-200 rounded px-2 py-1"
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[80px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => selectLanguage(l.code)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${l.code === currentLang ? "font-semibold text-brand-600" : "text-gray-700"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
