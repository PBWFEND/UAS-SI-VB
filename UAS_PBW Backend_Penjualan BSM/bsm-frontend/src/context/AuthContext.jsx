/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, nama, username, role }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tokenKey = 'bsm_token';

  // saat pertama kali load, cek token & fetch /users/profile
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(tokenKey);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/profile');
        const profile = res.data?.data || res.data?.user || null;
        setUser(profile);
      } catch (err) {
        console.error('Profile error', err);
        localStorage.removeItem(tokenKey);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/login', { username, password });
    const token = res.data?.data?.token || res.data?.token;
    const userData = res.data?.data?.user || res.data?.user;

    if (token) localStorage.setItem(tokenKey, token);

    setUser(userData);

    // redirect by role
    const role = userData?.role;
    if (role === 'KONSUMEN') navigate('/konsumen', { replace: true });
    else if (role === 'ADMIN') navigate('/admin', { replace: true });
    else if (role === 'KARYAWAN') navigate('/karyawan', { replace: true });
    else if (role === 'OWNER') navigate('/owner', { replace: true });
    else navigate('/403', { replace: true });

    return res;
  };

  const register = async (payload) => {
    const res = await api.post('/register', payload);
    return res;
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
