import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { sendOtp, loginUser } from '../services/api';

const Login = () => {
  const [phone_number, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      await sendOtp(phone_number);
      setOtpSent(true);
      Alert.alert('OTP sent successfully');
    } catch (error) {
      Alert.alert('Failed to send OTP', error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({ phone_number, otp });
      // Handle successful login, e.g., store token and navigate to home
      Alert.alert('Login successful');
      router.push('/home');
    } catch (error) {
      Alert.alert('Login failed', error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone_number}
        onChangeText={setPhoneNumber}
      />
      {otpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="number-pad"
            secureTextEntry
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Login" onPress={handleLogin} />
        </>
      ) : (
        <Button title="Send OTP" onPress={handleSendOtp} />
      )}
      <Link href="/register" style={styles.link}>Don't have an account? Register</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  link: {
    marginTop: 16,
    color: 'blue',
  },
});

export default Login;
