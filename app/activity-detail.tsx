import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, Button, Alert, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getActivityDetails, addComment } from './services/api';
import { useAuth } from '../context/AuthContext';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const [activity, setActivity] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchActivityDetails();
  }, []);

  const fetchActivityDetails = async () => {
    try {
      const response = await getActivityDetails(id);
      setActivity(response.activity);
      setComments(response.comments);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      Alert.alert('Error', 'Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    try {
      const response = await addComment(id, newComment);
      if (response.id) {
        // Add the new comment to the list
        const newCommentObj = {
          id: response.id,
          user_id: user.id,
          user_name: user.name,
          comment: newComment,
          timestamp: new Date().toISOString()
        };
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment('');
      } else {
        Alert.alert('Error', response.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const handleShowLocation = () => {
    if (!activity || activity.latitude === null || activity.longitude === null) {
      Alert.alert('Location not available', 'This activity does not have location data.');
      return;
    }

    // Format the coordinates for Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${activity.latitude},${activity.longitude}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open Google Maps. Make sure it is installed on your device.');
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading activity details...</ThemedText>
      </ThemedView>
    );
  }

  if (!activity) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Activity not found</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Activity details */}
      <ThemedView style={styles.activityContainer}>
        <ThemedText style={styles.title}>{activity.title}</ThemedText>
        <ThemedText style={styles.description}>{activity.description}</ThemedText>
        {activity.media_url ? (
          <Image 
            source={{ uri: activity.media_url }} 
            style={styles.media}
            resizeMode="cover"
          />
        ) : null}
        <ThemedView style={styles.activityFooter}>
          <ThemedText style={styles.time}>{new Date(activity.timestamp).toLocaleString()}</ThemedText>
          <ThemedText style={styles.user}>{activity.user_name}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Show location button */}
      {(activity.latitude !== null && activity.longitude !== null) && (
        <TouchableOpacity style={styles.showLocationButton} onPress={handleShowLocation}>
          <ThemedText style={styles.showLocationButtonText}>Show Location</ThemedText>
        </TouchableOpacity>
      )}

      {/* Comments section */}
      <ThemedView style={styles.commentsContainer}>
        <ThemedText style={styles.commentsTitle}>Comments</ThemedText>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <ThemedView key={comment.id} style={styles.commentContainer}>
              <ThemedText style={styles.commentUser}>{comment.user_name}</ThemedText>
              <ThemedText style={styles.commentText}>{comment.comment}</ThemedText>
              <ThemedText style={styles.commentTime}>{new Date(comment.timestamp).toLocaleString()}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.noCommentsText}>No comments yet</ThemedText>
        )}
      </ThemedView>

      {/* Add comment section */}
      <ThemedView style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <Button title="Post Comment" onPress={handleAddComment} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  activityContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    marginBottom: 10,
    lineHeight: 20,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  user: {
    fontWeight: 'bold',
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  showLocationButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  showLocationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    margin: 15,
    marginTop: 0,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
  },
  commentTime: {
    fontSize: 12,
    color: 'gray',
  },
  noCommentsText: {
    fontStyle: 'italic',
    color: 'gray',
  },
  addCommentContainer: {
    padding: 15,
    paddingTop: 0,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});