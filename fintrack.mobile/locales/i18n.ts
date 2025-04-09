import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import PtBR from "./pt.json";
import EN from "./en.json";

const resources = {
  pt: PtBR,
  en: EN,
};

const deviceLanguage = Localization.getLocales()?.[0]?.languageCode || "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: deviceLanguage === "pt" ? "pt" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
