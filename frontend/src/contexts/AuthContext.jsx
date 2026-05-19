import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('wallet_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('wallet_user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('wallet_token', token);
    } else {
      localStorage.removeItem('wallet_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wallet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wallet_user');
    }
  }, [user]);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, setLoading, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
