import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Home, History, Camera, Settings, BarChart } from 'lucide-react-native';
import { useStatsStore } from '@/store/statsStore';
import { useMealStore } from '@/store/mealStore';
import { checkAndUpdateStreak } from '@/utils/streakHelpers';

export default function TabLayout() {
  const Colors = useThemeColors();
  const fetchStats = useStatsStore(state => state.fetchStats);
  const fetchMeals = useMealStore(state => state.fetchMeals);
  
  useEffect(() => {
    // Check and update streak status
    checkAndUpdateStreak();
    
    // Fetch meals and stats on app start
    fetchMeals().then(() => {
      fetchStats();
    });
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan-tab"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}