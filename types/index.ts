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

// Subscription types
export interface Subscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate: string | null; // null for lifetime subscriptions
  autoRenew: boolean;
  status: 'active' | 'expired' | 'canceled';
  paymentMethod?: string;
}

export type SubscriptionTier = 'free' | 'premium' | 'premium_plus';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  tiers: SubscriptionTier[];
  icon: string;
}

// Recipe type
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string;
  tags: string[];
  isFavorite: boolean;
}

// Meal plan type
export interface MealPlan {
  id: string;
  name: string;
  description: string;
  days: MealPlanDay[];
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  isActive: boolean;
  createdAt: string;
}

export interface MealPlanDay {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  meals: {
    breakfast: MealPlanItem[];
    lunch: MealPlanItem[];
    dinner: MealPlanItem[];
    snack: MealPlanItem[];
  };
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlanItem {
  recipeId?: string;
  customFood?: {
    name: string;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  servings: number;
}

// Export data type
export interface ExportData {
  meals: Meal[];
  stats: Stats;
  preferences: UserPreferences;
  mealPlans?: MealPlan[];
  recipes?: Recipe[];
}