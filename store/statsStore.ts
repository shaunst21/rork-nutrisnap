import { create } from 'zustand';
import { 
  getCaloriesForDate, 
  getCaloriesForWeek, 
  getCaloriesForMonth,
  getMostCommonFoods,
  getAverageDailyCalories
} from '@/utils/calorieHelpers';
import { getStreakData } from '@/firebase';

interface StatsState {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  commonFoods: Array<{food: string, count: number}>;
  currentStreak: number;
  longestStreak: number;
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
        averageDailyCalories,
        commonFoods,
        streakData
      ] = await Promise.all([
        getCaloriesForDate(today),
        getCaloriesForWeek(),
        getCaloriesForMonth(),
        getAverageDailyCalories(),
        getMostCommonFoods(5),
        getStreakData()
      ]);
      
      set({
        todayCalories,
        weekCalories,
        monthCalories,
        averageDailyCalories,
        commonFoods,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ error: 'Failed to fetch stats', isLoading: false });
    }
  }
}));