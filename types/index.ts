export interface Meal {
  id: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual' | 'api';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  image?: string;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  calorieGoal: number;
  macroGoals?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  streak: number;
  lastActive: string;
  isPremium: boolean;
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  mealCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklyStats {
  startDate: string;
  endDate: string;
  totalCalories: number;
  averageCalories: number;
  dailyStats: DailyStats[];
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalCalories: number;
  averageCalories: number;
  weeklyStats: WeeklyStats[];
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly' | 'family';
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  image?: string;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  isFavorite: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  days: {
    day: string;
    meals: {
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      recipeId: string;
      recipeName: string;
      calories: number;
      macros?: {
        protein: number;
        carbs: number;
        fat: number;
      };
    }[];
  }[];
  totalCalories: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  isActive: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  calorieGoal: number;
  macroGoals?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

export interface Stats {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  commonFoods: Array<{food: string; count: number}>;
  currentStreak: number;
  longestStreak: number;
}