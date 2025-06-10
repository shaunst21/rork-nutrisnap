import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getMeals, 
  addMeal as addMealToFirebase, 
  isOnline, 
  syncOfflineData 
} from '@/firebase';
import { updateStreak } from '@/utils/streakHelpers';
import { Meal } from '@/types';
import { useStatsStore } from './statsStore';

interface MealState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchMeals: () => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'date'>) => Promise<void>;
  syncOfflineMeals: () => Promise<void>;
}

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
          set({ meals, isLoading: false });
          
          // Update stats after fetching meals
          const statsStore = useStatsStore.getState();
          statsStore.fetchStats();
        } catch (error) {
          console.error('Error fetching meals:', error);
          set({ error: 'Failed to fetch meals', isLoading: false });
        }
      },
      
      addMeal: async (mealData) => {
        set({ isLoading: true, error: null });
        try {
          const newMeal = {
            ...mealData,
            date: new Date().toISOString(),
          };
          
          let addedMeal;
          
          // Check if online
          if (isOnline()) {
            // Add to Firebase
            addedMeal = await addMealToFirebase(newMeal);
            set(state => ({
              meals: [...state.meals, addedMeal],
              isLoading: false
            }));
          } else {
            // Store offline
            const offlineMeal = {
              ...newMeal,
              id: `offline_${Date.now()}`
            };
            
            addedMeal = offlineMeal;
            
            // Add to local state
            set(state => ({
              meals: [...state.meals, offlineMeal],
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
          
          // Update stats immediately after adding a meal
          const statsStore = useStatsStore.getState();
          
          // Update today's calories
          statsStore.updateStatsWithNewMeal(addedMeal);
          
          return addedMeal;
        } catch (error) {
          console.error('Error adding meal:', error);
          set({ error: 'Failed to add meal', isLoading: false });
          throw error;
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