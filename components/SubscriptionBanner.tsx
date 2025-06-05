import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

interface SubscriptionBannerProps {
  compact?: boolean;
}

const SubscriptionBanner = ({ compact = false }: SubscriptionBannerProps) => {
  const Colors = useThemeColors();
  const router = useRouter();
  const { getSubscriptionTier } = useSubscriptionStore();
  
  const currentTier = getSubscriptionTier();
  
  // Don't show for premium users
  if (currentTier !== 'free') {
    return null;
  }
  
  const handlePress = () => {
    router.push('/premium');
  };
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: Colors.primary }]}
        onPress={handlePress}
      >
        <Crown size={16} color="#FFFFFF" />
        <Text style={styles.compactText}>Upgrade to Premium</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: Colors.card }]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
        <Crown size={24} color="#FFFFFF" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.text }]}>Upgrade to Premium</Text>
        <Text style={[styles.description, { color: Colors.subtext }]}>
          Unlock advanced features and get more insights
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  compactText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default SubscriptionBanner;