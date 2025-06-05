import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MacroProgressBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
}

const MacroProgressBar = ({ label, current, goal, color }: MacroProgressBarProps) => {
  const Colors = useThemeColors();
  
  // Calculate percentage with safety check
  const percentage = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: Colors.text }]}>{label}</Text>
        <Text style={[styles.values, { color: Colors.subtext }]}>
          {current}g / {goal}g
        </Text>
      </View>
      
      <View style={[styles.progressBackground, { backgroundColor: Colors.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  values: {
    fontSize: 14,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default MacroProgressBar;