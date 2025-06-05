import { useThemeStore } from '@/store/themeStore';
import Colors from '@/constants/colors';

export const useThemeColors = () => {
  const { getActiveTheme } = useThemeStore();
  const activeTheme = getActiveTheme();
  
  return Colors[activeTheme] || Colors.light;
};