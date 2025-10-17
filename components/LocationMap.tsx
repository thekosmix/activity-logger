import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface LocationMapProps {
  locations: Location[];
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {
  if (locations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location History</Text>
      <Text>Showing {locations.length} location{locations.length !== 1 ? 's' : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LocationMap;