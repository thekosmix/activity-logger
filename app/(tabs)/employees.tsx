import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getEmployees, approveEmployee } from '../services/api';
import { useRouter } from 'expo-router';

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (employeeId, isApproved) => {
    try {
      await approveEmployee(employeeId, isApproved);
      
      // Update the local state to reflect the change
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, is_approved: isApproved } 
            : emp
        )
      );
      
      Alert.alert('Success', `Employee status updated successfully`);
    } catch (error) {
      console.error('Error updating employee status:', error);
      Alert.alert('Error', 'Failed to update employee status');
    }
  };

  const renderEmployee = ({ item }) => (
    <TouchableOpacity 
      style={styles.employeeContainer}
      onPress={() => router.push(`/employee-detail?employeeId=${encodeURIComponent(JSON.stringify(item))}`)}
    >
      <ThemedView style={styles.employeeInfo}>
        <IconSymbol name="person.circle" size={40} color="#000" />
        <ThemedView style={styles.employeeDetails}>
          <ThemedText style={styles.employeeName}>{item.name}</ThemedText>
          <ThemedText style={styles.employeePhone}>{item.phone_number}</ThemedText>
          <ThemedText style={[styles.status, item.is_approved ? styles.approved : styles.pending]}>
            {item.is_approved ? 'Approved' : 'Pending Approval'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      {!item.is_approved && (
        <ThemedView style={styles.actionButtons}>
          <Button 
            title="Approve" 
            color="#4CAF50" 
            onPress={(e) => {
              e.stopPropagation(); // Prevent the parent TouchableOpacity from triggering
              handleApproveReject(item.id, true)
            }} 
          />
          <View style={styles.spacer} />
          <Button 
            title="Reject" 
            color="#F44336" 
            onPress={(e) => {
              e.stopPropagation(); // Prevent the parent TouchableOpacity from triggering
              handleApproveReject(item.id, false)
            }} 
          />
        </ThemedView>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading employees...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Employee Management</ThemedText>
      </ThemedView>
      
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmployee}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  employeeDetails: {
    marginLeft: 10,
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeePhone: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  approved: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  },
  pending: {
    backgroundColor: '#fff3e0',
    color: '#ff9800',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  spacer: {
    width: 10,
  },
});