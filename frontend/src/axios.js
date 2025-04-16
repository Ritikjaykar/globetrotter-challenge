  // frontend/src/axios.js
  import axios from 'axios';

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  });

  apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error.response || error.message);
      return Promise.reject(error.response?.data || { message: 'Network Error' });
    }
  );

  export default apiClient;
