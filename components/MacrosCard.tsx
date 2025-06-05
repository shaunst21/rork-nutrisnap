import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import MacroProgressBar from './MacroProgressBar';
import { usePreferencesStore } from '@/store/preferencesStore';

interface MacrosCardProps {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  title: string;
}

const MacrosCard = ({ macros, title }: MacrosCardProps) => {
  const Colors = useThemeColors();
  const { preferences } = usePreferencesStore();
  
  // Calculate calories from macros
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;
  
  // Calculate percentages
  const proteinPercentage = totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0;
  const carbsPercentage = totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0;
  const fatPercentage = totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0;
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.card }]}>
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
      
      <MacroProgressBar 
        label="Protein"
        current={macros.protein}
        goal={preferences.macroGoals.protein}
        color={Colors.macros.protein}
      />
      
      <MacroProgressBar 
        label="Carbs"
        current={macros.carbs}
        goal={preferences.macroGoals.carbs}
        color={Colors.macros.carbs}
      />
      
      <MacroProgressBar 
        label="Fat"
        current={macros.fat}
        goal={preferences.macroGoals.fat}
        color={Colors.macros.fat}
      />
      
      {totalCalories > 0 && (
        <View style={styles.distributionContainer}>
          <Text style={[styles.distributionTitle, { color: Colors.subtext }]}>
            Macro Distribution
          </Text>
          
          <View style={styles.distributionBar}>
            <View 
              style={[
                styles.distributionSegment, 
                { width: `${proteinPercentage}%`, backgroundColor: Colors.macros.protein }
              ]} 
            />
            <View 
              style={[
                styles.distributionSegment, 
                { width: `${carbsPercentage}%`, backgroundColor: Colors.macros.carbs }
              ]} 
            />
            <View 
              style={[
                styles.distributionSegment, 
                { width: `${fatPercentage}%`, backgroundColor: Colors.macros.fat }
              ]} 
            />
          </View>
          
          <View style={styles.distributionLabels}>
            <Text style={[styles.distributionLabel, { color: Colors.text }]}>
              P: {proteinPercentage}%
            </Text>
            <Text style={[styles.distributionLabel, { color: Colors.text }]}>
              C: {carbsPercentage}%
            </Text>
            <Text style={[styles.distributionLabel, { color: Colors.text }]}>
              F: {fatPercentage}%
            </Text>
          </View>
        </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  distributionContainer: {
    marginTop: 16,
  },
  distributionTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  distributionBar: {
    height: 16,
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  distributionSegment: {
    height: '100%',
  },
  distributionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distributionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MacrosCard;