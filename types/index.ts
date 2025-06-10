export interface Meal {
  id: string;
  food?: string;
  name?: string;
  calories: number;
  date: string;
  method?: 'scan' | 'manual';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
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

export interface UserPreferences {
  dailyCalorieGoal: number;
  weightGoal?: number;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  notificationsEnabled: boolean;
  reminderTime?: string;
}

export type SubscriptionTier = 'free' | 'premium';

export interface Subscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  status: 'active' | 'canceled' | 'expired';
  isTrial?: boolean;
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

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}