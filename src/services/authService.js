import apiClient from './api';

export async function loginAPI(username, password) {
  return apiClient.post('/auth/login', { username, password });
}

export async function logoutAPI() {
  return apiClient.post('/auth/logout');
}
