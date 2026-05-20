import { useEffect, useState } from "react";
import i18n from "./i18n";

/**
 * Компонент всплывающего окна выбора языка
 * @component
 * @returns {JSX.Element | null} Возвращает компонент попапа или null, если попап не должен отображаться
 * 
 * @example
 * // Использование в App.tsx
 * <LocalePopup />
 */
export default function LocalePopup() {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");

  /**
   * Получает сохранённый язык из cookies
   * @returns {string|null} Код языка (ru, en, by) или null, если не сохранён
   */
  const getSessionLang = (): string | null => {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match ? match[1] : null;
  };

  /**
   * Сохраняет выбранный язык в cookies
   * @param {string} lang - Код языка (ru, en, by)
   */
  const setSessionLang = (lang: string): void => {
    document.cookie = `lang=${lang}; path=/; SameSite=Lax`;
  };

  /**
   * Проверяет, был ли уже показан попап
   * @returns {boolean} true, если попап уже показывали
   */
  const wasPopupShown = (): boolean => {
    return document.cookie.includes("locale_popup_shown=true");
  };

  /**
   * Отмечает, что попап был показан
   */
  const markPopupShown = (): void => {
    document.cookie = `locale_popup_shown=true; path=/; SameSite=Lax`;
  };

  // Эффект для показа попапа при загрузке
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

  /**
   * Выбирает язык и закрывает попап
   * @param {string} lang - Выбранный язык
   */
  const choose = (lang: string): void => {
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
        <p>Переключить язык?</p>
        <div className="locale-buttons">
          <button onClick={() => choose("by")}>Белорусский</button>
          <button onClick={() => choose("ru")}>Русский</button>
          <button onClick={() => choose("en")}>English</button>
        </div>
      </div>
    </div>
  );
}