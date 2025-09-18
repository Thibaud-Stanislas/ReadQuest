import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";

export default function Header({ isLoggedIn, avatarUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="rq-header">
      <div className="rq-header__inner">
        {/* Logo / Marque */}
        <Link to="/" className="rq-brand">READQUEST</Link>

        {/* Navigation */}
        <nav className={`rq-nav ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Accueil
          </Link>
          <Link
            to="/forum"
            className={location.pathname === "/forum" ? "active" : ""}
          >
            Forum
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Nous contacter
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Zone droite : Avatar ou boutons Connexion/Inscription */}
        <div className="rq-right">
          {isLoggedIn ? (
            <img
              src={avatarUrl}
              alt="Avatar utilisateur"
              className="rq-avatar"
            />
          ) : (
            <>
              <Link
                to="/login"
                className={`rq-login ${location.pathname === "/login" ? "active" : ""}`}
              >
                Connexion
              </Link>
            
            </>
          )}
          <button
            className="rq-burger"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}