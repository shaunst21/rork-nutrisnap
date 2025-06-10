import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coffee, Sun, Moon, Cookie } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTypeSelectorProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
}

const MealTypeSelector = ({ selectedType, onSelect }: MealTypeSelectorProps) => {
  const Colors = useThemeColors();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: Colors.text }]}>Meal Type</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: Colors.card },
            selectedType === 'breakfast' && [
              styles.selectedOption,
              { borderColor: Colors.mealTypes.breakfast }
            ],
          ]}
          onPress={() => onSelect('breakfast')}
        >
          <Coffee 
            size={24} 
            color={selectedType === 'breakfast' ? Colors.mealTypes.breakfast : Colors.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              { color: Colors.text },
              selectedType === 'breakfast' && { color: Colors.mealTypes.breakfast }
            ]}
          >
            Breakfast
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: Colors.card },
            selectedType === 'lunch' && [
              styles.selectedOption,
              { borderColor: Colors.mealTypes.lunch }
            ],
          ]}
          onPress={() => onSelect('lunch')}
        >
          <Sun 
            size={24} 
            color={selectedType === 'lunch' ? Colors.mealTypes.lunch : Colors.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              { color: Colors.text },
              selectedType === 'lunch' && { color: Colors.mealTypes.lunch }
            ]}
          >
            Lunch
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: Colors.card },
            selectedType === 'dinner' && [
              styles.selectedOption,
              { borderColor: Colors.mealTypes.dinner }
            ],
          ]}
          onPress={() => onSelect('dinner')}
        >
          <Moon 
            size={24} 
            color={selectedType === 'dinner' ? Colors.mealTypes.dinner : Colors.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              { color: Colors.text },
              selectedType === 'dinner' && { color: Colors.mealTypes.dinner }
            ]}
          >
            Dinner
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: Colors.card },
            selectedType === 'snack' && [
              styles.selectedOption,
              { borderColor: Colors.mealTypes.snack }
            ],
          ]}
          onPress={() => onSelect('snack')}
        >
          <Cookie 
            size={24} 
            color={selectedType === 'snack' ? Colors.mealTypes.snack : Colors.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              { color: Colors.text },
              selectedType === 'snack' && { color: Colors.mealTypes.snack }
            ]}
          >
            Snack
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedOption: {
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default MealTypeSelector;