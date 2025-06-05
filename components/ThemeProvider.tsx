import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { usePreferencesStore } from '@/store/preferencesStore';

// Create context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { theme, isSystemTheme, setTheme, toggleTheme } = useThemeStore();
  const { preferences, updatePreferences } = usePreferencesStore();
  
  // Sync theme with preferences
  useEffect(() => {
    if (preferences.theme === 'system') {
      setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
    } else if (preferences.theme !== theme) {
      setTheme(preferences.theme as 'light' | 'dark');
    }
  }, [preferences.theme, systemColorScheme]);
  
  // Update status bar based on theme
  useEffect(() => {
    const currentTheme = isSystemTheme 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : theme;
      
    StatusBar.setBarStyle(currentTheme === 'dark' ? 'light-content' : 'dark-content');
  }, [theme, isSystemTheme, systemColorScheme]);
  
  const activeTheme = isSystemTheme 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : theme;
  
  return (
    <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;