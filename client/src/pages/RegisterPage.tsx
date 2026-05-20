/**
 * @fileoverview Страница регистрации пользователя
 * @module RegisterPage
 */

import Header from "./Header";
import Footer from "./Footer";
import RegisterForm from "./RegisterForm";

/**
 * Компонент страницы регистрации
 * @component
 * @returns {JSX.Element} React компонент страницы регистрации
 */
export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="main"><RegisterForm /></main>
      <Footer />
    </>
  );
}