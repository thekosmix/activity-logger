
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { register } from '../services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');

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

  const handleRegister = async () => {
    const validation = validateInput(identifier);
    
    if (!validation) {
      Alert.alert('Error', 'Please enter a valid email or 10-digit phone number.');
      return;
    }
    
    try {
      const response = await register(name, identifier);
      if (response.success) {
        Alert.alert('Success', 'You have been registered successfully. Please wait for admin approval.');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Register</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone number"
        keyboardType={identifier.includes('@') ? 'email-address' : 'default'}
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Register" onPress={handleRegister} />
      <Link href="/(auth)/login" style={styles.link}>
        <ThemedText type="link">Already have an account? Login</ThemedText>
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
