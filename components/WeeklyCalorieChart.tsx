import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

interface WeeklyCalorieChartProps {
  data: Array<{
    day: string;
    calories: number;
  }>;
  goal?: number;
}

const WeeklyCalorieChart = ({ data, goal }: WeeklyCalorieChartProps) => {
  // Find the maximum value for scaling
  const maxCalories = Math.max(
    ...data.map(item => item.calories),
    goal || 0
  );
  
  // Calculate chart dimensions
  const chartWidth = Dimensions.get('window').width - 64; // Accounting for padding
  const barWidth = chartWidth / data.length - 8; // 8px gap between bars
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Calories</Text>
      
      <View style={styles.chartContainer}>
        {/* Goal line if provided */}
        {goal && (
          <View 
            style={[
              styles.goalLine, 
              { 
                top: `${100 - (goal / maxCalories) * 100}%`,
              }
            ]}
          >
            <Text style={styles.goalText}>{goal} cal</Text>
          </View>
        )}
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const heightPercentage = (item.calories / maxCalories) * 100;
            const isOverGoal = goal && item.calories > goal;
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${heightPercentage}%`,
                      width: barWidth,
                      backgroundColor: isOverGoal ? Colors.error : Colors.primary,
                    }
                  ]}
                />
                <Text style={styles.dayLabel}>{item.day}</Text>
                <Text style={styles.valueLabel}>{item.calories}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.accent,
    zIndex: 1,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginTop: 4,
  },
  valueLabel: {
    fontSize: 10,
    color: Colors.subtext,
    marginTop: 2,
  },
});

export default WeeklyCalorieChart;