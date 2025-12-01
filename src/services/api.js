import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://vr-be.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
    console.log('Params:', config.params);
    console.log('Request Headers:', config.headers);
    console.log('WithCredentials:', config.withCredentials);
    console.log('(Cookie sẽ được browser tự động gửi nếu withCredentials=true)');
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
    console.log('Response Headers:', response.headers);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response && error.response.status === 401) {
      // Redirect to login on 401 Unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
