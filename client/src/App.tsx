import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ShopPage from "./pages/ShopPage";

import ProfileUserPage from "./pages/ProfileUserPage";
import ProfileManagerPage from "./pages/ProfileUserPage";
import AdminPage from "./pages/AdminPage";

import LocalePopup from "./locales/LocalePopup";
import "./pages/css/locale-popup.css";

function App() {
  return (
    <>
      <LocalePopup />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ShopPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />

        <Route path="/profile/user" element={<ProfileUserPage />} />
        <Route path="/profile/manager" element={<AdminPage />} />
        <Route path="/profile/admin" element={<AdminPage/>} />
      </Routes>
    </>
  );
}

export default App;
