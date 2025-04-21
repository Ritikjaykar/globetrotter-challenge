// frontend/src/utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api' 
    : '/api',
  timeout: 10000
});

export default apiClient;