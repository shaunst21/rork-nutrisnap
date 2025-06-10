import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserPreferences } from '@/types';

interface PreferencesState {
  preferences: UserPreferences;
  
  // Actions
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  dailyCalorieGoal: 2000,
  dailyProteinGoal: 150,
  dailyCarbsGoal: 200,
  dailyFatGoal: 65,
  weightUnit: 'kg',
  heightUnit: 'cm',
  notificationsEnabled: true,
  reminderTime: '19:00',
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }));
      },
      
      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      }
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);