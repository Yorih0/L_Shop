import { useEffect, useState } from "react";
import i18n from "./i18n";

export default function LocalePopup() {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");

  const getSessionLang = () => {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match ? match[1] : null;
  };

  const setSessionLang = (lang: string) => {
    document.cookie = `lang=${lang}; path=/; SameSite=Lax`;
  };

  const wasPopupShown = () => {
    return document.cookie.includes("locale_popup_shown=true");
  };

  const markPopupShown = () => {
    document.cookie = `locale_popup_shown=true; path=/; SameSite=Lax`;
  };

  useEffect(() => {
    if (wasPopupShown()) return;

    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        setCountry(data.country);
        setShow(true);
        markPopupShown();
      })
      .catch(() => setShow(false));
  }, []);

  const choose = (lang: string) => {
    setSessionLang(lang);
    i18n.changeLanguage(lang);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="locale-popup">
      <div className="locale-popup-content">
        <p>
          Вы из {country === "BY" ? "Беларуси" : "другой страны"}.
        </p>
        <p>
          Переключить язык?
        </p>
        <div className="locale-buttons">
          <button onClick={() => choose("by")}>Белорусский</button>
          <button onClick={() => choose("ru")}>Русский</button>
          <button onClick={() => choose("en")}>English</button>
        </div>
      </div>
    </div>
  );
}
