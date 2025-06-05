import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        todayCalories: state.todayCalories,
        weekCalories: state.weekCalories,
        monthCalories: state.monthCalories,
        averageDailyCalories: state.averageDailyCalories,
        commonFoods: state.commonFoods,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        weeklyCalorieData: state.weeklyCalorieData,
        mealTypeCalories: state.mealTypeCalories
      }),
    }
  )
);