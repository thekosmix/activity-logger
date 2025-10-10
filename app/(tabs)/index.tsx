
import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Button, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getActivities } from '../services/api';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 5;
  const { signOut } = useAuth();
  const router = useRouter();

  const fetchActivities = async (pageNum = 1, shouldReset = false) => {
    if (loading || (!hasMore && pageNum > 1)) return;
    
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getActivities(pageNum, PAGE_SIZE);

      if (response.length > 0) {
        if (shouldReset) {
          setActivities(response);
        } else {
          setActivities(prev => [...prev, ...response]);
        }
        
        // If we received fewer items than the limit, there's no more data
        if (response.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        // If we get an empty response, there's no more data
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage, false);
    }
  };

  const refreshActivities = () => {
    setPage(1);
    setHasMore(true);
    fetchActivities(1, true);
  };

  useEffect(() => {
    fetchActivities(1, true);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityContainer} 
      onPress={() => router.push(`/activity-detail?id=${item.id}`)}
    >
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText style={styles.description}>{item.description}</ThemedText>
      {item.media_url ? (
        <Image 
          source={{ uri: item.media_url }} 
          style={styles.media}
          resizeMode="cover"
        />
      ) : null}
      <ThemedView style={styles.activityFooter}>
        <ThemedText style={styles.time}>{new Date(item.timestamp).toLocaleString()}</ThemedText>
        <ThemedText style={styles.user}>{item.user_name}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loadingMore ? (
            <ThemedView style={styles.loadingMoreContainer}>
              <ThemedText>Loading more...</ThemedText>
            </ThemedView>
          ) : null
        }
        refreshing={loading}
        onRefresh={refreshActivities}
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

  user: {
    fontWeight: 'bold',
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  loadingMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
