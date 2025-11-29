import axios from 'axios';

const baseURL = 'https://vr-be.onrender.com';

export async function loginAPI(username, password) {
  return axios.post(`${baseURL}/api/auth/login`, {
    username,
    password,
  });
}
