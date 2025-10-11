import * as Location from 'expo-location';
import { updateLocation } from './api';

class BackgroundLocationService {
  constructor() {
    this.locationTask = null;
    this.isTracking = false;
    this.locationInterval = 60000; // 1 minute in milliseconds
    this.watchId = null;
  }

  // Request location permission
  async requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return false;
    }
    return true;
  }

  // Start location tracking
  async startTracking() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      return false;
    }

    this.isTracking = true;
    
    // Call location update immediately
    await this.updateCurrentLocation();
    
    // Then update location every minute
    this.locationTask = setInterval(async () => {
      if (this.isTracking) {
        await this.updateCurrentLocation();
      }
    }, this.locationInterval);

    return true;
  }

  // Update current location
  async updateCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Send location to the backend
      await updateLocation(latitude, longitude);
      console.log(`Location updated: ${latitude}, ${longitude}`);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  }

  // Stop location tracking
  stopTracking() {
    if (this.locationTask) {
      clearInterval(this.locationTask);
      this.locationTask = null;
    }
    this.isTracking = false;
  }

  // Check if tracking is active
  getTrackingStatus() {
    return this.isTracking;
  }
}

export default new BackgroundLocationService();