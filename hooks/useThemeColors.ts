import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

export const useThemeColors = () => {
  const { theme } = useThemeStore();
  const systemTheme = useColorScheme();
  
  // Use the user's preference, or fall back to system theme
  const activeTheme = theme === 'system' ? systemTheme || 'light' : theme;
  
  const lightColors = {
    primary: '#4A6FA5',
    secondary: '#47B881',
    accent: '#FF9F1C',
    background: '#F7F9FC',
    card: '#FFFFFF',
    text: '#1A2138',
    subtext: '#6E7A8A',
    border: '#E1E4E8',
    error: '#D73A49',
    warning: '#F9A825',
    success: '#28A745',
    lightGray: '#EBEEF2',
    mealTypes: {
      breakfast: '#FF9F1C',
      lunch: '#4A6FA5',
      dinner: '#47B881',
      snack: '#9C27B0'
    }
  };
  
  const darkColors = {
    primary: '#5B8AD6',
    secondary: '#56D6A0',
    accent: '#FFA726',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subtext: '#A0A0A0',
    border: '#333333',
    error: '#F85149',
    warning: '#FFB74D',
    success: '#4CAF50',
    lightGray: '#2A2A2A',
    mealTypes: {
      breakfast: '#FFA726',
      lunch: '#5B8AD6',
      dinner: '#56D6A0',
      snack: '#BA68C8'
    }
  };
  
  return activeTheme === 'dark' ? darkColors : lightColors;
};

export default useThemeColors;