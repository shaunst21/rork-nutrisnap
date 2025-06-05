import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ThemeProvider from '@/components/ThemeProvider';
import { useThemeStore } from '@/store/themeStore';
import { useColorScheme } from 'react-native';
import { useStatsStore } from '@/store/statsStore';
import { useMealStore } from '@/store/mealStore';

export default function RootLayout() {
  const { theme, isSystemTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const { fetchStats } = useStatsStore();
  const { fetchMeals } = useMealStore();
  
  // Determine the active theme
  const activeTheme = isSystemTheme 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : theme;
  
  // Initialize data on app start
  useEffect(() => {
    const initializeData = async () => {
      await fetchMeals();
      await fetchStats();
    };
    
    initializeData();
  }, []);
  
  return (
    <ThemeProvider>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="scan" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="manual-entry" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="export-data" 
          options={{ 
            title: 'Export Data',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="ai-coach" 
          options={{ 
            title: 'AI Nutrition Coach',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="family-plan" 
          options={{ 
            title: 'Family Plan',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}