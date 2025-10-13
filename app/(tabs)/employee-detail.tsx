import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, Linking, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getEmployeeLocations } from '../services/api';

// Conditional import for DateTimePicker
let DateTimePicker;
let WebView;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
  WebView = require('react-native-webview').WebView;
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

  // Add mapRef and mapInstance refs for web map rendering
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

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

  // Initialize and update map for web
  useEffect(() => {
    if (Platform.OS === 'web' && locations.length > 0 && mapRef.current) {
      // Dynamically load Leaflet when needed
      const initMap = async () => {
        // Ensure DOM has rendered the container
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if DOM is available (client-side)
        if (typeof window !== 'undefined' && window.document) {
          // Check if Leaflet is already loaded
          if (typeof L === 'undefined') {
            // Dynamically import Leaflet
            await import('leaflet');
          }
          
          // Clean up previous map instance if it exists
          if (mapInstance.current) {
            mapInstance.current.remove();
          }
          
          // Set default icon options for Leaflet to handle missing marker files
          L.Icon.Default.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          });
          
          // Create map
          const map = L.map(mapRef.current).setView([locations[0].latitude, locations[0].longitude], 10);
          
          // Add tile layer with more detailed configuration and a different provider to avoid ORB issues
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: 0,
            // Additional options to help with tile loading
            detectRetina: true,
            crossOrigin: true,
            referrerPolicy: 'no-referrer'
          }).addTo(map);
          
          // Add markers and polylines
          const markers = [];
          locations.forEach((loc, index) => {
            const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
            marker.bindPopup(`<b>Location ${index + 1}</b><br>
                              Time: ${new Date(loc.timestamp).toLocaleString()}<br>
                              Coords: ${loc.latitude}, ${loc.longitude}`);
            markers.push(marker);
          });
          
          // Add polyline connecting the points if there are multiple locations
          if (locations.length > 1) {
            const latLngs = locations.map(loc => [loc.latitude, loc.longitude]);
            const polyline = L.polyline(latLngs, {color: 'red', weight: 3}).addTo(map);
            
            // Fit bounds to include all points and the path
            const group = new L.featureGroup([...markers, polyline]);
            map.fitBounds(group.getBounds().pad(0.1));
          } else {
            // If only one location, just center on it
            map.setView([locations[0].latitude, locations[0].longitude], 13);
          }
          
          // Multiple attempts to ensure tiles load properly
          setTimeout(() => {
            map.invalidateSize();
            // Additional refresh after a longer delay to ensure tiles fully load
            setTimeout(() => map.invalidateSize(), 300);
          }, 100);
          
          // Store map instance for cleanup
          mapInstance.current = map;
        }
      };
      
      initMap();
    }
    
    // Cleanup function
    return () => {
      if (Platform.OS === 'web' && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [locations]);

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
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
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
          </View>
          
          {/* Map Widget - Using OpenStreetMap for mobile, fallback for web */}
          {locations.length > 0 && Platform.OS !== 'web' ? (
            <View style={styles.mapContainer}>
              <WebView
                originWhitelist={['*']}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                      <style>
                        body { margin: 0; padding: 0; }
                        #map { height: 100%; width: 100%; min-height: 300px; }
                      </style>
                    </head>
                    <body>
                      <div id="map" style="width:100%; height:100%;"></div>
                      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                      <script>
                        document.addEventListener('DOMContentLoaded', function() {
                          // Initialize the map after DOM is loaded
                          var map = L.map('map').setView([${locations[0].latitude}, ${locations[0].longitude}], 10);

                          // Add OpenStreetMap tiles with proper attribution and parameters to avoid ORB issues
                          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            maxZoom: 19,
                            tileSize: 256,
                            zoomOffset: 0,
                            // Additional options to help with tile loading
                            detectRetina: true,
                            crossOrigin: true,
                            referrerPolicy: 'no-referrer'
                          }).addTo(map);

                          // Add markers for each location
                          var locations = ${JSON.stringify(locations)};
                          var markers = [];
                          
                          locations.forEach(function(loc, index) {
                            var marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                            marker.bindPopup('<b>Location ' + (index + 1) + '</b><br>' +
                                            'Time: ' + new Date(loc.timestamp).toLocaleString() + '<br>' + 
                                            'Coords: ' + loc.latitude + ', ' + loc.longitude);
                            markers.push(marker);
                          });
                          
                          // Fit the map to include all markers
                          if (markers.length > 0) {
                            var group = new L.featureGroup(markers);
                            map.fitBounds(group.getBounds().pad(0.1));
                          }
                          
                          // Ensure tiles are loaded properly
                          setTimeout(function() {
                            map.invalidateSize();
                          }, 100);
                        });
                      </script>
                    </body>
                    </html>
                  `
                }}
                style={{ height: 300 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoadEnd={() => {
                  // Ensure the map is properly sized after loading
                  setTimeout(() => {
                    if (Platform.OS === 'ios') {
                      // On iOS, force a refresh after loading
                      setTimeout(() => {
                        // Trigger resize to ensure tiles load properly
                        mapInstance.current?.invalidateSize();
                      }, 200);
                    }
                  }, 100);
                }}
              />
            </View>
          ) : locations.length > 0 && Platform.OS === 'web' ? (
            // Map for web using Leaflet directly
            <div style={webStyles.mapContainer}>
              <div id="web-map" ref={mapRef} style={webStyles.mapElement}></div>
            </div>
          ) : null}
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
  mapContainer: {
    marginTop: 15,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
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
const webStyles = {
  mapContainer: {
    marginTop: 15,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapElement: {
    height: '100%',
    width: '100%',
  },
  pathInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 4,
    zIndex: 1000,
  },
};