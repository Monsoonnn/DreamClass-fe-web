import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://vr-be.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để log request và response
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized - 401 received');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
