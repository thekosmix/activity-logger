
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userToken: string | null;
  userId: string | null;
  isLoading: boolean;
  signIn: (token: string, userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      let token = null;
      try {
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Handle error
      } finally {
        setUserToken(token === '' ? null: token);
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (token: string, userId: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authorization', token);
      await AsyncStorage.setItem('user-id', userId);
    } else {
      await SecureStore.setItemAsync('authorization', token);
      await SecureStore.setItemAsync('user-id', userId);
    }
    setUserToken(token);
    setUserId(userId);
  };

  const signOut = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authorization', '');
      await AsyncStorage.setItem('user-id', '');   
    } else {
      await SecureStore.setItemAsync('authorization', '');
      await SecureStore.setItemAsync('user-id', '');
    }
    setUserToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userId, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
