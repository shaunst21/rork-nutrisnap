import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserPreferences } from '@/types';

interface PreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  dailyCalorieGoal: 2000,
  weeklyCalorieGoal: 14000,
  theme: 'light',
  notifications: true
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      isLoading: false,
      error: null,
      
      updatePreferences: (newPreferences) => {
        set(state => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }));
      }
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);