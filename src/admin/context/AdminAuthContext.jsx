// src/admin/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

const TOKEN_URL = 'https://tokenized.pythonanywhere.com/api/token/';

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem('admin_access');
    const username = localStorage.getItem('admin_username');

    if (access) {
      setIsAuthenticated(true);
      setUser({ username: username || 'admin' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let message = 'Login failed';
        if (errorData.detail) message = errorData.detail;
        else if (errorData.non_field_errors) message = errorData.non_field_errors.join(' ');
        throw new Error(message);
      }

      const data = await response.json();

      // Save tokens
      localStorage.setItem('admin_access', data.access);
      localStorage.setItem('admin_refresh', data.refresh);
      localStorage.setItem('admin_username', username);

      setIsAuthenticated(true);
      setUser({ username });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_access');
    localStorage.removeItem('admin_refresh');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};