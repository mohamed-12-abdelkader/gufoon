import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  const isAdmin = () => !!user && user.isSuperuser;

  const login = async credentials => {
    const response = await axios.post('/login/access-token', credentials);
    const { access_token: token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const initializeUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/login/test-token');
      setUser(res.data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async userData => {
    const response = await axios.post('/users/signup', userData);
    const { access_token: token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    axios.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    if (token) {
      initializeUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // If still loading, don't render anything
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAdmin,
        initializeUser,
        register,
        login,
        logout,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
