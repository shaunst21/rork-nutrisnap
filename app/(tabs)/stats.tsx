import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TrendingUp, Calendar, Award, Utensils, BarChart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useStatsStore } from '@/store/statsStore';
import StatCard from '@/components/StatCard';

export default function StatsScreen() {
  const {
    todayCalories,
    weekCalories,
    monthCalories,
    averageDailyCalories,
    commonFoods,
    currentStreak,
    longestStreak,
    isLoading,
    fetchStats,
  } = useStatsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calories</Text>
        
        <StatCard
          title="Today"
          value={todayCalories}
          icon={<Calendar size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="This Week"
          value={weekCalories}
          icon={<BarChart size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="This Month"
          value={monthCalories}
          icon={<TrendingUp size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="Daily Average"
          value={averageDailyCalories}
          icon={<BarChart size={24} color={Colors.primary} />}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streaks</Text>
        
        <StatCard
          title="Current Streak"
          value={`${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
          icon={<Award size={24} color={Colors.accent} />}
          color={Colors.accent}
        />
        
        <StatCard
          title="Longest Streak"
          value={`${longestStreak} day${longestStreak !== 1 ? 's' : ''}`}
          icon={<Award size={24} color={Colors.accent} />}
          color={Colors.accent}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Common Foods</Text>
        
        {commonFoods.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No food data yet. Start logging meals to see your most common foods.
            </Text>
          </View>
        ) : (
          commonFoods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <View style={styles.foodRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.food}</Text>
                <Text style={styles.foodCount}>
                  {food.count} time{food.count !== 1 ? 's' : ''}
                </Text>
              </View>
              <Utensils size={20} color={Colors.subtext} />
            </View>
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
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  foodCount: {
    fontSize: 14,
    color: Colors.subtext,
  },
});