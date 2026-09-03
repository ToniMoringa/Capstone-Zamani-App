import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  fetchMe,
  loginUser,
  registerUser,
  logoutUser,
  updateMe,
} from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zamani_token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('zamani_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuthResponse = (data) => {
    localStorage.setItem('zamani_token', data.access_token);
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    handleAuthResponse(data);
  };

  const signup = async (credentials) => {
    const data = await registerUser(credentials);
    handleAuthResponse(data);
  };

  const updateProfile = async (payload) => {
    const data = await updateMe(payload);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('zamani_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);