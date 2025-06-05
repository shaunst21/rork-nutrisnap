import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus, TrendingUp, Award, Target } from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import MealCard from '@/components/MealCard';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import CalorieGoalProgress from '@/components/CalorieGoalProgress';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import MoreMenu from '@/components/MoreMenu';
import { checkAndUpdateStreak } from '@/utils/streakHelpers';
import { formatDate } from '@/utils/dateHelpers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const Colors = useThemeColors();
  
  const { meals, fetchMeals, syncOfflineMeals } = useMealStore();
  const { 
    todayCalories, 
    currentStreak, 
    longestStreak,
    fetchStats 
  } = useStatsStore();
  const { preferences } = usePreferencesStore();
  const { getSubscriptionTier } = useSubscriptionStore();
  
  const currentTier = getSubscriptionTier();
  const showPremiumBanner = currentTier === 'free';
  
  // Get today's meals
  const todayMeals = meals.filter(meal => {
    const mealDate = new Date(meal.date);
    const today = new Date();
    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  useEffect(() => {
    loadData();
    checkAndUpdateStreak();
  }, []);
  
  const loadData = async () => {
    await fetchMeals();
    await fetchStats();
    await syncOfflineMeals();
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleScan = () => {
    router.push('/scan');
  };
  
  const handleManualEntry = () => {
    router.push('/manual-entry');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerRight: () => <MoreMenu />
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: Colors.background }]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: Colors.text }]}>Hello!</Text>
          <Text style={[styles.subtitle, { color: Colors.subtext }]}>Track your nutrition today</Text>
        </View>
        
        {/* Premium Banner */}
        {showPremiumBanner && <SubscriptionBanner />}
        
        {/* Calorie Goal Progress */}
        <CalorieGoalProgress 
          current={todayCalories} 
          goal={preferences.dailyCalorieGoal} 
        />
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Today's Calories"
            value={todayCalories}
            icon={<TrendingUp size={24} color={Colors.primary} />}
          />
          
          <StatCard
            title="Current Streak"
            value={`${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
            icon={<Award size={24} color={Colors.accent} />}
            color={Colors.accent}
          />
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.card }]} 
            onPress={handleScan}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
              <Camera size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionText, { color: Colors.text }]}>Scan Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.card }]} 
            onPress={handleManualEntry}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
              <Plus size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionText, { color: Colors.text }]}>Add Manually</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Today's Meals</Text>
            <Text style={[styles.dateText, { color: Colors.subtext }]}>{formatDate(new Date())}</Text>
          </View>
          
          {todayMeals.length === 0 ? (
            <EmptyState 
              message="No meals logged today. Start by scanning a meal or adding one manually."
              icon={<Camera size={40} color={Colors.mediumGray} />}
            />
          ) : (
            todayMeals.map(meal => (
              <MealCard
                key={meal.id}
                id={meal.id || ''}
                food={meal.food}
                calories={meal.calories}
                date={meal.date}
                method={meal.method}
                mealType={meal.mealType}
                notes={meal.notes}
                onDelete={loadData}
              />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    marginVertical: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mealsSection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
  },
});