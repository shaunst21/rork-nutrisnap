import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Calendar, Filter } from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import MealCard from '@/components/MealCard';
import EmptyState from '@/components/EmptyState';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function HistoryScreen() {
  const { meals, fetchMeals, isLoading: mealsLoading } = useMealStore();
  const { fetchStats } = useStatsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'scan' | 'manual'>('all');
  const Colors = useThemeColors();
  
  useEffect(() => {
    fetchMeals();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMeals(), fetchStats()]);
    setRefreshing(false);
  };
  
  // Group meals by date
  const groupedMeals: { [key: string]: typeof meals } = {};
  
  // Filter meals based on selected filter
  const filteredMeals = meals.filter(meal => {
    if (filterType === 'all') return true;
    if (!meal.method) return false;
    return meal.method === filterType;
  });
  
  // Sort meals by date (newest first)
  const sortedMeals = [...filteredMeals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group meals by date
  sortedMeals.forEach(meal => {
    const date = new Date(meal.date).toDateString();
    if (!groupedMeals[date]) {
      groupedMeals[date] = [];
    }
    groupedMeals[date].push(meal);
  });
  
  // Convert grouped meals to array for FlatList
  const mealsByDate = Object.entries(groupedMeals).map(([date, meals]) => ({
    date,
    meals,
  }));
  
  const renderDateHeader = (date: string) => {
    const mealDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let displayDate = date;
    
    if (mealDate.toDateString() === today.toDateString()) {
      displayDate = 'Today';
    } else if (mealDate.toDateString() === yesterday.toDateString()) {
      displayDate = 'Yesterday';
    } else {
      displayDate = mealDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
    
    return (
      <View style={[styles.dateHeader, { backgroundColor: Colors.card }]}>
        <Calendar size={16} color={Colors.primary} />
        <Text style={[styles.dateText, { color: Colors.text }]}>{displayDate}</Text>
      </View>
    );
  };
  
  const handleDeleteMeal = async () => {
    // After deleting a meal, refresh both meals and stats
    await Promise.all([fetchMeals(), fetchStats()]);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.filterContainer, { borderBottomColor: Colors.border }]}>
        <Text style={[styles.filterLabel, { color: Colors.subtext }]}>Filter:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: Colors.card },
              filterType === 'all' && [styles.activeFilterButton, { backgroundColor: Colors.primary }],
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filterType === 'all' ? '#FFFFFF' : Colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: Colors.card },
              filterType === 'scan' && [styles.activeFilterButton, { backgroundColor: Colors.primary }],
            ]}
            onPress={() => setFilterType('scan')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filterType === 'scan' ? '#FFFFFF' : Colors.text },
              ]}
            >
              Scanned
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: Colors.card },
              filterType === 'manual' && [styles.activeFilterButton, { backgroundColor: Colors.primary }],
            ]}
            onPress={() => setFilterType('manual')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filterType === 'manual' ? '#FFFFFF' : Colors.text },
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {mealsByDate.length === 0 ? (
        <EmptyState
          message="No meal history found. Start tracking your meals by scanning or adding them manually."
          icon={<Filter size={40} color={Colors.mediumGray} />}
        />
      ) : (
        <FlatList
          data={mealsByDate}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View>
              {renderDateHeader(item.date)}
              {item.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  id={meal.id || ''}
                  food={meal.food || meal.name || ''}
                  calories={meal.calories}
                  date={meal.date}
                  method={meal.method || 'manual'}
                  mealType={meal.mealType}
                  notes={meal.notes}
                  onDelete={handleDeleteMeal}
                />
              ))}
            </View>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing || mealsLoading} 
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterButton: {
    // backgroundColor is applied dynamically
  },
  filterButtonText: {
    fontSize: 14,
    // color is applied dynamically
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});