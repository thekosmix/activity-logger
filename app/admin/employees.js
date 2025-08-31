import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

const Employees = () => {
  const unapprovedEmployees = [
    { id: '1', name: 'Jane Doe', phone_number: '0987654321' },
    { id: '2', name: 'Peter Pan', phone_number: '1122334455' },
  ];

  const approvedEmployees = [
    { id: '3', name: 'Mary Poppins', phone_number: '5566778899' },
  ];

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeContainer}>
      <Text>{item.name}</Text>
      <Text>{item.phone_number}</Text>
      <Button title="Approve" onPress={() => {}} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unapproved Employees</Text>
      <FlatList
        data={unapprovedEmployees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.title}>Approved Employees</Text>
      <FlatList
        data={approvedEmployees}
        renderItem={({ item }) => (
          <View style={styles.employeeContainer}>
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
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
  employeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Employees;
