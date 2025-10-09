
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { userToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.replace('/(tabs)');
    }
  }, [userToken]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
