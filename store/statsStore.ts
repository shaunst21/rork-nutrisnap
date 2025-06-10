import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Stats, Meal } from '@/types';
import {
  getCaloriesForDate,
  getCaloriesForWeek,
  getCaloriesForMonth,
  getCaloriesPerDayForWeek,
  getMostCommonFoods,
  getCaloriesByMealType,
  getAverageDailyCalories
} from '@/utils/calorieHelpers';
import { getDaysOfWeek } from '@/utils/dateHelpers';

interface StatsState {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  weeklyCalorieData: Array<{day: string; calories: number}>;
  mealTypeCalories: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
    other: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  commonFoods: {
    food: string;
    count: number;
  }[];
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStats: () => Promise<void>;
  updateStatsWithNewMeal: (meal: Meal) => void;
}

// Initial state
const initialStats: Stats = {
  todayCalories: 0,
  weekCalories: 0,
  monthCalories: 0,
  averageDailyCalories: 0,
  weeklyCalorieData: getDaysOfWeek().map(day => ({ day, calories: 0 })),
  mealTypeCalories: {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
    other: 0
  },
  macros: {
    protein: 0,
    carbs: 0,
    fat: 0
  },
  commonFoods: [],
  currentStreak: 0,
  longestStreak: 0
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      ...initialStats,
      isLoading: false,
      error: null,
      
      fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
          // Get today's date
          const today = new Date().toISOString();
          
          // Fetch all stats in parallel
          const [
            todayCalories,
            weekCalories,
            monthCalories,
            weeklyCalorieData,
            mealTypeCalories,
            commonFoods,
            averageDailyCalories,
            streakData
          ] = await Promise.all([
            getCaloriesForDate(today),
            getCaloriesForWeek(),
            getCaloriesForMonth(),
            getCaloriesPerDayForWeek(),
            getCaloriesByMealType(),
            getMostCommonFoods(5),
            getAverageDailyCalories(),
            AsyncStorage.getItem('streak-data').then(data => 
              data ? JSON.parse(data) : { currentStreak: 0, longestStreak: 0 }
            )
          ]);
          
          set({
            todayCalories,
            weekCalories,
            monthCalories,
            weeklyCalorieData,
            mealTypeCalories,
            commonFoods,
            averageDailyCalories,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
          set({ error: 'Failed to fetch stats', isLoading: false });
        }
      },
      
      updateStatsWithNewMeal: (meal: Meal) => {
        // Update today's calories
        set(state => ({
          todayCalories: state.todayCalories + (meal.calories || 0)
        }));
        
        // Update week calories
        set(state => ({
          weekCalories: state.weekCalories + (meal.calories || 0)
        }));
        
        // Update month calories
        set(state => ({
          monthCalories: state.monthCalories + (meal.calories || 0)
        }));
        
        // Update weekly calorie data for today
        const today = new Date();
        const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        set(state => {
          const updatedWeeklyData = [...state.weeklyCalorieData];
          updatedWeeklyData[dayIndex].calories += (meal.calories || 0);
          return { weeklyCalorieData: updatedWeeklyData };
        });
        
        // Update meal type calories
        if (meal.mealType) {
          set(state => {
            const updatedMealTypeCalories = { ...state.mealTypeCalories };
            updatedMealTypeCalories[meal.mealType as keyof typeof updatedMealTypeCalories] += 
              (meal.calories || 0);
            return { mealTypeCalories: updatedMealTypeCalories };
          });
        } else {
          // If no meal type specified, add to "other"
          set(state => ({
            mealTypeCalories: {
              ...state.mealTypeCalories,
              other: state.mealTypeCalories.other + (meal.calories || 0)
            }
          }));
        }
        
        // Update macros if available
        if (meal.protein || meal.carbs || meal.fat) {
          set(state => ({
            macros: {
              protein: state.macros.protein + (meal.protein || 0),
              carbs: state.macros.carbs + (meal.carbs || 0),
              fat: state.macros.fat + (meal.fat || 0)
            }
          }));
        }
        
        // Update common foods (this is a simplified approach)
        // In a real app, you'd need to recalculate the most common foods
        const foodName = meal.food || meal.name;
        if (foodName) {
          set(state => {
            // Check if this food is already in the common foods list
            const existingFoodIndex = state.commonFoods.findIndex(
              item => item.food === foodName
            );
            
            let updatedCommonFoods = [...state.commonFoods];
            
            if (existingFoodIndex >= 0) {
              // Update existing food count
              updatedCommonFoods[existingFoodIndex] = {
                ...updatedCommonFoods[existingFoodIndex],
                count: updatedCommonFoods[existingFoodIndex].count + 1
              };
              
              // Sort by count (descending)
              updatedCommonFoods.sort((a, b) => b.count - a.count);
            } else if (updatedCommonFoods.length < 5) {
              // Add new food if we have less than 5
              updatedCommonFoods.push({ food: foodName, count: 1 });
            } else {
              // Replace the least common food if this is new
              updatedCommonFoods[4] = { food: foodName, count: 1 };
              updatedCommonFoods.sort((a, b) => b.count - a.count);
            }
            
            return { commonFoods: updatedCommonFoods };
          });
        }
      }
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        todayCalories: state.todayCalories,
        weekCalories: state.weekCalories,
        monthCalories: state.monthCalories,
        averageDailyCalories: state.averageDailyCalories,
        weeklyCalorieData: state.weeklyCalorieData,
        mealTypeCalories: state.mealTypeCalories,
        macros: state.macros,
        commonFoods: state.commonFoods,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
      }),
    }
  )
);