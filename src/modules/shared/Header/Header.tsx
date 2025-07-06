import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

type User = {
  email: string;
  photoUrl: string;
};

export const Header: React.FC = () => {
  const [city, setCity] = useState<"Kyiv" | "Lviv">("Kyiv");
  const [language, setLanguage] = useState<"ENG" | "UKR">("ENG");
  const [activeDropdown, setActiveDropdown] = useState<"city" | "lang" | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрываем остальные dropdown’ы при смене роута
  useEffect(() => setActiveDropdown(null), [location.pathname]);

  // Восстанавливаем user из localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Выпадающие списки города/языка
  const toggle = (name: "city" | "lang") =>
    setActiveDropdown(activeDropdown === name ? null : name);

  return (
    <div className="header" ref={dropdownRef}>
      <Link to="/" className="header__logo-container">
        <img src="./logo.svg" alt="beanly" className="header__logo" />
      </Link>

      <div className="header__search-container">
        <img src="./icons/search-dark.svg" alt="search" className="header__search-icon" />
        <input
          type="text"
          placeholder="Search cafés or areas…"
          className="header__search-input body-font-1"
        />
      </div>

      <div className="header__menu">
        <Link to="/catalog" className="header__menu-item menu-text-font">
          Catalog
        </Link>

        {/* City dropdown */}
        <div className="header__dropdown">
          <div
            className="header__menu-item menu-text-font"
            onClick={() => toggle("city")}
          >
            {city}
            <img src="./icons/chevron-down.svg" alt="" className="header__chevron" />
          </div>
          {activeDropdown === "city" && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setCity("Kyiv"); setActiveDropdown(null); }}>Kyiv</div>
              <div onClick={() => { setCity("Lviv"); setActiveDropdown(null); }}>Lviv</div>
            </div>
          )}
        </div>

        {/* Language dropdown */}
        <div className="header__dropdown">
          <div
            className="header__menu-item menu-text-font"
            onClick={() => toggle("lang")}
          >
            {language}
            <img src="./icons/chevron-down.svg" alt="" className="header__chevron" />
          </div>
          {activeDropdown === "lang" && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setLanguage("ENG"); setActiveDropdown(null); }}>ENG</div>
              <div onClick={() => { setLanguage("UKR"); setActiveDropdown(null); }}>UKR</div>
            </div>
          )}
        </div>

        {/* Log in / Profile */}
        {user ? (
          <Link to="/profile" className="header__menu-item menu-text-font">
            <img src={user.photoUrl} alt="avatar" className="header__avatar" />
          </Link>
        ) : (
          <button
            className="header__menu-item menu-text-font header__login-button"
            onClick={() => navigate("/auth")}
          >
            Log in
          </button>
        )}
      </div>
    </div>
  );
};