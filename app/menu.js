import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

const Menu = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar6.png' }}
      />
      <Text style={styles.name}>John Doe</Text>
      <Button title="Login for the Day" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default Menu;
