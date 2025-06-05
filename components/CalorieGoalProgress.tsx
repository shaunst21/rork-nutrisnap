import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface CalorieGoalProgressProps {
  current: number;
  goal: number;
}

const CalorieGoalProgress = ({ current, goal }: CalorieGoalProgressProps) => {
  const Colors = useThemeColors();
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isOverGoal = current > goal;
  
  // Determine color based on percentage
  let progressColor = Colors.primary;
  if (percentage >= 100) {
    progressColor = isOverGoal ? Colors.error : Colors.success;
  } else if (percentage >= 80) {
    progressColor = Colors.warning;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Daily Calorie Goal</Text>
        <Text style={[styles.percentage, { color: Colors.primary }]}>{percentage}%</Text>
      </View>
      
      <View style={[styles.progressContainer, { backgroundColor: Colors.lightGray }]}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentage}%`, backgroundColor: progressColor }
          ]} 
        />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={[styles.currentText, { color: Colors.text }]}>{current} cal</Text>
        <Text style={[styles.goalText, { color: Colors.subtext }]}>Goal: {goal} cal</Text>
      </View>
      
      {isOverGoal && (
        <Text style={[styles.overGoalText, { color: Colors.error }]}>
          You're {current - goal} calories over your daily goal
        </Text>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalText: {
    fontSize: 14,
  },
  overGoalText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default CalorieGoalProgress;