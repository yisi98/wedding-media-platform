"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { updateProfile } from "@/lib/api/auth";
import type { Language } from "@/types";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ru", label: "Русский" },
];

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthStore();

  const [email, setEmail] = useState(user?.email ?? "");
  const [language, setLanguage] = useState<Language>(user?.language ?? "en");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    try {
      const updated = await updateProfile({
        email: email.trim() || null,
        language,
      });
      setUser(updated);
      // Switch UI language immediately
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("profile.title")}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Username — read only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.username")}
          </label>
          <input
            value={user.username}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-default"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("profile.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("profile.emailPlaceholder")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Language selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.language")}
          </label>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  language === lang.value
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status message */}
        {status === "saved" && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
            {t("profile.saved")}
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
            {t("profile.saveError")}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {status === "saving" ? t("profile.saving") : t("profile.save")}
        </button>
      </div>
    </div>
  );
}
