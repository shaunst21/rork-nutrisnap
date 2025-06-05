import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Subscription, SubscriptionTier, SubscriptionFeature } from '@/types';

interface SubscriptionState {
  subscription: Subscription | null;
  features: SubscriptionFeature[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSubscription: (subscription: Subscription) => void;
  cancelSubscription: () => void;
  updateAutoRenew: (autoRenew: boolean) => void;
  
  // Helpers
  hasFeature: (featureId: string) => boolean;
  getRemainingDays: () => number;
  isSubscriptionActive: () => boolean;
  getSubscriptionTier: () => SubscriptionTier;
}

// Default subscription features
const DEFAULT_FEATURES: SubscriptionFeature[] = [
  {
    id: 'unlimited_meals',
    name: 'Unlimited Meal Tracking',
    description: 'Track as many meals as you want with no limits',
    tiers: ['free', 'premium', 'premium_plus'],
    icon: 'utensils'
  },
  {
    id: 'basic_stats',
    name: 'Basic Statistics',
    description: 'View basic calorie and macro statistics',
    tiers: ['free', 'premium', 'premium_plus'],
    icon: 'bar-chart-2'
  },
  {
    id: 'food_scanning',
    name: 'Food Scanning',
    description: 'Scan food with your camera to log meals',
    tiers: ['free', 'premium', 'premium_plus'],
    icon: 'camera'
  },
  {
    id: 'advanced_stats',
    name: 'Advanced Analytics',
    description: 'Get detailed insights and trends about your nutrition',
    tiers: ['premium', 'premium_plus'],
    icon: 'trending-up'
  },
  {
    id: 'meal_planning',
    name: 'Meal Planning',
    description: 'Create and manage weekly meal plans',
    tiers: ['premium', 'premium_plus'],
    icon: 'calendar'
  },
  {
    id: 'recipe_suggestions',
    name: 'Recipe Suggestions',
    description: 'Get personalized recipe suggestions based on your goals',
    tiers: ['premium', 'premium_plus'],
    icon: 'book-open'
  },
  {
    id: 'data_export',
    name: 'Data Export',
    description: 'Export your nutrition data in various formats',
    tiers: ['premium', 'premium_plus'],
    icon: 'download'
  },
  {
    id: 'barcode_scanning',
    name: 'Barcode Scanning',
    description: 'Scan product barcodes for instant nutrition info',
    tiers: ['premium_plus'],
    icon: 'maximize'
  },
  {
    id: 'custom_foods',
    name: 'Custom Food Database',
    description: 'Create and save your own custom foods',
    tiers: ['premium_plus'],
    icon: 'database'
  },
  {
    id: 'ai_coach',
    name: 'AI Nutrition Coach',
    description: 'Get personalized nutrition advice from our AI coach',
    tiers: ['premium_plus'],
    icon: 'cpu'
  },
  {
    id: 'priority_support',
    name: 'Priority Support',
    description: 'Get priority customer support',
    tiers: ['premium_plus'],
    icon: 'headphones'
  }
];

// Default free subscription
const DEFAULT_SUBSCRIPTION: Subscription = {
  tier: 'free',
  startDate: new Date().toISOString(),
  endDate: null,
  autoRenew: false,
  status: 'active'
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: DEFAULT_SUBSCRIPTION,
      features: DEFAULT_FEATURES,
      isLoading: false,
      error: null,
      
      setSubscription: (subscription) => {
        set({ subscription });
      },
      
      cancelSubscription: () => {
        const { subscription } = get();
        if (subscription) {
          set({
            subscription: {
              ...subscription,
              status: 'canceled',
              autoRenew: false
            }
          });
        }
      },
      
      updateAutoRenew: (autoRenew) => {
        const { subscription } = get();
        if (subscription) {
          set({
            subscription: {
              ...subscription,
              autoRenew
            }
          });
        }
      },
      
      hasFeature: (featureId) => {
        const { subscription, features } = get();
        if (!subscription) return false;
        
        const feature = features.find(f => f.id === featureId);
        if (!feature) return false;
        
        return feature.tiers.includes(subscription.tier);
      },
      
      getRemainingDays: () => {
        const { subscription } = get();
        if (!subscription || !subscription.endDate) return 0;
        
        const endDate = new Date(subscription.endDate);
        const today = new Date();
        
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
      },
      
      isSubscriptionActive: () => {
        const { subscription } = get();
        if (!subscription) return false;
        
        if (subscription.tier === 'free') return true;
        
        if (subscription.status !== 'active') return false;
        
        if (!subscription.endDate) return true;
        
        const endDate = new Date(subscription.endDate);
        const today = new Date();
        
        return endDate > today;
      },
      
      getSubscriptionTier: () => {
        const { subscription, isSubscriptionActive } = get();
        if (!subscription || !isSubscriptionActive()) return 'free';
        
        return subscription.tier;
      }
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);