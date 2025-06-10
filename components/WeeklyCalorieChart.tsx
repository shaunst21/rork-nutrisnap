import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface WeeklyCalorieChartProps {
  data: Array<{day: string; calories: number}>;
  goal: number;
}

const WeeklyCalorieChart = ({ data, goal }: WeeklyCalorieChartProps) => {
  const Colors = useThemeColors();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // 16px padding on each side
  const barWidth = (chartWidth - 48) / 7; // 7 days, with some spacing
  
  // Find the maximum value for scaling
  const maxCalories = Math.max(
    ...data.map(item => item.calories),
    goal // Include goal in max calculation to ensure it's visible
  );
  
  // Add 10% padding to the top of the chart
  const chartMaxValue = maxCalories * 1.1;
  
  // Chart height
  const chartHeight = 180;
  
  // Calculate bar height based on calories
  const getBarHeight = (calories: number) => {
    if (chartMaxValue === 0) return 0;
    return (calories / chartMaxValue) * chartHeight;
  };
  
  // Calculate goal line position
  const goalLinePosition = (goal / chartMaxValue) * chartHeight;
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.card }]}>
      <Text style={[styles.title, { color: Colors.text }]}>Weekly Calories</Text>
      
      <View style={styles.chartContainer}>
        {/* Goal line */}
        {goal > 0 && (
          <View 
            style={[
              styles.goalLine, 
              { 
                top: chartHeight - goalLinePosition,
                backgroundColor: Colors.accent 
              }
            ]}
          >
            <Text style={styles.goalText}>Goal: {goal}</Text>
          </View>
        )}
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = getBarHeight(item.calories);
            const isToday = new Date().getDay() === index;
            
            // Determine bar color based on goal
            let barColor = Colors.primary;
            if (item.calories > goal && goal > 0) {
              barColor = Colors.error;
            } else if (item.calories >= goal * 0.8 && goal > 0) {
              barColor = Colors.warning;
            }
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barLabelContainer}>
                  <Text style={[styles.barValue, { color: Colors.text }]}>
                    {item.calories > 0 ? item.calories : ''}
                  </Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: barHeight, 
                        backgroundColor: barColor,
                        width: barWidth,
                        opacity: isToday ? 1 : 0.7
                      }
                    ]} 
                  />
                </View>
                
                <Text style={[styles.dayLabel, { color: Colors.subtext }]}>
                  {item.day.substring(0, 3)}
                </Text>
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    height: 220,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 1,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barLabelContainer: {
    height: 20,
    justifyContent: 'center',
  },
  barValue: {
    fontSize: 10,
    textAlign: 'center',
  },
  barContainer: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
  },
});

export default WeeklyCalorieChart;