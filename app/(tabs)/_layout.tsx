import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, BarChart2, History, Camera, Settings, Crown } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/themeStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const Colors = useThemeColors();

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
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          href: null, // Hide this tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="meal-plans"
        options={{
          title: 'Meal Plans',
          href: null, // Hide this tab from the tab bar
        }}
      />
    </Tabs>
  );
}