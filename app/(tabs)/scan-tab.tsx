import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { 
  Camera, 
  Utensils, 
  Search, 
  BarChart2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function ScanTabScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Add Food</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]}
          onPress={() => router.push('/scan')}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: Colors.primary }]}>
            <Camera size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Scan Food</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            Take a photo of your food to log it
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]}
          onPress={() => router.push('/manual-entry')}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: Colors.secondary }]}>
            <Utensils size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Manual Entry</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            Log your meal manually
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]}
          onPress={() => router.push('/search')}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: Colors.accent }]}>
            <Search size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Search Foods</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            Search our food database
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: Colors.card }]}
          onPress={() => router.push('/custom-foods')}
        >
          <View style={[
            styles.optionIconContainer, 
            { backgroundColor: hasFeature('custom_foods') ? Colors.success : Colors.mediumGray }
          ]}>
            <BarChart2 size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.optionTitle, { color: Colors.text }]}>Custom Foods</Text>
          <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
            {hasFeature('custom_foods') 
              ? 'Create and manage your custom foods' 
              : 'Premium feature'}
          </Text>
          {!hasFeature('custom_foods') && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.recentContainer}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Recent Foods</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentFoodsList}
        >
          <TouchableOpacity style={styles.recentFoodItem}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
              style={styles.recentFoodImage}
            />
            <Text style={[styles.recentFoodName, { color: Colors.text }]}>Salad</Text>
            <Text style={[styles.recentFoodCalories, { color: Colors.subtext }]}>320 cal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentFoodItem}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187' }} 
              style={styles.recentFoodImage}
            />
            <Text style={[styles.recentFoodName, { color: Colors.text }]}>Pasta</Text>
            <Text style={[styles.recentFoodCalories, { color: Colors.subtext }]}>450 cal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentFoodItem}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929' }} 
              style={styles.recentFoodImage}
            />
            <Text style={[styles.recentFoodName, { color: Colors.text }]}>Pancakes</Text>
            <Text style={[styles.recentFoodCalories, { color: Colors.subtext }]}>380 cal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentFoodItem}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1529042410759-befb1204b468' }} 
              style={styles.recentFoodImage}
            />
            <Text style={[styles.recentFoodName, { color: Colors.text }]}>Yogurt</Text>
            <Text style={[styles.recentFoodCalories, { color: Colors.subtext }]}>150 cal</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  recentFoodsList: {
    paddingBottom: 16,
  },
  recentFoodItem: {
    marginRight: 16,
    width: 120,
  },
  recentFoodImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentFoodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentFoodCalories: {
    fontSize: 14,
  },
});