import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getMeals, 
  addMeal, 
  isOnline, 
  syncOfflineData 
} from '@/firebase';
import { updateStreak } from '@/utils/streakHelpers';
import { Meal } from '@/types';

interface MealState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchMeals: () => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'date'>) => Promise<void>;
  syncOfflineMeals: () => Promise<void>;
}

// Ensure meal macros are always defined with defaults
const ensureMealMacros = (meal: any): Meal => {
  return {
    ...meal,
    macros: {
      protein: meal.macros?.protein ?? 0,
      carbs: meal.macros?.carbs ?? 0,
      fat: meal.macros?.fat ?? 0
    }
  };
};

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: [],
      isLoading: false,
      error: null,
      
      fetchMeals: async () => {
        set({ isLoading: true, error: null });
        try {
          const meals = await getMeals();
          // Ensure all meals have valid macros
          const safetyMeals = meals.map(ensureMealMacros);
          set({ meals: safetyMeals, isLoading: false });
        } catch (error) {
          console.error('Error fetching meals:', error);
          set({ error: 'Failed to fetch meals', isLoading: false });
        }
      },
      
      addMeal: async (mealData) => {
        set({ isLoading: true, error: null });
        try {
          // Ensure macros are defined
          const mealWithMacros = {
            ...mealData,
            macros: {
              protein: mealData.macros?.protein ?? 0,
              carbs: mealData.macros?.carbs ?? 0,
              fat: mealData.macros?.fat ?? 0
            }
          };
          
          const newMeal = {
            ...mealWithMacros,
            date: new Date().toISOString(),
          };
          
          // Check if online
          if (isOnline()) {
            // Add to Firebase
            const addedMeal = await addMeal(newMeal);
            set(state => ({
              meals: [...state.meals, ensureMealMacros(addedMeal)],
              isLoading: false
            }));
          } else {
            // Store offline
            const offlineMeal = {
              ...newMeal,
              id: `offline_${Date.now()}`
            };
            
            // Add to local state
            set(state => ({
              meals: [...state.meals, ensureMealMacros(offlineMeal)],
              isLoading: false
            }));
            
            // Store in AsyncStorage for later sync
            const offlineMeals = await AsyncStorage.getItem('offline_meals');
            const meals = offlineMeals ? JSON.parse(offlineMeals) : [];
            meals.push(newMeal);
            await AsyncStorage.setItem('offline_meals', JSON.stringify(meals));
          }
          
          // Update streak
          await updateStreak();
        } catch (error) {
          console.error('Error adding meal:', error);
          set({ error: 'Failed to add meal', isLoading: false });
        }
      },
      
      syncOfflineMeals: async () => {
        if (!isOnline()) {
          return;
        }
        
        set({ isLoading: true });
        try {
          await syncOfflineData();
          await get().fetchMeals();
        } catch (error) {
          console.error('Error syncing offline meals:', error);
          set({ error: 'Failed to sync offline meals', isLoading: false });
        }
      }
    }),
    {
      name: 'meal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ meals: state.meals }),
    }
  )
);