import "./Header.scss";
import "../../../styles/utils/_fonts.scss";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

type User = {
  email: string;
  photoUrl: string;
};

export const Header: React.FC = () => {
  const [city, setCity] = useState<'Kyiv' | 'Lviv'>('Kyiv');
  const [language, setLanguage] = useState<'ENG' | 'UKR'>('ENG');
  const [activeDropdown, setActiveDropdown] = useState<'city' | 'lang' | 'login' | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  useEffect(() => {
    // Закрывает дропдауны при смене маршрута
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogin = () => {
    if (email.trim() === '123@gmail.com' && password.trim() === '123') {
      const loggedInUser = {
        email,
        photoUrl: './profile-photo.jpg', // можно заменить на реальную ссылку
      };
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setActiveDropdown(null);
      navigate('/profile');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="header" ref={dropdownRef}>
      <Link to="/" className="header__logo-container">
        <img src="logo.svg" alt="beanly" className="header__logo" />
      </Link>

      <div className="header__search-container">
        <img
          src="./icons/search-dark.svg"
          className="header__search-icon"
          alt="search-button"
        />
        <input
          type="text"
          placeholder="Search cafés or areas…"
          className="header__search-input body-font-1"
        />
      </div>

      <div className="header__menu">
        <Link to="/catalog" className="header__menu-item menu-text-font">Catalog</Link>

        {/* City Dropdown */}
        <div className="header__dropdown">
          <div
            className="header__menu-item menu-text-font"
            onClick={() => setActiveDropdown(activeDropdown === 'city' ? null : 'city')}
          >
            {city}
            <img src="./icons/chevron-down.svg" className="header__chevron" alt="chevron-down" />
          </div>
          {activeDropdown === 'city' && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setCity('Kyiv'); setActiveDropdown(null); }}>Kyiv</div>
              <div onClick={() => { setCity('Lviv'); setActiveDropdown(null); }}>Lviv</div>
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="header__dropdown menu-text-font">
          <div
            className="header__menu-item"
            onClick={() => setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')}
          >
            {language}
            <img src="./icons/chevron-down.svg" className="header__chevron" alt="chevron-down" />
          </div>
          {activeDropdown === 'lang' && (
            <div className="header__dropdown-menu">
              <div onClick={() => { setLanguage('ENG'); setActiveDropdown(null); }}>ENG</div>
              <div onClick={() => { setLanguage('UKR'); setActiveDropdown(null); }}>UKR</div>
            </div>
          )}
        </div>

        {/* Login or User Avatar */}
        <div className="header__dropdown menu-text-font">
          <div
            className="header__menu-item"
            onClick={() => setActiveDropdown(activeDropdown === 'login' ? null : 'login')}
          >
            {user ? (
              <img
                src={user.photoUrl}
                alt="User avatar"
                className="header__avatar"
              />
            ) : (
              <>
                Log in
                <img src="./icons/user-profile.svg" className="header__chevron" alt="user-profile" />
              </>
            )}
          </div>

          {activeDropdown === 'login' && (
            <div className="header__dropdown-menu header__dropdown-menu--login menu-text-font">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setActiveDropdown(null)} className="header__dropdown-link">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="header__logout-btn">Logout</button>
                </>
              ) : (
                <div className="header__login-form">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="header__login-input"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="header__login-input"
                  />
                  <button onClick={handleLogin} className="header__login-btn">Log in</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};