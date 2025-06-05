import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMealStore } from '@/store/mealStore';
import MealTypeSelector from '@/components/MealTypeSelector';

export default function ManualEntryScreen() {
  const router = useRouter();
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addMeal } = useMealStore();
  
  const handleSubmit = async () => {
    // Validate inputs
    if (!food.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    
    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Error', 'Please enter a valid number of calories');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addMeal({
        food: food.trim(),
        calories: caloriesNum,
        method: 'manual',
        mealType,
        notes: notes.trim() || undefined,
      });
      
      router.back();
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('Error', 'Failed to add meal');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Food Manually</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Food Name</Text>
          <TextInput
            style={styles.input}
            value={food}
            onChangeText={setFood}
            placeholder="e.g. Chicken Salad"
            placeholderTextColor={Colors.mediumGray}
            autoCapitalize="words"
          />
          
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g. 350"
            placeholderTextColor={Colors.mediumGray}
            keyboardType="number-pad"
          />
          
          <MealTypeSelector 
            selectedType={mealType}
            onSelect={setMealType}
          />
          
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. With dressing on the side"
            placeholderTextColor={Colors.mediumGray}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity
            style={[styles.submitButton, (!food.trim() || !calories) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting || !food.trim() || !calories}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Save Food</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Tips for Accurate Tracking</Text>
          <Text style={styles.infoText}>• Check food labels for exact calorie counts</Text>
          <Text style={styles.infoText}>• Use measuring cups or a food scale for portion sizes</Text>
          <Text style={styles.infoText}>• Include all ingredients when tracking meals</Text>
          <Text style={styles.infoText}>• Be consistent with your tracking habits</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.text,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
});