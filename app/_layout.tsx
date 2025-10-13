
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();

  // While loading, keep showing the auth screens to prevent showing tabs briefly
  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="add-activity" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      {userToken ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false, title: '' }} />
      )}
      <Stack.Screen name="add-activity" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
