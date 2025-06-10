import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MealTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const MealTypeSelector = ({ selectedType, onSelect }: MealTypeSelectorProps) => {
  const Colors = useThemeColors();
  
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', color: Colors.mealTypes.breakfast },
    { id: 'lunch', label: 'Lunch', color: Colors.mealTypes.lunch },
    { id: 'dinner', label: 'Dinner', color: Colors.mealTypes.dinner },
    { id: 'snack', label: 'Snack', color: Colors.mealTypes.snack },
    { id: 'other', label: 'Other', color: Colors.mealTypes.other },
  ];
  
  return (
    <View style={styles.container}>
      {mealTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeButton,
            { 
              backgroundColor: selectedType === type.id ? type.color : Colors.card,
              borderColor: type.color,
              borderWidth: 1,
            },
          ]}
          onPress={() => onSelect(type.id)}
        >
          <Text
            style={[
              styles.typeText,
              { color: selectedType === type.id ? '#FFFFFF' : type.color },
            ]}
          >
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MealTypeSelector;