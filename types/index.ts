export interface Meal {
  id: string;
  food?: string;
  name?: string;
  calories: number;
  date: string;
  method?: 'scan' | 'manual';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  imageUri?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Stats {
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
}

export interface UserPreferences {
  dailyCalorieGoal: number;
  weightGoal?: number;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  notificationsEnabled: boolean;
  reminderTime?: string;
}

export interface SubscriptionTier {
  tier: 'free' | 'premium';
  expiresAt?: string;
  features: string[];
}