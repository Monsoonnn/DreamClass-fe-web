import axios from 'axios';

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
    console.log('=== API REQUEST ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    // No need to attach token manually, browser handles HttpOnly cookies
    console.log('Headers:', config.headers);
    console.log('===================');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response && error.response.status === 401) {
      // Unauthorized: Clear UI state and redirect to login
      // We can't clear the HttpOnly cookie from JS, but we should clear our client-side user state
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
