import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Plus, 
  TrendingUp, 
  Award, 
  Calendar
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useStatsStore } from '@/store/statsStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import CalorieGoalProgress from '@/components/CalorieGoalProgress';
import SubscriptionBanner from '@/components/SubscriptionBanner';

export default function HomeScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { 
    isTrialAvailable, 
    getSubscriptionTier 
  } = useSubscriptionStore();
  
  const { todayCalories, fetchStats } = useStatsStore();
  const { preferences } = usePreferencesStore();
  
  const currentTier = getSubscriptionTier();
  const canTrial = isTrialAvailable();
  
  // Fetch stats when component mounts
  useEffect(() => {
    fetchStats();
  }, []);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: Colors.text }]}>Good morning,</Text>
          <Text style={[styles.userName, { color: Colors.text }]}>User</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.primary }]}
          onPress={() => router.push('/scan-tab')}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
      </View>
      
      {/* Calorie Progress - Now with proper props */}
      <CalorieGoalProgress 
        current={todayCalories} 
        goal={preferences.dailyCalorieGoal} 
      />
      
      {/* Premium Banner (if not premium) */}
      {currentTier === 'free' && (
        <SubscriptionBanner canTrial={canTrial} />
      )}
      
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Quick Actions</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionItem, { backgroundColor: Colors.card }]}
            onPress={() => router.push('/scan')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary }]}>
              <Calendar size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.quickActionText, { color: Colors.text }]}>Log Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionItem, { backgroundColor: Colors.card }]}
            onPress={() => router.push('/stats')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.accent }]}>
              <TrendingUp size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.quickActionText, { color: Colors.text }]}>View Stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionItem, { backgroundColor: Colors.card }]}
            onPress={() => router.push('/history')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.secondary }]}>
              <Award size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.quickActionText, { color: Colors.text }]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Premium Features */}
      {currentTier === 'premium' && (
        <View style={styles.premiumFeaturesContainer}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Premium Features</Text>
          
          <View style={styles.premiumFeaturesList}>
            <TouchableOpacity 
              style={[styles.premiumFeatureItem, { backgroundColor: Colors.card }]}
              onPress={() => router.push('/export-data')}
            >
              <TrendingUp size={24} color={Colors.primary} />
              <Text style={[styles.premiumFeatureTitle, { color: Colors.text }]}>
                Advanced Analytics
              </Text>
              <Text style={[styles.premiumFeatureDescription, { color: Colors.subtext }]}>
                Get detailed insights
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Recent Meals */}
      <View style={styles.recentMealsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={[styles.viewAllText, { color: Colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.mealsList}>
          <TouchableOpacity style={[styles.mealCard, { backgroundColor: Colors.card }]}>
            <View style={[styles.mealTypeTag, { backgroundColor: Colors.mealTypes.breakfast }]}>
              <Text style={styles.mealTypeText}>Breakfast</Text>
            </View>
            <View style={styles.mealContent}>
              <Text style={[styles.mealName, { color: Colors.text }]}>Oatmeal with Berries</Text>
              <Text style={[styles.mealTime, { color: Colors.subtext }]}>8:30 AM</Text>
              <Text style={[styles.mealCalories, { color: Colors.primary }]}>320 calories</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.mealCard, { backgroundColor: Colors.card }]}>
            <View style={[styles.mealTypeTag, { backgroundColor: Colors.mealTypes.lunch }]}>
              <Text style={styles.mealTypeText}>Lunch</Text>
            </View>
            <View style={styles.mealContent}>
              <Text style={[styles.mealName, { color: Colors.text }]}>Chicken Salad</Text>
              <Text style={[styles.mealTime, { color: Colors.subtext }]}>12:45 PM</Text>
              <Text style={[styles.mealCalories, { color: Colors.primary }]}>450 calories</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.addMealCard, { borderColor: Colors.border }]}
            onPress={() => router.push('/scan-tab')}
          >
            <Plus size={24} color={Colors.primary} />
            <Text style={[styles.addMealText, { color: Colors.primary }]}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Nutrition Tips */}
      <View style={styles.tipsContainer}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Nutrition Tips</Text>
        
        <TouchableOpacity style={[styles.tipCard, { backgroundColor: Colors.card }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af' }}
            style={styles.tipImage}
          />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: Colors.text }]}>
              Hydration Matters
            </Text>
            <Text style={[styles.tipDescription, { color: Colors.subtext }]}>
              Drinking enough water is essential for metabolism and overall health.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '31%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  premiumFeaturesContainer: {
    padding: 16,
  },
  premiumFeaturesList: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  premiumFeatureItem: {
    width: 150,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  premiumFeatureDescription: {
    fontSize: 14,
  },
  recentMealsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealsList: {
    marginBottom: 8,
  },
  mealCard: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  mealTypeTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mealTypeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  mealContent: {
    padding: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
  },
  addMealCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMealText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  tipsContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  tipCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipImage: {
    width: '100%',
    height: 150,
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});