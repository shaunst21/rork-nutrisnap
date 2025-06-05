// Meal type definitions
export interface Meal {
  id?: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}

// Stats type definitions
export interface Stats {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  commonFoods: Array<{food: string, count: number}>;
  currentStreak: number;
  longestStreak: number;
}

// User preferences
export interface UserPreferences {
  dailyCalorieGoal: number;
  weeklyCalorieGoal: number;
  theme: 'light' | 'dark';
  notifications: boolean;
}

// Streak data
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}