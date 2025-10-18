import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, Linking, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getEmployeeLocations } from '../services/api';
import LocationMap from '@/components/LocationMap';

// Conditional import for DateTimePicker
let DateTimePicker;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function EmployeeDetailScreen() {
  const { employeeId } = useLocalSearchParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [locations, setLocations] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [formattedFromDate, setFormattedFromDate] = useState('');
  const [formattedToDate, setFormattedToDate] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRouteButton, setShowRouteButton] = useState(false); // State to show/hide the route button

  useEffect(() => {
    // Parse employee data from the navigation param
    if (typeof employeeId === 'string') {
      const parsedEmployee = JSON.parse(decodeURIComponent(employeeId));
      setEmployee(parsedEmployee);
    }
    
    // Initialize the formatted date strings with today's date
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setFormattedFromDate(formattedToday);
    setFormattedToDate(formattedToday);
  }, [employeeId]);



  const handleFromDatePicker = (event, selectedDate) => {
    if (Platform.OS !== 'web') {
      const currentDate = selectedDate || fromDate;
      setShowFromDatePicker(Platform.OS === 'ios');
      setFromDate(currentDate);
      setFormattedFromDate(currentDate.toISOString().split('T')[0]);
    }
  };

  const handleToDatePicker = (event, selectedDate) => {
    if (Platform.OS !== 'web') {
      const currentDate = selectedDate || toDate;
      setShowToDatePicker(Platform.OS === 'ios');
      setToDate(currentDate);
      setFormattedToDate(currentDate.toISOString().split('T')[0]);
    }
  };

  const handleFromDateWebChange = (event) => {
    setFormattedFromDate(event.target.value);
  };

  const handleToDateWebChange = (event) => {
    setFormattedToDate(event.target.value);
  };

  const handleFetchLocations = async () => {
    if (!employee) {
      Alert.alert('Error', 'Employee data not available');
      return;
    }

    if (!formattedFromDate || !formattedToDate) {
      Alert.alert('Error', 'Please select both from and to dates');
      return;
    }

    setLoading(true);
    try {
      const response = await getEmployeeLocations(employee.id, formattedFromDate, formattedToDate);
      setLocations(response);
      // Show the route button only if we have at least 2 locations
      setShowRouteButton(response.length >= 2);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };

  const handleShowRoute = () => {
    if (locations.length < 2) {
      Alert.alert('Error', 'At least 2 locations are required to show a route');
      return;
    }

    // Format locations for Google Maps directions
    const locationsString = locations
      .map(location => `${location.latitude},${location.longitude}`)
      .join('/');
    
    const googleMapsUrl = `https://www.google.com/maps/dir/${locationsString}`;
    
    Linking.openURL(googleMapsUrl).catch(err => {
      Alert.alert('Error', 'Could not open Google Maps. Make sure it is installed on your device.');
    });
  };

  const handleShowLocation = (latitude, longitude) => {
    if (!latitude || !longitude) {
      Alert.alert('Location not available', 'This location does not have coordinates.');
      return;
    }

    // Format the coordinates for Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open Google Maps. Make sure it is installed on your device.');
    });
  };

  const renderLocation = ({ item }) => (
    <ThemedView style={styles.locationItem}>
      <ThemedView style={styles.locationInfo}>
        <ThemedText style={styles.locationTime}>
          {new Date(item.timestamp).toLocaleString()}
        </ThemedText>
        <ThemedText style={styles.locationCoords}>
          {item.latitude}, {item.longitude}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity 
        style={styles.showOnMapButton}
        onPress={() => handleShowLocation(item.latitude, item.longitude)}
      >
        <ThemedText style={styles.showOnMapText}>Show on Map</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  if (!employee) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Employee not found</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.goBackText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.mainContent}>
        {/* Employee Card - Same as in Manage Employees */}
        <ThemedView style={styles.employeeContainer}>
          <ThemedView style={styles.employeeInfo}>
            <IconSymbol name="person.circle" size={40} color="#000" />
            <ThemedView style={styles.employeeDetails}>
              <ThemedText style={styles.employeeName}>{employee.name}</ThemedText>
              <ThemedText style={styles.employeePhone}>{employee.phone_number}</ThemedText>
              <ThemedText style={[styles.status, employee.is_approved ? styles.approved : styles.pending]}>
                {employee.is_approved ? 'Approved' : 'Pending Approval'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Date Filters */}
        <ThemedView style={styles.filterContainer}>
          <ThemedText style={styles.filterTitle}>Filter Locations by Date</ThemedText>
          
          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateLabel}>From Date:</ThemedText>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={formattedFromDate}
                onChange={handleFromDateWebChange}
                style={styles.webDateInput}
              />
            ) : (
              <>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowFromDatePicker(true)}>
                  <ThemedText style={styles.dateButtonText}>{formattedFromDate || 'Select Date'}</ThemedText>
                </TouchableOpacity>
                {showFromDatePicker && (
                  <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display="default"
                    onChange={handleFromDatePicker}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}
          </View>
          
          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateLabel}>To Date:</ThemedText>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={formattedToDate}
                onChange={handleToDateWebChange}
                style={styles.webDateInput}
              />
            ) : (
              <>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowToDatePicker(true)}>
                  <ThemedText style={styles.dateButtonText}>{formattedToDate || 'Select Date'}</ThemedText>
                </TouchableOpacity>
                {showToDatePicker && (
                  <DateTimePicker
                    value={toDate}
                    mode="date"
                    display="default"
                    onChange={handleToDatePicker}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleFetchLocations}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Loading...' : 'Fetch Locations'}
              </ThemedText>
            </TouchableOpacity>
            
            {showRouteButton && (
              <TouchableOpacity 
                style={[styles.button, styles.routeButton]} 
                onPress={handleShowRoute}
              >
                <ThemedText style={styles.buttonText}>
                  Show Route
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Map Widget - Using dedicated LocationMap component */}
          {locations.length > 0 && (
            <LocationMap locations={locations} />
          )}
        </ThemedView>

        {/* Location History */}
        <ThemedView style={styles.locationContainer}>
          <ThemedText style={styles.locationTitle}>Location History</ThemedText>
          <FlatList
            data={locations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLocation}
            contentContainerStyle={locations.length === 0 ? styles.noLocations : null}
            ListEmptyComponent={
              <ThemedText style={styles.noLocationsText}>
                {loading ? 'Loading locations...' : 'No locations found for the selected date range'}
              </ThemedText>
            }
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 15,
  },
  mainContent: {
    flex: 1,
  },
  employeeContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
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
  filterContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateLabel: {
    width: 80,
    fontSize: 14,
  },
  dateButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  webDateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  webLocationListContainer: {
    marginTop: 15,
    flex: 1,
  },
  webLocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
    marginBottom: 10, // Add space between buttons if more than one
  },
  routeButton: {
    backgroundColor: '#28a745', // Different color to distinguish from fetch button
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locationContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationInfo: {
    flex: 1,
    marginRight: 10,
  },
  locationTime: {
    fontWeight: 'bold',
  },
  locationCoords: {
    color: 'gray',
  },
  showOnMapButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  showOnMapText: {
    color: 'white',
    fontSize: 12,
  },
  noLocations: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noLocationsText: {
    fontStyle: 'italic',
    color: 'gray',
  },
  goBackText: {
    color: '#007BFF',
    marginTop: 10,
  },
});

// Web-specific styles