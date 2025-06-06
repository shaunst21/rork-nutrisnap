import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Edit3 } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ScanTabScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  
  const handleScanPress = () => {
    router.push('/scan');
  };
  
  const handleManualEntryPress = () => {
    router.push('/manual-entry');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.text }]}>Add Food</Text>
      <Text style={[styles.subtitle, { color: Colors.subtext }]}>
        Choose how you want to add your meal
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]} 
          onPress={handleScanPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
            <Camera size={32} color={Colors.primary} />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Scan Food</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            Take a photo of your food and let AI identify it
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]} 
          onPress={handleManualEntryPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.secondary + '20' }]}>
            <Edit3 size={32} color={Colors.secondary} />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Manual Entry</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            Enter food details manually for more control
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.tip, { color: Colors.subtext }]}>
        Tip: For best results when scanning, make sure your food is clearly visible and well-lit.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tip: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 24,
    textAlign: 'center',
  },
});