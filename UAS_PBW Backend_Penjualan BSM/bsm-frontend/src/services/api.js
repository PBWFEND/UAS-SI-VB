import axios from 'axios';

// REACT_APP_API_URL contoh: http://localhost:3000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL,
});

// inject token dari localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bsm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
