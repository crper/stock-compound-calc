import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";

// 本地存储键
export const LANGUAGE_STORAGE_KEY = "app-language";

// 语言配置
export const LANGUAGES = {
  ZH_CN: "zh-CN",
  EN_US: "en-US",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// 语言显示名称
export const LANGUAGE_NAMES: Record<Language, string> = {
  [LANGUAGES.ZH_CN]: "中文",
  [LANGUAGES.EN_US]: "English",
};

// 初始化 i18n
void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      [LANGUAGES.ZH_CN]: zhCN,
      [LANGUAGES.EN_US]: enUS,
    },
    fallbackLng: LANGUAGES.EN_US,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
