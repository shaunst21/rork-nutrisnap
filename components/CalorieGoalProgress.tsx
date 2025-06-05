import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface CalorieGoalProgressProps {
  current: number;
  goal: number;
}

const CalorieGoalProgress = ({ current, goal }: CalorieGoalProgressProps) => {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Calorie Goal</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentage}%`, backgroundColor: progressColor }
          ]} 
        />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.currentText}>{current} cal</Text>
        <Text style={styles.goalText}>Goal: {goal} cal</Text>
      </View>
      
      {isOverGoal && (
        <Text style={styles.overGoalText}>
          You're {current - goal} calories over your daily goal
        </Text>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressContainer: {
    height: 12,
    backgroundColor: Colors.lightGray,
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
    color: Colors.text,
  },
  goalText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  overGoalText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default CalorieGoalProgress;