import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coffee, Sun, Moon, Cookie } from 'lucide-react-native';
import Colors from '@/constants/colors';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTypeSelectorProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
}

const MealTypeSelector = ({ selectedType, onSelect }: MealTypeSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal Type</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'breakfast' && styles.selectedOption,
            { borderColor: Colors.mealTypes.breakfast }
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
              selectedType === 'breakfast' && { color: Colors.mealTypes.breakfast }
            ]}
          >
            Breakfast
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'lunch' && styles.selectedOption,
            { borderColor: Colors.mealTypes.lunch }
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
              selectedType === 'lunch' && { color: Colors.mealTypes.lunch }
            ]}
          >
            Lunch
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'dinner' && styles.selectedOption,
            { borderColor: Colors.mealTypes.dinner }
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
              selectedType === 'dinner' && { color: Colors.mealTypes.dinner }
            ]}
          >
            Dinner
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'snack' && styles.selectedOption,
            { borderColor: Colors.mealTypes.snack }
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
    color: Colors.text,
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
    borderColor: Colors.border,
    marginBottom: 12,
    backgroundColor: Colors.card,
  },
  selectedOption: {
    borderWidth: 2,
    backgroundColor: Colors.background,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
});

export default MealTypeSelector;