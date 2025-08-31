import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const sendOtp = (phone_number) => {
  return axios.post(`${API_URL}/auth/sendOtp`, { phone_number });
};

export const loginUser = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};
