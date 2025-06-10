export interface Meal {
  id: string;
  food?: string;
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  date: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  method?: 'scan' | 'manual';
  notes?: string;
  image?: string;
}

export interface Stats {
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
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

export type SubscriptionTier = 'free' | 'premium';

export interface UserPreferences {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  notificationsEnabled: boolean;
  reminderTime: string;
}