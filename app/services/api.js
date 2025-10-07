import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

const getAuthHeaders = async () => {
  let authorization, userId;

  if (Platform.OS === 'web') {
    authorization = await AsyncStorage.getItem('authorization');
    userId = await AsyncStorage.getItem('user-id');
  } else {
    authorization = await SecureStore.getItemAsync('authorization');
    userId = await SecureStore.getItemAsync('user-id');
  }

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

export const getActivities = async () => {
  const headers = await getAuthHeaders();
  const response = await apiClient.get('/activities/feed', { headers });
  return response.data;
};

export const uploadMedia = async (formData) => {
  const headers = await getAuthHeaders();
  const response = await apiClient.post('/media/upload', formData, {
    headers,
  });
  return response.data;
};

export const createActivity = async (data) => {
  const headers = await getAuthHeaders();
  const response = await apiClient.post('/activities', data, { headers });
  return response.data;
};

export default function ApiService() {
  return null;
}