import { create } from 'zustand';
import { 
  getCaloriesForDate, 
  getCaloriesForWeek, 
  getCaloriesForMonth,
  getCaloriesPerDayForWeek,
  getMostCommonFoods,
  getCaloriesByMealType,
  getAverageDailyCalories
} from '@/utils/calorieHelpers';
import { getStreakData } from '@/firebase';
import { Stats } from '@/types';

interface StatsState extends Stats {
  weeklyCalorieData: Array<{day: string, calories: number}>;
  mealTypeCalories: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
    other: number;
  };
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  todayCalories: 0,
  weekCalories: 0,
  monthCalories: 0,
  averageDailyCalories: 0,
  commonFoods: [],
  currentStreak: 0,
  longestStreak: 0,
  weeklyCalorieData: [],
  mealTypeCalories: {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
    other: 0
  },
  macros: {
    today: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    week: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    month: {
      protein: 0,
      carbs: 0,
      fat: 0
    }
  },
  isLoading: false,
  error: null,
  
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const today = new Date().toISOString();
      
      // Fetch all stats in parallel
      const [
        todayCalories,
        weekCalories,
        monthCalories,
        weeklyCalorieData,
        mealTypeCalories,
        averageDailyCalories,
        commonFoods,
        streakData
      ] = await Promise.all([
        getCaloriesForDate(today),
        getCaloriesForWeek(),
        getCaloriesForMonth(),
        getCaloriesPerDayForWeek(),
        getCaloriesByMealType(),
        getAverageDailyCalories(),
        getMostCommonFoods(5),
        getStreakData()
      ]);
      
      set({
        todayCalories,
        weekCalories,
        monthCalories,
        weeklyCalorieData,
        mealTypeCalories,
        averageDailyCalories,
        commonFoods,
        currentStreak: streakData?.currentStreak || 0,
        longestStreak: streakData?.longestStreak || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ error: 'Failed to fetch stats', isLoading: false });
    }
  }
}));