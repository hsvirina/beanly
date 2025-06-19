import "./Header.scss";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const [city, setCity] = useState<'Kyiv' | 'Lviv'>('Kyiv');
  const [language, setLanguage] = useState<'ENG' | 'UKR'>('ENG');
  const [activeDropdown, setActiveDropdown] = useState<'city' | 'lang' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="header" ref={dropdownRef}>
      <Link to="/" className="header__logo-container">
        <img src="logo.svg" alt="beanly" className="header__logo" />
      </Link>

      <div className="header__menu">
        {/* Город */}
        <div className="header__dropdown">
          <div
            className="header__menu-item"
            onClick={() =>
              setActiveDropdown(activeDropdown === 'city' ? null : 'city')
            }
          >
            {city}
            <img
              src="./icons/chevron-down.svg"
              className="header__chevron"
              alt="chevron-down"
            />
          </div>
          {activeDropdown === 'city' && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setCity('Kyiv'); setActiveDropdown(null); }}>Kyiv</div>
              <div onClick={() => { setCity('Lviv'); setActiveDropdown(null); }}>Lviv</div>
            </div>
          )}
        </div>

        {/* Язык */}
        <div className="header__dropdown">
          <div
            className="header__menu-item"
            onClick={() =>
              setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')
            }
          >
            {language}
            <img
              src="./icons/chevron-down.svg"
              className="header__chevron"
              alt="chevron-down"
            />
          </div>
          {activeDropdown === 'lang' && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setLanguage('ENG'); setActiveDropdown(null); }}>ENG</div>
              <div onClick={() => { setLanguage('UKR'); setActiveDropdown(null); }}>UKR</div>
            </div>
          )}
        </div>

        {/* Вход */}
        <div className="header__menu-item header__login">
          Log in
          <img
            src="./icons/user-profile.svg"
            className="header__chevron"
            alt="user-profile"
          />
        </div>
      </div>
    </div>
  );
};