import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

export const useThemeColors = () => {
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  // Use the theme from the store, or fall back to system theme
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const isDark = colorScheme === 'dark';
  
  return {
    primary: '#4CAF50',
    secondary: '#FF9800',
    accent: '#9C27B0',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    
    background: isDark ? '#121212' : '#F5F5F5',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    subtext: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? '#333333' : '#E0E0E0',
    
    lightGray: isDark ? '#333333' : '#EEEEEE',
    mediumGray: isDark ? '#666666' : '#BBBBBB',
    
    macros: {
      protein: '#FF5722',
      carbs: '#2196F3',
      fat: '#FFC107'
    },
    
    mealTypes: {
      breakfast: '#FF9800',
      lunch: '#4CAF50',
      dinner: '#2196F3',
      snack: '#9C27B0'
    },
    
    supportBubble: '#2196F3',
    supportText: '#FFFFFF'
  };
};