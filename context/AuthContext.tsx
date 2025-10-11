
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userToken: string | null;
  user: string | null;
  isLoading: boolean;
  signIn: (token: string, user: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      let auth, u = null;
      try {
        auth = await SecureStore.getItemAsync('authorization');
        u = await SecureStore.getItemAsync('user');
      } catch (e) {
        // Handle error
      } finally {
        setUserToken(auth === undefined || auth === '' ? null : auth);
        setUser(u === undefined || u === '' ? null : u);
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (token: string, user: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authorization', token);
      await AsyncStorage.setItem('user', user);

    } else {
      await SecureStore.setItemAsync('authorization', token);
      await SecureStore.setItemAsync('user', user);
    }
    setUserToken(token);
    setUser(user);
  };

  const signOut = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authorization', '');
      await AsyncStorage.setItem('user', '');   
    } else {
      await SecureStore.setItemAsync('authorization', '');
      await SecureStore.setItemAsync('user', '');
    }
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, signIn, signOut }}>
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
