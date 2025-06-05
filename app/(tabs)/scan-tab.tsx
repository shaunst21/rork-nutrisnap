import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is just a placeholder for the tab navigator
// The actual scan functionality is in /app/scan.tsx
export default function ScanTabScreen() {
  return (
    <View style={styles.container}>
      <Text>Redirecting to camera...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});