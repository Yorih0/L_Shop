import "./css/header.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setSessionLang } from "../locales/i18n";
import { useEffect, useState } from "react";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/getMe", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.role) setRole(data.role);
      })
      .catch(() => setRole(null));
  }, []);

  const changeLanguage = (lng: string) => {
    setSessionLang(lng);
    i18n.changeLanguage(lng);
  };

  const profilePath =
    role === "admin"? "/profile/admin"
      : role === "manager"? "/profile/manager"
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
        <Link to={profilePath}>
          <i className="fas fa-shopping-bag"></i>
        </Link>

        <div className="language-switcher">
          <button
            onClick={() => changeLanguage("by")}
            className={i18n.language === "by" ? "active" : ""}
          >BY</button>

          <button
            onClick={() => changeLanguage("ru")}
            className={i18n.language === "ru" ? "active" : ""}
          >RU</button>

          <button
            onClick={() => changeLanguage("en")}
            className={i18n.language === "en" ? "active" : ""}
          >EN</button>
        </div>
      </div>
    </header>
  );
}
