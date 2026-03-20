import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./css/register.css";

export default function LoginForm() {
  const [form, setForm] = useState({
    login: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );
      console.log("Успех:", res.data);
      //получить данные о карзине
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/shop")
    } catch (err) {
      const error = err as AxiosError;
      alert("Неверный логин или пароль");
      console.error("Ошибка:", error.response?.data);
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Уже с нами!</h1>

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

        <button type="submit" className="btn">
          Вход
        </button>

        <div className="account">
          <span>Нет аккаунта?</span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}