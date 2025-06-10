import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Award, 
  TrendingUp, 
  Download, 
  Edit, 
  Zap, 
  Check, 
  X 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import PremiumFeatureModal from '@/components/PremiumFeatureModal';

export default function PremiumScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  
  const { 
    getSubscriptionTier, 
    isTrialAvailable, 
    startTrial, 
    getRemainingDays,
    restorePurchases,
    isLoading
  } = useSubscriptionStore();
  
  const currentTier = getSubscriptionTier();
  const canTrial = isTrialAvailable();
  const remainingDays = getRemainingDays();
  
  const handleFeaturePress = (featureId: string) => {
    setSelectedFeature(featureId);
    setShowModal(true);
  };
  
  const handleStartTrial = () => {
    Alert.alert(
      "Start 7-Day Free Trial",
      "You'll get full access to all premium features for 7 days. No payment required.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Start Trial",
          onPress: () => {
            startTrial('premium');
            Alert.alert(
              "Trial Started!",
              "You now have premium access for 7 days. Enjoy all the features!"
            );
          }
        }
      ]
    );
  };
  
  const handleSubscribe = () => {
    Alert.alert(
      "Subscribe to Premium",
      "This would normally take you to the payment screen. For this demo, we'll simulate a successful subscription.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Subscribe",
          onPress: async () => {
            // Simulate subscription
            const subscription = {
              tier: 'premium',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              autoRenew: true,
              status: 'active'
            };
            
            // Store for restore purchases
            await AsyncStorage.setItem('previous-subscription', JSON.stringify(subscription));
            
            // Update store
            useSubscriptionStore.getState().setSubscription(subscription);
            
            Alert.alert(
              "Subscribed!",
              "You now have premium access. Enjoy all the features!"
            );
          }
        }
      ]
    );
  };
  
  const handleRestore = async () => {
    const restored = await restorePurchases();
    
    if (restored) {
      Alert.alert(
        "Purchases Restored",
        "Your premium subscription has been restored."
      );
    } else {
      Alert.alert(
        "No Purchases Found",
        "We couldn't find any previous purchases to restore."
      );
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>
          {currentTier === 'premium' ? 'Premium Subscription' : 'Upgrade to Premium'}
        </Text>
        
        {currentTier === 'premium' && (
          <View style={[styles.statusBadge, { backgroundColor: Colors.accent }]}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        )}
      </View>
      
      {/* Subscription Status */}
      {currentTier === 'premium' && (
        <View style={[styles.statusCard, { backgroundColor: Colors.card }]}>
          <Award size={24} color={Colors.accent} />
          <Text style={[styles.statusTitle, { color: Colors.text }]}>
            Premium Subscription Active
          </Text>
          {remainingDays > 0 && (
            <Text style={[styles.statusSubtitle, { color: Colors.subtext }]}>
              {remainingDays} days remaining
            </Text>
          )}
        </View>
      )}
      
      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Premium Features</Text>
        
        <View style={styles.featuresList}>
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: Colors.card }]}
            onPress={() => handleFeaturePress('advanced_stats')}
          >
            <TrendingUp size={24} color={Colors.primary} />
            <Text style={[styles.featureTitle, { color: Colors.text }]}>
              Advanced Analytics
            </Text>
            <Text style={[styles.featureDescription, { color: Colors.subtext }]}>
              Get detailed insights and trends about your nutrition
            </Text>
            {currentTier === 'premium' && (
              <View style={[styles.featureAccessBadge, { backgroundColor: Colors.accent }]}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.featureAccessText}>Included</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: Colors.card }]}
            onPress={() => handleFeaturePress('data_export')}
          >
            <Download size={24} color={Colors.primary} />
            <Text style={[styles.featureTitle, { color: Colors.text }]}>
              Data Export
            </Text>
            <Text style={[styles.featureDescription, { color: Colors.subtext }]}>
              Export your nutrition data in various formats
            </Text>
            {currentTier === 'premium' && (
              <View style={[styles.featureAccessBadge, { backgroundColor: Colors.accent }]}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.featureAccessText}>Included</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: Colors.card }]}
            onPress={() => handleFeaturePress('custom_foods')}
          >
            <Edit size={24} color={Colors.primary} />
            <Text style={[styles.featureTitle, { color: Colors.text }]}>
              Custom Foods
            </Text>
            <Text style={[styles.featureDescription, { color: Colors.subtext }]}>
              Create and manage your custom foods
            </Text>
            {currentTier === 'premium' && (
              <View style={[styles.featureAccessBadge, { backgroundColor: Colors.accent }]}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.featureAccessText}>Included</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Free Features */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Free Features</Text>
        
        <View style={[styles.freeFeaturesList, { backgroundColor: Colors.card }]}>
          <View style={styles.freeFeatureItem}>
            <Check size={20} color={Colors.success} />
            <Text style={[styles.freeFeatureText, { color: Colors.text }]}>
              Basic meal tracking
            </Text>
          </View>
          
          <View style={styles.freeFeatureItem}>
            <Check size={20} color={Colors.success} />
            <Text style={[styles.freeFeatureText, { color: Colors.text }]}>
              Calorie counting
            </Text>
          </View>
          
          <View style={styles.freeFeatureItem}>
            <Check size={20} color={Colors.success} />
            <Text style={[styles.freeFeatureText, { color: Colors.text }]}>
              Basic statistics
            </Text>
          </View>
          
          <View style={styles.freeFeatureItem}>
            <X size={20} color={Colors.error} />
            <Text style={[styles.freeFeatureText, { color: Colors.subtext }]}>
              Advanced analytics
            </Text>
          </View>
          
          <View style={styles.freeFeatureItem}>
            <X size={20} color={Colors.error} />
            <Text style={[styles.freeFeatureText, { color: Colors.subtext }]}>
              Data export
            </Text>
          </View>
        </View>
      </View>
      
      {/* Pricing */}
      {currentTier !== 'premium' && (
        <View style={styles.pricingSection}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Pricing</Text>
          
          <View style={[styles.pricingCard, { backgroundColor: Colors.card }]}>
            <Text style={[styles.pricingTitle, { color: Colors.text }]}>
              Premium Subscription
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceAmount, { color: Colors.text }]}>$4.99</Text>
              <Text style={[styles.priceInterval, { color: Colors.subtext }]}>/month</Text>
            </View>
            <Text style={[styles.pricingDescription, { color: Colors.subtext }]}>
              Unlock all premium features and support future development
            </Text>
            
            <TouchableOpacity 
              style={[styles.subscribeButton, { backgroundColor: Colors.primary }]}
              onPress={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Zap size={20} color="#FFFFFF" />
                  <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                </>
              )}
            </TouchableOpacity>
            
            {canTrial && (
              <TouchableOpacity 
                style={[styles.trialButton, { borderColor: Colors.primary }]}
                onPress={handleStartTrial}
                disabled={isLoading}
              >
                <Text style={[styles.trialButtonText, { color: Colors.primary }]}>
                  Start 7-Day Free Trial
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      {/* Restore Purchases */}
      <TouchableOpacity 
        style={styles.restoreButton}
        onPress={handleRestore}
        disabled={isLoading}
      >
        <Text style={[styles.restoreButtonText, { color: Colors.primary }]}>
          Restore Purchases
        </Text>
      </TouchableOpacity>
      
      {/* Feature Modal */}
      <PremiumFeatureModal
        visible={showModal}
        featureId={selectedFeature}
        onClose={() => setShowModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  featuresSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  featuresList: {
    paddingHorizontal: 16,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureAccessBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureAccessText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  freeFeaturesList: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  freeFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  freeFeatureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  pricingSection: {
    marginTop: 16,
  },
  pricingCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  priceInterval: {
    fontSize: 16,
    marginLeft: 4,
  },
  pricingDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  trialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  trialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  restoreButtonText: {
    fontSize: 14,
  },
});