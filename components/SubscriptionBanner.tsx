import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import { Crown, Gift } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SubscriptionBannerProps {
  canTrial: boolean;
}

const SubscriptionBanner = ({ canTrial }: SubscriptionBannerProps) => {
  const Colors = useThemeColors();
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/premium')}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80' }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {canTrial ? (
              <>
                <Gift size={24} color="#FFFFFF" />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Free Trial Available</Text>
                  <Text style={styles.description}>
                    Try Premium free for 7 days. Unlock all features!
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Crown size={24} color="#FFFFFF" />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Upgrade to Premium</Text>
                  <Text style={styles.description}>
                    Get advanced analytics, meal plans, and more!
                  </Text>
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: Colors.background }]}
              onPress={() => router.push('/premium')}
            >
              <Text style={[styles.buttonText, { color: Colors.primary }]}>
                {canTrial ? 'Start Free Trial' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  background: {
    width: '100%',
  },
  backgroundImage: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
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
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
});

export default SubscriptionBanner;