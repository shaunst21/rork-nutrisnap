import { useThemeStore } from '@/store/themeStore';
import Colors from '@/constants/colors';
import { useColorScheme } from 'react-native';

export const useThemeColors = () => {
  const { theme, isSystemTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();
  
  // Determine the active theme
  const activeTheme = isSystemTheme 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : theme;
  
  return Colors[activeTheme] || Colors.light;
};