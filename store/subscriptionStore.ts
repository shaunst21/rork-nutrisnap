import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SubscriptionTier } from '@/types';

interface SubscriptionState {
  tier: SubscriptionTier;
  trialUsed: boolean;
  expiryDate: string | null;
  
  // Actions
  getSubscriptionTier: () => SubscriptionTier;
  isTrialAvailable: () => boolean;
  startTrial: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: 'free' as SubscriptionTier,
      trialUsed: false,
      expiryDate: null,
      
      getSubscriptionTier: () => {
        return get().tier;
      },
      
      isTrialAvailable: () => {
        return !get().trialUsed;
      },
      
      startTrial: async () => {
        // Set trial period for 7 days
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        
        set({
          tier: 'premium',
          trialUsed: true,
          expiryDate: trialEnd.toISOString()
        });
      },
      
      upgradeToPremium: async () => {
        // Set subscription for 1 year
        const subscriptionEnd = new Date();
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
        
        set({
          tier: 'premium',
          expiryDate: subscriptionEnd.toISOString()
        });
      },
      
      cancelSubscription: async () => {
        set({
          tier: 'free',
          expiryDate: null
        });
      }
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);