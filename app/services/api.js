import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  let authorization, userId;

  if (Platform.OS === 'web') {
    authorization = await AsyncStorage.getItem('authorization');
    userId = await AsyncStorage.getItem('user-id');
  } else {
    authorization = await SecureStore.getItemAsync('authorization');
    userId = await SecureStore.getItemAsync('user-id');
  }

  const response = await fetch(`${API_URL}/activities/feed`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'user-id': userId,
      'authorization': authorization,
    }
  });
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

export default function ApiService() {
  return null;
}
