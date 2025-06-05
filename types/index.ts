// Meal type definitions
export interface Meal {
  id?: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  // Added macros
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
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
  // Added macros stats
  macros: {
    today: {
      protein: number;
      carbs: number;
      fat: number;
    };
    week: {
      protein: number;
      carbs: number;
      fat: number;
    };
    month: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

// User preferences
export interface UserPreferences {
  dailyCalorieGoal: number;
  weeklyCalorieGoal: number;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  // Added macro goals
  macroGoals: {
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
  };
}

// Streak data
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}