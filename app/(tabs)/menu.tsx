
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Switch, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../context/AuthContext';
import { clockInOrOut } from '../services/api';
import BackgroundLocationService from '../services/locationService';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const { user, signOut } = useAuth();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const router = useRouter();
  
  // Check if the user is an admin
  const isAdmin = user ? JSON.parse(user).is_admin : false;

  const handleClockInOut = async () => {
    try {
      const response = await clockInOrOut({is_clock_in: !isClockedIn});
      
      if (response.id) {
        const newClockedInStatus = !isClockedIn;
        setIsClockedIn(newClockedInStatus);
        
        // Start or stop location tracking based on clock-in status
        if (newClockedInStatus) {
          // User is clocking in - start location tracking
          const success = await BackgroundLocationService.startTracking();
          if (!success) {
            console.error('Failed to start location tracking');
          }
        } else {
          // User is clocking out - stop location tracking
          BackgroundLocationService.stopTracking();
        }
      }
    } catch (error) {
      console.error('Error with clock in/out:', error);
    }
  };

  useEffect(() => {
    // Cleanup: Stop location tracking when the component unmounts
    return () => {
      if (isClockedIn) {
        BackgroundLocationService.stopTracking();
      }
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.profileContainer}>
        <IconSymbol name="person.circle" size={80} color="#000" />
        <ThemedView style={styles.profileText}>
          <ThemedText style={styles.name}>
            {user ? JSON.parse(user).name : ''}
          </ThemedText>
          <ThemedText style={styles.id}>ID:
            {user ? JSON.parse(user).id : ''}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <TouchableOpacity style={styles.changePhotoButton}>
        <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
      </TouchableOpacity>
      <ThemedView style={styles.workLogContainer}>
        <ThemedText>Clock in for the day</ThemedText>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isClockedIn ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleClockInOut}
          value={isClockedIn}
        />
      </ThemedView>
      
      {/* Show "Manage Employees" button only for admins */}
      {isAdmin && (
        <Button 
          title="Manage Employees" 
          onPress={() => router.push('/admin/employees')}
        />
      )}
      
      <ThemedView style={styles.logoutButtonContainer}>
        <Button title="Logout" onPress={() => {
          // Stop location tracking on logout
          if (isClockedIn) {
            BackgroundLocationService.stopTracking();
          }
          signOut();
          router.replace('/(auth)/login');
        }} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 16,
    color: 'gray',
  },
  changePhotoButton: {
    marginBottom: 20,
  },
  changePhotoText: {
    color: '#007BFF',
  },
  workLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonContainer: {
    marginTop: 10,
  },
});
