import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import "./css/register.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    login: "",
    password: "",
    repeatPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword_rep, setShowPassword_rep] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      alert("Пароли не совпадают");
      return;
    }

    console.log(form);

     try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );
      localStorage.setItem("products", JSON.stringify(res.data));
      console.log("Успех:", res.data);
      alert("Вы зарегистрированы");
      window.location.href = '/shop';
    } catch (err) {
      const error = err as AxiosError;
      console.error("Ошибка:", error.response?.data);
      alert("Ошибка" + error.message);
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Теперь с нами!</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="login"
            placeholder="Ваш логин"
            value={form.login}
            onChange={handleChange}
            required
          />
          <i className="fas fa-user"></i>
        </div>

        <div className="input-box-lock">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ваш пароль"
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
            type={showPassword_rep ? "text" : "password"}
            name="repeatPassword"
            placeholder="Повтор пароля"
            value={form.repeatPassword}
            onChange={handleChange}
            required
          />
          <i
            className={`fas ${!showPassword_rep ? "fa-lock" : "fa-unlock-alt"}`}
            onClick={() => setShowPassword_rep(!showPassword_rep)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="phone"
            placeholder="+375 00 000 0000"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <i className="fa-solid fa-phone"></i>
        </div>

        <button type="submit" className="btn">
          Зарегистрироваться
        </button>

        <div className="account">
          <span>Есть аккаунт?</span>
          <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
}