import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Crown } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SubscriptionBannerProps {
  canTrial: boolean;
}

const SubscriptionBanner = ({ canTrial }: SubscriptionBannerProps) => {
  const Colors = useThemeColors();
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: canTrial ? Colors.secondary : Colors.primary,
        }
      ]}
      onPress={() => router.push('/premium')}
    >
      <View style={styles.content}>
        <Crown size={24} color="#FFFFFF" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {canTrial ? 'Try Premium for Free' : 'Upgrade to Premium'}
          </Text>
          <Text style={styles.description}>
            {canTrial 
              ? 'Start your 7-day free trial today' 
              : 'Get advanced analytics and more'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
});

export default SubscriptionBanner;