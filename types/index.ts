// Meal Types
export interface Meal {
  id?: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  image?: string;
}

// Stats Types
export interface Stats {
  todayCalories: number;
  weekCalories: number;
  monthCalories: number;
  averageDailyCalories: number;
  commonFoods: { food: string; count: number }[];
  currentStreak: number;
  longestStreak: number;
  lastLogDate?: string;
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

// Preferences Types
export interface Preferences {
  dailyCalorieGoal: number;
  weeklyCalorieGoal: number;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  macroGoals: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Subscription Types
export type SubscriptionTier = 'free' | 'premium' | 'premium_plus' | 'family';

export interface Subscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  status: 'active' | 'canceled' | 'expired';
  isTrial?: boolean;
  familyMembers?: string[]; // For family plan
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  tiers: SubscriptionTier[];
  icon: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  expiryDate: string;
  isUsed: boolean;
}

// Export Data Type
export interface ExportData {
  meals: Meal[];
  stats: {
    todayCalories: number;
    weekCalories: number;
    monthCalories: number;
    averageDailyCalories: number;
    commonFoods: { food: string; count: number }[];
    currentStreak: number;
    longestStreak: number;
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
  };
  preferences: Preferences;
}