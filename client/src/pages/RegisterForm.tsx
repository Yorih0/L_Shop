import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/register.css";

axios.defaults.withCredentials = true;

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
    repeatPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRep, setShowPasswordRep] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      alert(t("register.passwordMismatch"));
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", form, {
        withCredentials: true,
      });

      alert(t("register.success"));
      navigate("/shop");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Ошибка:", error.response?.data);
      alert(`${t("register.errorPrefix")} ${error.message}`);
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">{t("register.title")}</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="login"
            placeholder={t("register.loginPlaceholder")}
            value={form.login}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box-lock">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("register.passwordPlaceholder")}
            value={form.password}
            onChange={handleChange}
            required
          />
          <i
            className={`fas ${!showPassword ? "fa-lock" : "fa-unlock-alt"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <div className="input-box-lock">
          <input
            type={showPasswordRep ? "text" : "password"}
            name="repeatPassword"
            placeholder={t("register.repeatPasswordPlaceholder")}
            value={form.repeatPassword}
            onChange={handleChange}
            required
          />
          <i
            className={`fas ${!showPasswordRep ? "fa-lock" : "fa-unlock-alt"}`}
            onClick={() => setShowPasswordRep(!showPasswordRep)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="phone"
            placeholder={t("register.phonePlaceholder")}
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn">
          {t("register.button")}
        </button>

        <div className="account">
          <span>{t("register.haveAccount")}</span>
          <Link to="/login">{t("register.loginLink")}</Link>
        </div>
      </form>
    </div>
  );
}
