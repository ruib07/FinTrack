import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { storage } from "@/utils/storage";
import EN from "./en.json";
import PtBR from "./pt.json";

const resources = {
  pt: PtBR,
  en: EN,
};

const initI18n = async () => {
  const savedLang = await storage.getItem("language");
  const devideLang = Localization.getLocales()?.[0]?.languageCode || "en";
  const lng = savedLang || (devideLang === "pt" ? "pt" : "en");

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
