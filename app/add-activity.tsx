
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Import axios

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { createActivity } from './services/api';

export default function AddActivityScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // This will now store the local URI for display before upload, then the uploaded URL
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null); // Stores the URL from the backend
  const [isUploading, setIsUploading] = useState(false); // Loading state for media upload

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) { // Changed from !result.cancelled to !result.canceled for newer Expo versions
      const localUri = result.assets[0].uri; // Access uri from assets array
      setImage(localUri); // Display local image immediately

      setIsUploading(true);
      const formData = new FormData();
      const fileType = localUri.split('.').pop();
      const fileName = localUri.split('/').pop();

      formData.append('media', {
        uri: localUri,
        name: fileName,
        type: `image/${fileType}`,
      });

      try {
        const response = await axios.post('http://localhost:3000/api/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.url) {
          setUploadedMediaUrl(response.data.url); // Store the backend URL
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
    try {
      // Use uploadedMediaUrl if available, otherwise null
      const response = await createActivity({ title, description, media_url: uploadedMediaUrl });
      if (response.success) {
        Alert.alert('Success', 'Activity created successfully.');
        // TODO: Navigate back to the home screen
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the activity. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add Activity</ThemedText>
      </ThemedView>
      <Button title="Pick an image or video" onPress={pickImage} disabled={isUploading} />
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />} 
      {uploadedMediaUrl && <Image source={{ uri: uploadedMediaUrl }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add Activity" onPress={handleAddActivity} disabled={isUploading} />
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
});
