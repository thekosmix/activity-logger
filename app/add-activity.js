import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddActivity = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Activity</Text>
      <View style={styles.mediaPlaceholder} />
      <TextInput
        style={styles.input}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
      />
      <Button title="Add Activity" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
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
});

export default AddActivity;
