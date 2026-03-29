import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./css/register.css";

axios.defaults.withCredentials = true;

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/users/login",
        form,
        { withCredentials: true }
      );

      navigate("/shop");
    } catch (err) {
      const error = err as AxiosError;
      alert(t("login.error"));
      console.error("Ошибка:", error.response?.data);
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">{t("login.title")}</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="login"
            placeholder={t("login.loginPlaceholder")}
            value={form.login}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box-lock">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("login.passwordPlaceholder")}
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

        <button type="submit" className="btn">
          {t("login.button")}
        </button>

        <div className="account">
          <span>{t("login.noAccount")}</span>
          <Link to="/register">{t("login.register")}</Link>
        </div>
      </form>
    </div>
  );
}
