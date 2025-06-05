import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Check, X, Edit2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import MealTypeSelector from './MealTypeSelector';

interface FoodConfirmationProps {
  food: string;
  calories: number;
  confidence: number;
  onConfirm: (food: string, calories: number, mealType: string, notes: string) => void;
  onCancel: () => void;
}

const FoodConfirmation = ({ 
  food: initialFood, 
  calories: initialCalories, 
  confidence, 
  onConfirm, 
  onCancel 
}: FoodConfirmationProps) => {
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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Food Detected</Text>
          <Text style={styles.confidence}>{confidence.toFixed(0)}% confidence</Text>
        </View>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <Text style={styles.label}>Food Name:</Text>
            <TextInput
              style={styles.input}
              value={food}
              onChangeText={setFood}
              placeholder="Food name"
            />
            
            <Text style={styles.label}>Calories:</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder="Calories"
              keyboardType="number-pad"
            />
            
            <Text style={styles.label}>Meal Type:</Text>
            <MealTypeSelector
              selectedType={mealType}
              onSelect={setMealType}
            />
            
            <Text style={styles.label}>Notes (Optional):</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this meal"
              multiline
              numberOfLines={3}
            />
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <Text style={styles.foodName}>{food}</Text>
            <Text style={styles.calories}>{calories} calories</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
            <Edit2 size={20} color={Colors.primary} />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Done Editing' : 'Edit Details'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <X size={20} color={Colors.error} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.text,
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
    color: Colors.text,
  },
  confidence: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  calories: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '500',
  },
  editContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.primary,
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
    borderColor: Colors.error,
    flex: 1,
    marginRight: 8,
  },
  cancelText: {
    color: Colors.error,
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
    backgroundColor: Colors.primary,
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