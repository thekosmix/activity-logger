
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { sendOtp, login } from '../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const { signIn } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');

  // Regular expression for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Regular expression for validating 10-digit phone number
  const phoneRegex = /^[0-9]{10}$/;

  const validateInput = (input) => {
    if (emailRegex.test(input)) {
      return 'email';
    } else if (phoneRegex.test(input)) {
      return 'phone';
    } else {
      return null;
    }
  };

  const handleSendOtp = async () => {
    const validation = validateInput(identifier);
    
    if (!validation) {
      Alert.alert('Error', 'Please enter a valid email or 10-digit phone number.');
      return;
    }
    
    try {
      const response = await sendOtp(identifier);
      if (response.success) {
        Alert.alert('Success', 'OTP sent successfully.');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sending OTP. Please try again.');
    }
  };

  const handleLogin = async () => {
    const validation = validateInput(identifier);
    
    if (!validation) {
      Alert.alert('Error', 'Please enter a valid email or 10-digit phone number.');
      return;
    }
    
    try {
      const response = await login(identifier, otp);
    
      if (response.token) {
        signIn(response.token, JSON.stringify(response.user));
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome back</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor, color: textColor, borderColor }]}
        placeholder="Email or Phone number"
        placeholderTextColor={borderColor} // Use border color for placeholder to ensure visibility
        keyboardType={identifier.includes('@') ? 'email-address' : 'default'}
        value={identifier}
        onChangeText={setIdentifier}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
      <TextInput
        style={[styles.input, { backgroundColor, color: textColor, borderColor }]}
        placeholder="OTP"
        placeholderTextColor={borderColor} // Use border color for placeholder to ensure visibility
        keyboardType="number-pad"
        secureTextEntry
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Login" onPress={handleLogin} />
      <Link href="/(auth)/register" style={styles.link}>
        <ThemedText type="link">Don&apos;t have an account? Register</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
