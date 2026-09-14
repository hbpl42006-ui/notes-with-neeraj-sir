import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiService.getCurrentUser()
        .then(({ data }) => {
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
      return;
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try { if (localStorage.getItem('token')) await apiService.logout(); } catch (error) { console.error('Logout error:', error); }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await apiService.getCurrentUser();
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token: localStorage.getItem('token'), login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
