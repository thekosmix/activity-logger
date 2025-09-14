
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { sendOtp, login } from '../services/api';
import { useAuth } from '../_layout';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { setIsAuthenticated } = useAuth();

  const handleSendOtp = async () => {
    try {
      const response = await sendOtp(phoneNumber);
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
    try {
      const response = await login(phoneNumber, otp);
      if (response.success) {
        // TODO: Save the token
        setIsAuthenticated(true);
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
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
      <TextInput
        style={styles.input}
        placeholder="OTP"
        keyboardType="number-pad"
        secureTextEntry
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Login" onPress={handleLogin} />
      <Link href="/(auth)/register" style={styles.link}>
        <ThemedText type="link">Don't have an account? Register</ThemedText>
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
