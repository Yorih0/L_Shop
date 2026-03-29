import "./css/header.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setSessionLang } from "../langCookie";

export default function Header() {

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    setSessionLang(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="logo">ArcSil</div>

      <nav className="nav">
        <Link to="/shop/ ">iStore</Link>
        <Link to="/shop/iphone">iPhone</Link>
        <Link to="/shop/macbook">Macbook</Link>
        <Link to="/shop/watch">Watch</Link>
        <Link to="/shop/airpods">AirPods</Link>
        <Link to="/shop/ipad">iPad</Link>
      </nav>

      <div className="icons-s">
        <Link to="/profile">
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
