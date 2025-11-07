import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import baseUrl from "../api/baseUrl";

axios.defaults.baseURL = 'http://localhost:8000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track if logout is already in progress to avoid infinite reload loops
  const isLoggingOutRef = useRef(false);

  const isAdmin = () => !!user && user.isSuperuser;

  const login = async (credentials) => {
    const response = await baseUrl.post("/api/login/access-token", credentials);
    const { access_token: token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    window.location.reload();
  };

  const logout = (doReload = true) => {
    if (isLoggingOutRef.current) return; // Prevent double logout calls
    isLoggingOutRef.current = true;

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    if (doReload) {
      window.location.reload();
    }
  };

  const register = async (userData) => {
    const response = await baseUrl.post("/api/users/signup", userData);
    const { access_token: token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    window.location.reload();
  };

  const initializeUser = async () => {
    setLoading(true);
    try {
      const res = await baseUrl.post("/login/test-token");
      setUser(res.data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout(false); // logout without reload to avoid loop
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
