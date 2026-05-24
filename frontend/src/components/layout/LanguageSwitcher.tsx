"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@/types";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  function selectLanguage(lang: Language) {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-gray-600 hover:text-brand-600 border border-gray-200 rounded px-2 py-1"
        aria-label="Select language"
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[80px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => selectLanguage(l.code)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                l.code === i18n.language ? "font-semibold text-brand-600" : "text-gray-700"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
