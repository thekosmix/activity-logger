
const API_URL = 'http://localhost:3000/api';

export const register = async (name, phoneNumber) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, phone_number: phoneNumber }),
  });
  return response.json();
};

export const sendOtp = async (phoneNumber) => {
  const response = await fetch(`${API_URL}/auth/sendOtp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber }),
  });
  return response.json();
};

export const login = async (phoneNumber, otp) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber, otp }),
  });
  return response.json();
};

export const getActivities = async () => {
  const response = await fetch(`${API_URL}/activities/feed`);
  return response.json();
};

export const createActivity = async (data) => {
  const response = await fetch(`${API_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
