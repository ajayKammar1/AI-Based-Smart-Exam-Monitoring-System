import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthStatus, login as apiLogin, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Simple auth check. In production, we rely on httpOnly cookies
        const res = await checkAuthStatus();
        setIsAuthenticated(res.logged_in);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    if (res.success) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await apiLogout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
