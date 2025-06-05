import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// This is just a placeholder for the tab navigator
// The actual scan functionality is in /app/scan.tsx
export default function ScanTabScreen() {
  const router = useRouter();
  
  useEffect(() => {
    // Navigate to the scan screen when this tab is selected
    router.push('/scan');
  }, []);
  
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});