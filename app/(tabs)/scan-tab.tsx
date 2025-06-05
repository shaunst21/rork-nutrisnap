import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ScanTabScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  
  const handleScan = () => {
    router.push('/scan');
  };
  
  const handleManualEntry = () => {
    router.push('/manual-entry');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.text }]}>Add a Meal</Text>
        <Text style={[styles.subtitle, { color: Colors.subtext }]}>
          Track your nutrition by scanning food or adding it manually
        </Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.optionCard, { backgroundColor: Colors.card }]} 
            onPress={handleScan}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
              <Camera size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: Colors.text }]}>Scan Food</Text>
            <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
              Take a photo of your food and let AI identify it
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionCard, { backgroundColor: Colors.card }]} 
            onPress={handleManualEntry}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
              <Plus size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.optionTitle, { color: Colors.text }]}>Manual Entry</Text>
            <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
              Enter food details manually for precise tracking
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 24,
  },
  optionCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
});