
import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getActivities } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const [activities, setActivities] = useState([]);
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await getActivities();
      if (response.success) {
        setActivities(response.data);
      }
    };
    fetchActivities();
  }, []);

  const renderItem = ({ item }) => (
    <ThemedView style={styles.activityContainer}>
      <ThemedView style={styles.activityHeader}>
        <IconSymbol name="person.circle" size={40} />
        <ThemedView style={styles.activityHeaderText}>
          <ThemedText style={styles.user}>{item.user.name}</ThemedText>
          <ThemedText style={styles.time}>{new Date(item.timestamp).toLocaleDateString()}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.description}>{item.description}</ThemedText>
      <ThemedView style={styles.activityFooter}>
        <ThemedView style={styles.footerAction}>
          <IconSymbol name="heart" size={20} />
          <ThemedText>{item.likes}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.footerAction}>
          <IconSymbol name="chat.bubble" size={20} />
          <ThemedText>{item.comments.length}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <Button title="Logout" onPress={() => signOut()} />
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-activity')}>
        <IconSymbol name="plus" size={30} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityHeaderText: {
    marginLeft: 10,
  },
  user: {
    fontWeight: 'bold',
  },
  time: {
    color: 'gray',
  },
  description: {
    marginBottom: 10,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    elevation: 8,
  },
});
