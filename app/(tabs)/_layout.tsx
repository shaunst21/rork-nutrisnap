import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  BarChart2, 
  Calendar, 
  BookOpen, 
  Crown
} from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
  const Colors = useThemeColors();
  const { fetchMeals, syncOfflineMeals } = useMealStore();
  const { fetchStats } = useStatsStore();
  
  // Load data when the app starts
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchMeals();
      await fetchStats();
      await syncOfflineMeals();
    };
    
    loadInitialData();
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
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => <Crown size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}