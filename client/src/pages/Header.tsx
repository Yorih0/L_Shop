/**
 * @fileoverview Шапка сайта с навигацией и переключением языка
 * @module Header
 * @requires react-router-dom
 * @requires react-i18next
 */

import "./css/header.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setSessionLang } from "../locales/i18n";
import { useEffect, useState } from "react";

/**
 * Роли пользователей
 * @typedef {('admin'|'manager'|'user'|null)} UserRole
 */

/**
 * Компонент шапки сайта
 * @component
 * @returns {JSX.Element} React компонент шапки
 * 
 * @example
 * <Header />
 */
export default function Header() {
  const { t, i18n } = useTranslation();
  /** @type {[UserRole, React.Dispatch<React.SetStateAction<UserRole>>]} */
  const [role, setRole] = useState(null);

  useEffect(() => {
    /**
     * Загружает роль текущего пользователя с сервера
     * @async
     * @returns {Promise<void>}
     */
    fetch("http://localhost:5000/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => { if (data.role) setRole(data.role); })
      .catch(() => setRole(null));
  }, []);

  /**
   * Изменяет язык интерфейса
   * @param {string} lng - Код языка ('ru', 'en', 'by')
   */
  const changeLanguage = (lng:string) => {
    setSessionLang(lng);
    i18n.changeLanguage(lng);
  };

  /**
   * Определяет путь к профилю в зависимости от роли
   * @type {string}
   */
  const profilePath = role === "admin" 
    ? "/profile/admin"
    : role === "manager" 
      ? "/profile/manager"
      : "/profile/user";

  return (
    <header className="header">
      <div className="logo">ArcSil</div>
      <nav className="nav">
        <Link to="/shop">iStore</Link>
        <Link to="/shop/iphone">iPhone</Link>
        <Link to="/shop/macbook">Macbook</Link>
        <Link to="/shop/watch">Watch</Link>
        <Link to="/shop/airpods">AirPods</Link>
        <Link to="/shop/ipad">iPad</Link>
      </nav>
      <div className="icons-s">
        <Link to="/profile/user">
          <i className="fas fa-shopping-bag"></i>
        </Link>
        {(role === "manager" || role === "admin") && (
          <Link to={profilePath}>
            <i className="fa-regular fa-address-card"></i>
          </Link>
        )}
        <div className="language-switcher">
          {[
            { code: "by", label: "BY" },
            { code: "ru", label: "RU" },
            { code: "en", label: "EN" }
          ].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={i18n.language === code ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}