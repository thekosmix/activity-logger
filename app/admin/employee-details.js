import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const EmployeeDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Details</Text>
      <Button title="Select Date" onPress={() => {}} />
      <View style={styles.mapPlaceholder} />
      <Text style={styles.title}>Activities</Text>
      {/* Activity list will go here */}
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
  mapPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});

export default EmployeeDetails;
