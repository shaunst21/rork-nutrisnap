import { create } from 'zustand';
import { 
  getCaloriesForDate, 
  getCaloriesForWeek, 
  getCaloriesForMonth,
  getCaloriesPerDayForWeek,
  getMostCommonFoods,
  getCaloriesByMealType,
  getAverageDailyCalories,
  getMacrosForDate,
  getMacrosForWeek,
  getMacrosForMonth
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

// Default macro values to prevent undefined errors
const defaultMacros = {
  protein: 0,
  carbs: 0,
  fat: 0
};

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
        streakData,
        todayMacros,
        weekMacros,
        monthMacros
      ] = await Promise.all([
        getCaloriesForDate(today),
        getCaloriesForWeek(),
        getCaloriesForMonth(),
        getCaloriesPerDayForWeek(),
        getCaloriesByMealType(),
        getAverageDailyCalories(),
        getMostCommonFoods(5),
        getStreakData(),
        getMacrosForDate(today),
        getMacrosForWeek(),
        getMacrosForMonth()
      ]);
      
      // Ensure we have valid macro objects with defaults
      const safeTodayMacros = todayMacros || { ...defaultMacros };
      const safeWeekMacros = weekMacros || { ...defaultMacros };
      const safeMonthMacros = monthMacros || { ...defaultMacros };
      
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
        macros: {
          today: {
            protein: safeTodayMacros.protein || 0,
            carbs: safeTodayMacros.carbs || 0,
            fat: safeTodayMacros.fat || 0
          },
          week: {
            protein: safeWeekMacros.protein || 0,
            carbs: safeWeekMacros.carbs || 0,
            fat: safeWeekMacros.fat || 0
          },
          month: {
            protein: safeMonthMacros.protein || 0,
            carbs: safeMonthMacros.carbs || 0,
            fat: safeMonthMacros.fat || 0
          }
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ error: 'Failed to fetch stats', isLoading: false });
    }
  }
}));