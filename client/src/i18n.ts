import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getSessionLang, setSessionLang } from "./langCookie";
import { getLangFromBrowser, getLangFromIP } from "./detectLanguage";

import ru from './locales/ru.json';
import en from './locales/en.json';
import by from './locales/by.json'

const initLanguage = async () => {
  const saved = getSessionLang();
  if (saved) return saved;

  const ipLang = await getLangFromIP();
  if (ipLang) {
    setSessionLang(ipLang);
    return ipLang;
  }

  const browserLang = getLangFromBrowser();
  setSessionLang(browserLang);
  return browserLang;
};

(async () => {
  const lang = await initLanguage();

  i18n
    .use(initReactI18next)
    .init({
      lng: lang,
      fallbackLng: "ru",
      resources: {
        ru: { translation: ru },
        en: { translation: en },
        by: { translation: by }
      }
    });
})();

export default i18n;