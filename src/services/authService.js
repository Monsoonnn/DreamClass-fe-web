import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'https://vr-be.onrender.com/api';

export async function loginAPI(username, password) {
  return axios.post(`${baseURL}/auth/login`, { username, password }, { withCredentials: true });
}

export async function logoutAPI() {
  return axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
}
