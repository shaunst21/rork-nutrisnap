import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  History, 
  Camera, 
  BarChart2, 
  Settings,
  Crown,
  BookOpen,
  Calendar
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function TabLayout() {
  const Colors = useThemeColors();
  const { hasFeature } = useSubscriptionStore();
  
  const hasRecipeSuggestionsFeature = hasFeature('recipe_suggestions');
  const hasMealPlanningFeature = hasFeature('meal_planning');
  
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
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      {hasRecipeSuggestionsFeature && (
        <Tabs.Screen
          name="recipes"
          options={{
            title: 'Recipes',
            tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          }}
        />
      )}
      {hasMealPlanningFeature && (
        <Tabs.Screen
          name="meal-plans"
          options={{
            title: 'Meal Plans',
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="premium"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => <Crown size={24} color={color} />,
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