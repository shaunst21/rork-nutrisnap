import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TrendingUp, Calendar, Award, Utensils, BarChart, Target } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useStatsStore } from '@/store/statsStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import StatCard from '@/components/StatCard';
import WeeklyCalorieChart from '@/components/WeeklyCalorieChart';

export default function StatsScreen() {
  const {
    todayCalories,
    weekCalories,
    monthCalories,
    averageDailyCalories,
    weeklyCalorieData,
    mealTypeCalories,
    commonFoods,
    currentStreak,
    longestStreak,
    isLoading,
    fetchStats,
  } = useStatsStore();
  
  const { preferences } = usePreferencesStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };
  
  // Calculate total calories from meal types
  const totalMealTypeCalories = 
    mealTypeCalories.breakfast + 
    mealTypeCalories.lunch + 
    mealTypeCalories.dinner + 
    mealTypeCalories.snack + 
    mealTypeCalories.other;
  
  // Calculate percentages for meal types
  const getPercentage = (value: number) => {
    if (totalMealTypeCalories === 0) return 0;
    return Math.round((value / totalMealTypeCalories) * 100);
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Weekly Chart */}
      <WeeklyCalorieChart 
        data={weeklyCalorieData} 
        goal={preferences.dailyCalorieGoal}
      />
      
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
      
      {/* Meal Type Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Meal Breakdown</Text>
        
        <View style={styles.mealTypeCard}>
          {totalMealTypeCalories > 0 ? (
            <>
              <View style={styles.mealTypeBar}>
                {mealTypeCalories.breakfast > 0 && (
                  <View 
                    style={[
                      styles.mealTypeSegment, 
                      { 
                        backgroundColor: Colors.mealTypes.breakfast,
                        width: `${getPercentage(mealTypeCalories.breakfast)}%` 
                      }
                    ]} 
                  />
                )}
                {mealTypeCalories.lunch > 0 && (
                  <View 
                    style={[
                      styles.mealTypeSegment, 
                      { 
                        backgroundColor: Colors.mealTypes.lunch,
                        width: `${getPercentage(mealTypeCalories.lunch)}%` 
                      }
                    ]} 
                  />
                )}
                {mealTypeCalories.dinner > 0 && (
                  <View 
                    style={[
                      styles.mealTypeSegment, 
                      { 
                        backgroundColor: Colors.mealTypes.dinner,
                        width: `${getPercentage(mealTypeCalories.dinner)}%` 
                      }
                    ]} 
                  />
                )}
                {mealTypeCalories.snack > 0 && (
                  <View 
                    style={[
                      styles.mealTypeSegment, 
                      { 
                        backgroundColor: Colors.mealTypes.snack,
                        width: `${getPercentage(mealTypeCalories.snack)}%` 
                      }
                    ]} 
                  />
                )}
                {mealTypeCalories.other > 0 && (
                  <View 
                    style={[
                      styles.mealTypeSegment, 
                      { 
                        backgroundColor: Colors.mediumGray,
                        width: `${getPercentage(mealTypeCalories.other)}%` 
                      }
                    ]} 
                  />
                )}
              </View>
              
              <View style={styles.mealTypeLegend}>
                {mealTypeCalories.breakfast > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.mealTypes.breakfast }]} />
                    <Text style={styles.legendText}>Breakfast: {mealTypeCalories.breakfast} cal</Text>
                  </View>
                )}
                
                {mealTypeCalories.lunch > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.mealTypes.lunch }]} />
                    <Text style={styles.legendText}>Lunch: {mealTypeCalories.lunch} cal</Text>
                  </View>
                )}
                
                {mealTypeCalories.dinner > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.mealTypes.dinner }]} />
                    <Text style={styles.legendText}>Dinner: {mealTypeCalories.dinner} cal</Text>
                  </View>
                )}
                
                {mealTypeCalories.snack > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.mealTypes.snack }]} />
                    <Text style={styles.legendText}>Snack: {mealTypeCalories.snack} cal</Text>
                  </View>
                )}
                
                {mealTypeCalories.other > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.mediumGray }]} />
                    <Text style={styles.legendText}>Other: {mealTypeCalories.other} cal</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              No meals logged today. Add meals to see your breakdown.
            </Text>
          )}
        </View>
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
  mealTypeCard: {
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
  mealTypeBar: {
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  mealTypeSegment: {
    height: '100%',
  },
  mealTypeLegend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.text,
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