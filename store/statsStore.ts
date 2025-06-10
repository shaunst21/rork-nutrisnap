import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Stats, Meal } from '@/types';
import { 
  getCaloriesForDate, 
  getCaloriesForWeek, 
  getCaloriesForMonth, 
  getCaloriesByMealType, 
  getAverageDailyCalories, 
  getCaloriesPerDayForWeek, 
  getMostCommonFoods 
} from '@/utils/calorieHelpers';

interface StatsState {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  weeklyCalorieData: number[];
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
  updateStats: (stats: Partial<Stats>) => void;
  resetStats: () => void;
  updateStatsWithNewMeal: (meal: Meal) => void;
}

// Default stats for initial state
const DEFAULT_STATS: Stats = {
  todayCalories: 0,
  weekCalories: 0,
  monthCalories: 0,
  averageDailyCalories: 0,
  weeklyCalorieData: [0, 0, 0, 0, 0, 0, 0],
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
      ...DEFAULT_STATS,
      isLoading: false,
      error: null,
      
      fetchStats: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get today's date as ISO string
          const today = new Date().toISOString();
          
          // Get calories for today
          const todayCalories = await getCaloriesForDate(today);
          
          // Get calories for the week
          const weekCalories = await getCaloriesForWeek();
          
          // Get calories for the month
          const monthCalories = await getCaloriesForMonth();
          
          // Get average daily calories
          const averageDailyCalories = await getAverageDailyCalories();
          
          // Get calories per day for the week
          const caloriesPerDay = await getCaloriesPerDayForWeek();
          const weeklyCalorieData = caloriesPerDay.map(day => day.calories);
          
          // Get calories by meal type
          const mealTypeCalories = await getCaloriesByMealType();
          
          // Get most common foods
          const commonFoods = await getMostCommonFoods(5);
          
          // Update state with all fetched data
          set({
            todayCalories,
            weekCalories,
            monthCalories,
            averageDailyCalories,
            weeklyCalorieData,
            mealTypeCalories,
            commonFoods,
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
          set({ error: 'Failed to fetch stats', isLoading: false });
        }
      },
      
      updateStats: (newStats) => {
        set(state => ({
          ...state,
          ...newStats
        }));
      },
      
      resetStats: () => {
        set(DEFAULT_STATS);
      },
      
      updateStatsWithNewMeal: (meal) => {
        // Update today's calories
        set(state => {
          const calories = meal.calories || 0;
          const protein = meal.protein || 0;
          const carbs = meal.carbs || 0;
          const fat = meal.fat || 0;
          
          // Update meal type calories
          const mealType = meal.mealType || 'other';
          const updatedMealTypeCalories = { ...state.mealTypeCalories };
          
          if (mealType === 'breakfast') {
            updatedMealTypeCalories.breakfast += calories;
          } else if (mealType === 'lunch') {
            updatedMealTypeCalories.lunch += calories;
          } else if (mealType === 'dinner') {
            updatedMealTypeCalories.dinner += calories;
          } else if (mealType === 'snack') {
            updatedMealTypeCalories.snack += calories;
          } else {
            updatedMealTypeCalories.other += calories;
          }
          
          // Update macros
          const updatedMacros = {
            protein: state.macros.protein + protein,
            carbs: state.macros.carbs + carbs,
            fat: state.macros.fat + fat
          };
          
          // Update weekly data - find today's index in the week
          const today = new Date();
          const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const weeklyData = [...state.weeklyCalorieData];
          weeklyData[dayOfWeek] += calories;
          
          // Update common foods
          let updatedCommonFoods = [...state.commonFoods];
          const foodName = meal.food || meal.name || '';
          
          if (foodName) {
            const existingFoodIndex = updatedCommonFoods.findIndex(
              item => item.food.toLowerCase() === foodName.toLowerCase()
            );
            
            if (existingFoodIndex >= 0) {
              // Update existing food count
              updatedCommonFoods[existingFoodIndex] = {
                ...updatedCommonFoods[existingFoodIndex],
                count: updatedCommonFoods[existingFoodIndex].count + 1
              };
              
              // Re-sort by count
              updatedCommonFoods.sort((a, b) => b.count - a.count);
            } else {
              // Add new food
              updatedCommonFoods.push({ food: foodName, count: 1 });
              
              // Sort and limit to top 5
              updatedCommonFoods.sort((a, b) => b.count - a.count);
              if (updatedCommonFoods.length > 5) {
                updatedCommonFoods = updatedCommonFoods.slice(0, 5);
              }
            }
          }
          
          return {
            ...state,
            todayCalories: state.todayCalories + calories,
            weekCalories: state.weekCalories + calories,
            monthCalories: state.monthCalories + calories,
            mealTypeCalories: updatedMealTypeCalories,
            macros: updatedMacros,
            weeklyCalorieData: weeklyData,
            commonFoods: updatedCommonFoods
          };
        });
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
        longestStreak: state.longestStreak
      }),
    }
  )
);