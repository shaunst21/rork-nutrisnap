import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MacroProgressBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

const MacroProgressBar = ({ label, current, goal, color, unit = 'g' }: MacroProgressBarProps) => {
  const Colors = useThemeColors();
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Colors.text }]}>{label}</Text>
        <Text style={[styles.values, { color: Colors.text }]}>
          {current.toFixed(1)}{unit} / {goal}{unit}
        </Text>
      </View>
      
      <View style={[styles.progressContainer, { backgroundColor: Colors.lightGray }]}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      
      <Text style={[styles.percentage, { color: Colors.subtext }]}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  values: {
    fontSize: 14,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default MacroProgressBar;