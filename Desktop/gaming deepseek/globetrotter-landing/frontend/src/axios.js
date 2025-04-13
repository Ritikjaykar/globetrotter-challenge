// frontend/src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'baseURL: import.meta.env.VITE_API_BASE_URL,',
  timeout: 10000,
});

// Add request/response interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { message: 'Network Error' });
  }
);

export default api;