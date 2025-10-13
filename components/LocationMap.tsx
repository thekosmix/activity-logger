import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import WebView from 'react-native-webview';

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
  // Refs for web map implementation
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  // Web implementation using Leaflet directly
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
            referrerPolicy: 'no-referrer',
            // Better error handling for tile loading
            errorTileUrl: '',
            zIndex: 1
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
            setTimeout(() => map.invalidateSize(), 800);
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

  // Mobile implementation using WebView
  if (locations.length > 0 && Platform.OS !== 'web') {
    return (
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
                  #map { height: 100%; width: 100%; min-height: 300px; position: relative; z-index: 1; }
                </style>
              </head>
              <body>
                <div id="map" style="width:100%; height:100%;"></div>
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                <script>
                  function initializeMap() {
                    // Initialize the map after a slight delay to ensure container is properly sized
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
                      referrerPolicy: 'no-referrer',
                      // Better error handling for tile loading
                      errorTileUrl: '',
                      zIndex: 1
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
                    
                    // Multiple attempts to ensure tiles are loaded properly in WebView
                    setTimeout(function() {
                      map.invalidateSize();
                    }, 100);
                    
                    setTimeout(function() {
                      map.invalidateSize();
                    }, 500);
                    
                    setTimeout(function() {
                      map.invalidateSize();
                    }, 1000);
                  }
                  
                  // Initialize after a brief delay to ensure container is properly sized in WebView
                  setTimeout(initializeMap, 200);
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
              // Handle both iOS and Android for proper tile loading
              setTimeout(() => {
                // In the actual component, we'll need to pass a callback to update the map
              }, 300);
              
              // Additional refresh to ensure tiles load completely
              setTimeout(() => {
                // In the actual component, we'll need to pass a callback to update the map
              }, 800);
            }, 100);
          }}
        />
      </View>
    );
  }

  // Web implementation using direct DOM manipulation
  if (locations.length > 0 && Platform.OS === 'web') {
    // Define web-specific styles
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
    };

    return (
      <div style={webStyles.mapContainer as React.CSSProperties}>
        <div id="web-map" ref={mapRef} style={webStyles.mapElement as React.CSSProperties}></div>
      </div>
    );
  }

  // If no locations, don't render anything
  return null;
};

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 15,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default LocationMap;