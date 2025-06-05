import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import MealTypeSelector from '@/components/MealTypeSelector';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ManualEntryScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  const { addMeal } = useMealStore();
  const { fetchStats } = useStatsStore();
  
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [notes, setNotes] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!food.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }
    
    if (!calories.trim() || isNaN(Number(calories))) {
      Alert.alert('Error', 'Please enter a valid calorie amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare macros if any are provided
      let macros;
      if (protein.trim() || carbs.trim() || fat.trim()) {
        macros = {
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fat: Number(fat) || 0
        };
      }
      
      await addMeal({
        food: food.trim(),
        calories: Number(calories),
        method: 'manual',
        mealType,
        notes: notes.trim() || undefined,
        macros
      });
      
      // Update stats after adding a meal
      await fetchStats();
      
      router.back();
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('Error', 'Failed to add meal');
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: Colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors.text }]}>Add Food Manually</Text>
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { backgroundColor: Colors.primary },
            isSubmitting && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Check size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Food Name*</Text>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.card, color: Colors.text }]}
              placeholder="e.g., Grilled Chicken Salad"
              placeholderTextColor={Colors.subtext}
              value={food}
              onChangeText={setFood}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Calories*</Text>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.card, color: Colors.text }]}
              placeholder="e.g., 350"
              placeholderTextColor={Colors.subtext}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Meal Type</Text>
            <MealTypeSelector
              selectedMealType={mealType}
              onSelectMealType={setMealType}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Macros (optional)</Text>
            <View style={styles.macrosContainer}>
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.subtext }]}>Protein (g)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: Colors.card, color: Colors.text }]}
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.subtext }]}>Carbs (g)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: Colors.card, color: Colors.text }]}
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.subtext }]}>Fat (g)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: Colors.card, color: Colors.text }]}
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: Colors.text }]}>Notes (optional)</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: Colors.card, color: Colors.text }]}
              placeholder="Add any additional details about this meal..."
              placeholderTextColor={Colors.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
});