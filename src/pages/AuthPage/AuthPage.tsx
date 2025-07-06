import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';

export const AuthPage: React.FC = () => {
  const { token, login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Для отслеживания, на какой форме показывать ошибку
  const [activeForm, setActiveForm] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    if (token) {
      navigate('/profile');
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setActiveForm('login');
    try {
      await login(loginEmail, loginPassword);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      setActiveForm('register');
      return;
    }
    setLoading(true);
    setError(null);
    setActiveForm('register');
    console.log('Регистрация:', registerEmail, registerPassword);
    try {
      await register(registerEmail, registerPassword);
    } catch (e) {
      console.error('Ошибка при регистрации:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="authPage"
      style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}
    >
      {/* Registration Form */}
      <div className="registerForm" style={{ flex: 1 }}>
        <h2>Регистрация</h2>
        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          onChange={e => setRegisterEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={registerPassword}
          onChange={e => setRegisterPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading && activeForm === 'register' ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        {error && activeForm === 'register' && (
          <div
            className="error"
            style={{ marginTop: '0.5rem', color: 'red', fontSize: '0.9rem' }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Login Form */}
      <div className="loginForm" style={{ flex: 1 }}>
        <h2>Вход</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading && activeForm === 'login' ? 'Вход...' : 'Войти'}
        </button>
        {error && activeForm === 'login' && (
          <div
            className="error"
            style={{ marginTop: '0.5rem', color: 'red', fontSize: '0.9rem' }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};