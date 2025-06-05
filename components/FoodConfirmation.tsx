import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Check, X, Edit2 } from 'lucide-react-native';
import MealTypeSelector from './MealTypeSelector';
import { useThemeColors } from '@/hooks/useThemeColors';

interface FoodConfirmationProps {
  food: string;
  calories: number;
  confidence: number;
  onConfirm: (
    food: string, 
    calories: number, 
    mealType: string, 
    notes: string
  ) => void;
  onCancel: () => void;
}

const FoodConfirmation = ({ 
  food: initialFood, 
  calories: initialCalories, 
  confidence,
  onConfirm, 
  onCancel 
}: FoodConfirmationProps) => {
  const Colors = useThemeColors();
  
  const [food, setFood] = useState(initialFood);
  const [calories, setCalories] = useState(initialCalories.toString());
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleConfirm = () => {
    const caloriesNum = parseInt(calories, 10);
    
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Invalid Calories', 'Please enter a valid number of calories');
      return;
    }
    
    onConfirm(food, caloriesNum, mealType, notes);
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: Colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>Food Detected</Text>
            <Text style={[styles.confidence, { color: Colors.primary }]}>
              {confidence.toFixed(0)}% confidence
            </Text>
          </View>
          
          {isEditing ? (
            <View style={styles.editContainer}>
              <Text style={[styles.label, { color: Colors.subtext }]}>Food Name:</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: Colors.card,
                    borderColor: Colors.border,
                    color: Colors.text
                  }
                ]}
                value={food}
                onChangeText={setFood}
                placeholder="Food name"
                placeholderTextColor={Colors.mediumGray}
              />
              
              <Text style={[styles.label, { color: Colors.subtext }]}>Calories:</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: Colors.card,
                    borderColor: Colors.border,
                    color: Colors.text
                  }
                ]}
                value={calories}
                onChangeText={setCalories}
                placeholder="Calories"
                keyboardType="number-pad"
                placeholderTextColor={Colors.mediumGray}
              />
              
              <Text style={[styles.label, { color: Colors.subtext }]}>Meal Type:</Text>
              <MealTypeSelector
                selectedType={mealType}
                onSelect={setMealType}
              />
              
              <Text style={[styles.label, { color: Colors.subtext }]}>Notes (Optional):</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.notesInput, 
                  { 
                    backgroundColor: Colors.card,
                    borderColor: Colors.border,
                    color: Colors.text
                  }
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes about this meal"
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.mediumGray}
              />
            </View>
          ) : (
            <View style={styles.detailsContainer}>
              <Text style={[styles.foodName, { color: Colors.text }]}>{food}</Text>
              <Text style={[styles.calories, { color: Colors.primary }]}>{calories} calories</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
              <Edit2 size={20} color={Colors.primary} />
              <Text style={[styles.editButtonText, { color: Colors.primary }]}>
                {isEditing ? 'Done Editing' : 'Edit Details'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: Colors.error }]} 
              onPress={onCancel}
            >
              <X size={20} color={Colors.error} />
              <Text style={[styles.cancelText, { color: Colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: Colors.primary }]} 
              onPress={handleConfirm}
            >
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  calories: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  editContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
  },
  cancelText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FoodConfirmation;