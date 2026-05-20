/**
 * @fileoverview Страница входа в систему
 * @module LoginPage
 */

import Header from "./Header";
import Footer from "./Footer";
import LoginForm from "./LoginForm";

/**
 * Компонент страницы входа
 * @component
 * @returns {JSX.Element} React компонент страницы входа
 */
export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="main"><LoginForm /></main>
      <Footer />
    </>
  );
}