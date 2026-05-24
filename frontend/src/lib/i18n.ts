import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/common.json";
import zh from "@/locales/zh/common.json";
import ru from "@/locales/ru/common.json";

const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    zh: { common: zh },
    ru: { common: ru },
  },
  lng: savedLang,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
