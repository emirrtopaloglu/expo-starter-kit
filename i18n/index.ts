import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { storage } from "@/utils/storage";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

const RESOURCES = {
  en: { translation: en },
  tr: { translation: tr },
};

const LANGUAGE_DETECTOR = {
  type: "languageDetector" as const,
  async: true, // detector must be async
  detect: async (callback: (lang: string) => void) => {
    try {
      // 1. Check AsyncStorage for user preference
      const savedLanguage = await storage.getItem("user-language");
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      // 2. Fallback to device locale
      const locales = Localization.getLocales();
      if (locales && locales.length > 0) {
        const deviceLanguage = locales[0].languageCode;
        if (deviceLanguage) {
          return callback(deviceLanguage);
        }
      }

      // 3. Fallback to default 'en'
      return callback("en");
    } catch (error) {
      console.log("Error reading language", error);
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    await storage.setItem("user-language", language);
  },
};

i18n
  .use(LANGUAGE_DETECTOR) // use the custom language detector
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: RESOURCES,
    fallbackLng: "en", // fallback language if detection fails or key is missing
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
