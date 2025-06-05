import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useColorScheme } from 'react-native';

interface ThemeState {
  theme: 'light' | 'dark';
  isSystemTheme: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setUseSystemTheme: (useSystem: boolean) => void;
  getActiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isSystemTheme: false,
      
      setTheme: (theme) => {
        set({ theme, isSystemTheme: false });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ 
          theme: currentTheme === 'light' ? 'dark' : 'light',
          isSystemTheme: false
        });
      },
      
      setUseSystemTheme: (useSystem) => {
        set({ isSystemTheme: useSystem });
      },
      
      getActiveTheme: () => {
        const { theme, isSystemTheme } = get();
        if (isSystemTheme) {
          const systemTheme = useColorScheme();
          return systemTheme === 'dark' ? 'dark' : 'light';
        }
        return theme;
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);