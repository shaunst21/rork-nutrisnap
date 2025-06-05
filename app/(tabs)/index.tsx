import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus, TrendingUp, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import MealCard from '@/components/MealCard';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import { checkAndUpdateStreak } from '@/utils/streakHelpers';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { meals, fetchMeals, syncOfflineMeals } = useMealStore();
  const { 
    todayCalories, 
    currentStreak, 
    longestStreak,
    fetchStats 
  } = useStatsStore();
  
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.subtitle}>Track your nutrition today</Text>
      </View>
      
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
        <TouchableOpacity style={styles.actionButton} onPress={handleScan}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
            <Camera size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>Scan Food</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleManualEntry}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
            <Plus size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionText}>Add Manually</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.mealsSection}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        
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
              onDelete={loadData}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
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
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: Colors.text,
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
    color: Colors.text,
  },
  mealsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});