import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

const getAuthHeaders = async () => {
  let authorization, userId, user;

  if (Platform.OS === 'web') {
    authorization = await AsyncStorage.getItem('authorization');
    user = await AsyncStorage.getItem('user');
  } else {
    authorization = await SecureStore.getItemAsync('authorization');
    user = await SecureStore.getItemAsync('user');
  }

  userId = JSON.parse(user).id;

  return {
    'authorization': authorization,
    'user-id': userId,
  };
};

export const register = async (name, phoneNumber) => {
  const response = await apiClient.post('/auth/register', { name, phone_number: phoneNumber });
  return response.data;
};

export const sendOtp = async (phoneNumber) => {
  const response = await apiClient.post('/auth/sendOtp', { phone_number: phoneNumber });
  return response.data;
};

export const login = async (phoneNumber, otp) => {
  const response = await apiClient.post('/auth/login', { phone_number: phoneNumber, otp });
  return response.data;
};

export const getActivities = async (page = 1, limit = 10) => {
  const headers = await getAuthHeaders();
  const response = await apiClient.get(`/activities/feed?page=${page}&limit=${limit}`, {headers});
  return response.data;
};

export const uploadMedia = async (data) => {
  const authHeaders = await getAuthHeaders();
  
  // Set the content-type to application/json for --data-raw format
  const headers = {
    ...authHeaders,
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(`${API_URL}/media/upload`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data), // Send as JSON for --data-raw format
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
  }
  
  return await response.json();
};

export const createActivity = async (data) => {
  const headers = await getAuthHeaders();
  const response = await apiClient.post('/activities', data, {headers});
  return response.data;
};

export const clockInOrOut = async (data) => {
  const headers = await getAuthHeaders();
  const response = await apiClient.post('/worklog', data, {headers});
  return response.data;
}

export default function ApiService() {
  return null;
}
