import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Stats } from '@/types';

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
  fetchStats: () => void;
  updateStats: (stats: Partial<Stats>) => void;
  resetStats: () => void;
}

// Mock data for demonstration
const DEFAULT_STATS: Stats = {
  todayCalories: 1250,
  weekCalories: 8750,
  monthCalories: 35000,
  averageDailyCalories: 1750,
  weeklyCalorieData: [1800, 1650, 1900, 1250, 2100, 1800, 1500],
  mealTypeCalories: {
    breakfast: 350,
    lunch: 450,
    dinner: 380,
    snack: 70,
    other: 0
  },
  macros: {
    protein: 75,
    carbs: 180,
    fat: 45
  },
  commonFoods: [
    { food: 'Chicken Salad', count: 8 },
    { food: 'Oatmeal', count: 6 },
    { food: 'Greek Yogurt', count: 5 },
    { food: 'Banana', count: 4 }
  ],
  currentStreak: 5,
  longestStreak: 14
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATS,
      isLoading: false,
      error: null,
      
      fetchStats: () => {
        set({ isLoading: true });
        
        // In a real app, this would be an API call
        // For demo purposes, we'll just set some mock data after a delay
        setTimeout(() => {
          set({
            ...DEFAULT_STATS,
            isLoading: false
          });
        }, 500);
      },
      
      updateStats: (newStats) => {
        set(state => ({
          ...state,
          ...newStats
        }));
      },
      
      resetStats: () => {
        set(DEFAULT_STATS);
      }
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);