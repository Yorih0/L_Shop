import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./langs/ru.json";
import en from "./langs/en.json";
import by from "./langs/by.json";

// ФУНКЦИИ ДЛЯ ЯЗЫКА
function getSessionLang() {
  const match = document.cookie.match(/lang=([^;]+)/);
  return match ? match[1] : null;
}

export function setSessionLang(lang: string) {
  document.cookie = `lang=${lang}; path=/; SameSite=Lax`;
}

function getLangFromBrowser() {
  const lang = navigator.language.slice(0, 2);
  return ["ru", "en", "by"].includes(lang) ? lang : "ru";
}

// ОПРЕДЕЛЕНИЕ ЯЗЫКА
function detectLanguageSync() {
  const saved = getSessionLang();
  if (saved) return saved;

  const browser = getLangFromBrowser();
  setSessionLang(browser);
  return browser;
}

const lang = detectLanguageSync();

//  ИНИЦИАЛИЗАЦИЯ i18n  
i18n
  .use(initReactI18next)
  .init({
    lng: lang,
    fallbackLng: "ru",
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      by: { translation: by }
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
