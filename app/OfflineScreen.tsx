import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OfflineScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are offline</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default OfflineScreen;
