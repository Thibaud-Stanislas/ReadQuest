import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Accueil from "./assets/pages/Accueil/Accueil";
import LoginPage from "./assets/pages/Login/LoginPage.jsx";
import RegisterPage from "./assets/pages/Register/RegisterPage.jsx";

export default function App() {
  return (
    <>
      <Header isLoggedIn={false} />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </>
  );
}