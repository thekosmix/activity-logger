import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { registerUser } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await registerUser({ name, phone_number, image });
      Alert.alert('Registration successful', 'Please wait for admin approval.');
      router.push('/login');
    } catch (error) {
      Alert.alert('Registration failed', error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone_number}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <Button title="Register" onPress={handleRegister} />
      <Link href="/login" style={styles.link}>Already have an account? Login</Link>
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

export default Register;