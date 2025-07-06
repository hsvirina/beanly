import React, { createContext, useState, type ReactNode } from 'react';

const API_BASE = 'http://ec2-54-221-160-23.compute-1.amazonaws.com/api/auth';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  token: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  login: async () => { },
  logout: () => { },
  register: async () => { },
  token: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || 'Invalid credentials');
    }
    const { token: jwt } = await res.json();
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error('Ошибка регистрации:', err);
        throw new Error(err?.message || 'Registration failed');
      }

      console.log('Регистрация успешна');
      await login(email, password);
    } catch (e) {
      console.error('Ошибка в register:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, register, token }}>
      {children}
    </AuthContext.Provider>
  );
};
