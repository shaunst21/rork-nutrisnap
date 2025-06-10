export type SubscriptionTier = 'free' | 'premium' | 'premium_plus' | 'family';

export interface Subscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  status: 'active' | 'canceled' | 'expired';
  isTrial?: boolean;
  familyMembers?: string[];
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

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  date: string;
  imageUri?: string;
  foods?: Food[];
  method?: 'scan' | 'manual';
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity: number;
}

export interface UserPreferences {
  dailyCalorieGoal: number;
  weeklyCalorieGoal: number;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  macroGoals?: {
    protein: number;
    carbs: number;
    fat: number;
  };
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

export interface ExportData {
  meals: Meal[];
  stats: {
    todayCalories: number;
    weekCalories: number;
    monthCalories: number;
    averageDailyCalories: number;
    commonFoods: {
      food: string;
      count: number;
    }[];
    currentStreak: number;
    longestStreak: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  preferences: UserPreferences;
}

export interface FamilyMember {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'pending' | 'expired';
  joinedDate?: string;
}