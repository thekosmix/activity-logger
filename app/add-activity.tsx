
import { useState } from 'react';
import { StyleSheet, TextInput, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  const router = useRouter();

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
      console.log('Selected media URI:', localUri);
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
    try {
      // Use uploadedMediaUrl if available, otherwise null
      const response = await createActivity({ title, description, media_url: uploadedMediaUrl });
      if (response.id) {
        Alert.alert('Success', 'Activity created successfully.', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to the home screen
              router.back();
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to create activity');
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
