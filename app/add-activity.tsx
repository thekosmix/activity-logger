
import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { createActivity, uploadMedia } from './services/api';

export default function AddActivityScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null); // This will now store the local URI for display before upload, then the uploaded URL
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null); // Stores the URL from the backend
  const [isUploading, setIsUploading] = useState(false); // Loading state for media upload
  const [isCreatingActivity, setIsCreatingActivity] = useState(false); // Loading state for activity creation
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);
    })();
  }, []);

  const pickImage = async () => {
    // Update the ImagePicker to return base64 by adding base64: true
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // This will return the base64 string of the image
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const base64String = result.assets[0].base64; // Get the base64 string
      
      setImage(localUri); // Display local image immediately

      setIsUploading(true);
      const fileType = localUri.split('.').pop();
      
      // Determine the correct MIME type based on file extension
      let mimeType;
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType.toLowerCase())) {
        mimeType = `image/${fileType}`;
      } else if (['mp4', 'mov', 'avi', 'mkv'].includes(fileType.toLowerCase())) {
        mimeType = `video/${fileType}`;
      } else {
        mimeType = `application/${fileType}`;
      }

      const mediaData = {
        media: `data:${mimeType};base64,${base64String}` // Format as data URL
      };

      try {
        const response = await uploadMedia(mediaData);

        if (response && response.url) {
          setUploadedMediaUrl(response.url); // Store the backend URL
          Alert.alert('Success', 'Media uploaded successfully!');
        } else {
          Alert.alert('Error', 'Failed to get media URL from server.');
        }
      } catch (error) {
        console.error('Media upload error:', error);
        Alert.alert('Error', 'Failed to upload media. Please try again.');
        setUploadedMediaUrl(null); // Clear URL on error
        setImage(null); // Clear local image on error
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddActivity = async () => {
    // Early return if already creating an activity or media is still uploading
    if (isCreatingActivity || isUploading) {
      return;
    }
    
    setIsCreatingActivity(true);
    try {
      // Use uploadedMediaUrl if available, otherwise null
      const activityData = { 
        title, 
        description, 
        media_url: uploadedMediaUrl,
        // Include location data if available
        ...(location && { 
          latitude: location.latitude, 
          longitude: location.longitude 
        })
      };
      
      const response = await createActivity(activityData);
      if (response.id) {
        // Navigate directly to the home screen to trigger the focus effect
        router.navigate('/');
      } else {
        Alert.alert('Error', response.message || 'Failed to create activity');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the activity. Please try again.');
    } finally {
      setIsCreatingActivity(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add Activity</ThemedText>
      </ThemedView>
      <Button title="Pick an image or video" onPress={pickImage} disabled={isUploading || isCreatingActivity} />
      {(isUploading || isCreatingActivity) && <ActivityIndicator size="large" color="#0000ff" />} 
      {uploadedMediaUrl && <Image source={{ uri: uploadedMediaUrl }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        editable={!isCreatingActivity}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
        editable={!isCreatingActivity}
      />
      <Button 
        title={isCreatingActivity ? "Adding Activity..." : "Add Activity"} 
        onPress={handleAddActivity} 
        disabled={isUploading || isCreatingActivity} 
      />
      {isCreatingActivity && <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain', // Added resizeMode for better image display
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  activityIndicator: {
    marginTop: 20,
  },
});
