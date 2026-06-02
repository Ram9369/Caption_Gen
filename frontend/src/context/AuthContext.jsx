import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check user session on mount
  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/me');
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      // If error (like 401), user is not logged in, clear user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Login handler
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { username, password });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Register handler
  const register = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', { username, password });
      if (response.data && response.data.user) {
        // Automatically log in on success
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Username may already exist.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user state locally regardless of backend status
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError, checkSession }}>
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
