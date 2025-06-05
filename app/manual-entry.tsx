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
import { useMealStore } from '@/store/mealStore';
import MealTypeSelector from '@/components/MealTypeSelector';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ManualEntryScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  
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
        notes: notes.trim() || undefined
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
      style={[styles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { borderBottomColor: Colors.border }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors.text }]}>Add Food Manually</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: Colors.text }]}>Food Name</Text>
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
            placeholder="e.g. Chicken Salad"
            placeholderTextColor={Colors.mediumGray}
            autoCapitalize="words"
          />
          
          <Text style={[styles.label, { color: Colors.text }]}>Calories</Text>
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
            placeholder="e.g. 350"
            placeholderTextColor={Colors.mediumGray}
            keyboardType="number-pad"
          />
          
          <MealTypeSelector 
            selectedType={mealType}
            onSelect={setMealType}
          />
          
          <Text style={[styles.label, { color: Colors.text }]}>Notes (Optional)</Text>
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
            placeholder="e.g. With dressing on the side"
            placeholderTextColor={Colors.mediumGray}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { backgroundColor: Colors.primary },
              (!food.trim() || !calories) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !food.trim() || !calories}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Save Food</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.infoContainer, { backgroundColor: Colors.card }]}>
          <Text style={[styles.infoTitle, { color: Colors.text }]}>Tips for Accurate Tracking</Text>
          <Text style={[styles.infoText, { color: Colors.subtext }]}>• Check food labels for exact calorie counts</Text>
          <Text style={[styles.infoText, { color: Colors.subtext }]}>• Use measuring cups or a food scale for portion sizes</Text>
          <Text style={[styles.infoText, { color: Colors.subtext }]}>• Include all ingredients when tracking meals</Text>
          <Text style={[styles.infoText, { color: Colors.subtext }]}>• Be consistent with your tracking habits</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 8,
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
  submitButton: {
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
    margin: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});