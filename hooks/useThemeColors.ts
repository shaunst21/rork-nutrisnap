import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

// Define the colors for light and dark themes
const lightColors = {
  primary: '#4A6FFF',
  secondary: '#6C63FF',
  accent: '#FF9800',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  subtext: '#6E6E6E',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  lightGray: '#EEEEEE',
  mediumGray: '#9E9E9E',
  dark: false,
  mealTypes: {
    breakfast: '#FF9800',
    lunch: '#4CAF50',
    dinner: '#2196F3',
    snack: '#9C27B0',
    other: '#607D8B'
  }
};

const darkColors = {
  primary: '#6C8FFF',
  secondary: '#8C83FF',
  accent: '#FFB74D',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subtext: '#AAAAAA',
  border: '#333333',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',
  lightGray: '#333333',
  mediumGray: '#757575',
  dark: true,
  mealTypes: {
    breakfast: '#FFB74D',
    lunch: '#66BB6A',
    dinner: '#42A5F5',
    snack: '#BA68C8',
    other: '#78909C'
  }
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  // Determine which theme to use
  const selectedTheme = theme === 'system' 
    ? colorScheme || 'light' 
    : theme;
  
  return selectedTheme === 'dark' ? darkColors : lightColors;
}