import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Calendar, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMealStore } from '@/store/mealStore';
import MealCard from '@/components/MealCard';
import EmptyState from '@/components/EmptyState';

export default function HistoryScreen() {
  const { meals, fetchMeals, isLoading } = useMealStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'scan' | 'manual'>('all');
  
  useEffect(() => {
    fetchMeals();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeals();
    setRefreshing(false);
  };
  
  // Group meals by date
  const groupedMeals: { [key: string]: typeof meals } = {};
  
  // Filter meals based on selected filter
  const filteredMeals = meals.filter(meal => {
    if (filterType === 'all') return true;
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
      <View style={styles.dateHeader}>
        <Calendar size={16} color={Colors.primary} />
        <Text style={styles.dateText}>{displayDate}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'scan' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterType('scan')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'scan' && styles.activeFilterText,
              ]}
            >
              Scanned
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'manual' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterType('manual')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'manual' && styles.activeFilterText,
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
                  food={meal.food}
                  calories={meal.calories}
                  date={meal.date}
                  method={meal.method}
                  onDelete={fetchMeals}
                />
              ))}
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    backgroundColor: Colors.background,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.subtext,
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
    backgroundColor: Colors.card,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});