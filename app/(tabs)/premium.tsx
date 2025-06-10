import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Crown, 
  Check, 
  X, 
  ChevronRight, 
  Star, 
  Zap, 
  Shield,
  Tag,
  RefreshCw,
  Gift
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionTier } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function PremiumScreen() {
  const Colors = useThemeColors();
  const { 
    subscription, 
    features, 
    setSubscription, 
    isSubscriptionActive, 
    getSubscriptionTier,
    getRemainingDays,
    startTrial,
    isTrialAvailable,
    applyPromoCode,
    restorePurchases,
    isLoading
  } = useSubscriptionStore();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const currentTier = getSubscriptionTier();
  const isActive = isSubscriptionActive();
  const remainingDays = getRemainingDays();
  const canTrial = isTrialAvailable();
  
  const handleSubscribe = () => {
    // In a real app, this would open a payment flow
    Alert.alert(
      'Subscription',
      'This would start the payment process for Premium subscription.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Simulate Purchase',
          onPress: () => {
            // Simulate a successful purchase
            const now = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
            
            setSubscription({
              tier: 'premium',
              startDate: now.toISOString(),
              endDate: endDate.toISOString(),
              autoRenew: true,
              status: 'active'
            });
            
            // Save for restore purchases demo
            if (Platform.OS !== 'web') {
              try {
                const subscriptionData = {
                  tier: 'premium',
                  startDate: now.toISOString(),
                  endDate: endDate.toISOString(),
                  autoRenew: true,
                  status: 'active'
                };
                AsyncStorage.setItem('previous-subscription', JSON.stringify(subscriptionData));
              } catch (error) {
                console.error('Error saving subscription data:', error);
              }
            }
            
            setPromoApplied(false);
            setPromoDiscount(0);
            setPromoCode('');
            
            Alert.alert(
              'Success',
              'You are now subscribed to Premium!',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };
  
  const handleStartTrial = () => {
    if (!canTrial) {
      Alert.alert('Trial Unavailable', 'You have already used your free trial.');
      return;
    }
    
    Alert.alert(
      'Start Free Trial',
      'Start your 7-day free trial of Premium? No payment required.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start Trial',
          onPress: () => {
            startTrial('premium');
            Alert.alert(
              'Trial Started',
              'Your 7-day free trial of Premium has started. Enjoy!',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };
  
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    
    const success = applyPromoCode(promoCode.trim().toUpperCase());
    
    if (success) {
      // For demo purposes, we'll apply a fixed discount
      setPromoApplied(true);
      
      // Determine discount based on the code
      if (promoCode.toUpperCase() === 'WELCOME25') {
        setPromoDiscount(25);
      } else if (promoCode.toUpperCase() === 'SUMMER2025') {
        setPromoDiscount(30);
      } else {
        setPromoDiscount(20); // Default discount
      }
      
      Alert.alert(
        'Promo Applied',
        `${promoDiscount}% discount will be applied to your subscription!`
      );
    } else {
      Alert.alert(
        'Invalid Promo Code',
        'This promo code is invalid, expired, or has already been used.'
      );
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };
  
  const handleRestorePurchases = async () => {
    const restored = await restorePurchases();
    
    if (restored) {
      Alert.alert(
        'Purchases Restored',
        'Your previous subscription has been restored successfully.'
      );
    } else {
      Alert.alert(
        'No Purchases Found',
        'We couldn\'t find any previous purchases to restore.'
      );
    }
  };
  
  const getPlanPrice = () => {
    let basePrice = 4.99;
    
    if (promoApplied) {
      return (basePrice * (1 - promoDiscount / 100)).toFixed(2);
    }
    
    return basePrice.toFixed(2);
  };
  
  const renderFeatureList = () => {
    const premiumFeatures = features.filter(feature => feature.tiers.includes('premium'));
    
    return (
      <View style={styles.featureList}>
        {premiumFeatures.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color={Colors.success} />
            <Text style={[styles.featureText, { color: Colors.text }]}>{feature.name}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  const renderNotIncludedFeatures = () => {
    const notIncludedFeatures = features.filter(feature => !feature.tiers.includes('premium'));
    
    if (notIncludedFeatures.length === 0) return null;
    
    return (
      <View style={styles.notIncludedList}>
        <Text style={[styles.notIncludedTitle, { color: Colors.subtext }]}>Not Included:</Text>
        {notIncludedFeatures.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <X size={16} color={Colors.error} />
            <Text style={[styles.notIncludedText, { color: Colors.subtext }]}>{feature.name}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Current Subscription Status */}
      <View style={[styles.statusCard, { backgroundColor: Colors.card }]}>
        <View style={styles.statusHeader}>
          <Crown size={24} color={Colors.accent} />
          <Text style={[styles.statusTitle, { color: Colors.text }]}>
            {currentTier === 'free' ? 'Free Plan' : 'Premium'}
          </Text>
        </View>
        
        {currentTier !== 'free' && (
          <View style={styles.statusDetails}>
            <Text style={[styles.statusText, { color: Colors.text }]}>
              Status: {isActive ? 'Active' : 'Inactive'}
            </Text>
            {subscription?.isTrial && (
              <View style={[styles.trialBadge, { backgroundColor: Colors.accent }]}>
                <Text style={styles.trialBadgeText}>TRIAL</Text>
              </View>
            )}
            {remainingDays > 0 && (
              <Text style={[styles.statusText, { color: Colors.text }]}>
                {remainingDays} days remaining
              </Text>
            )}
          </View>
        )}
        
        {currentTier === 'free' && (
          <Text style={[styles.upgradeText, { color: Colors.primary }]}>
            Upgrade to unlock premium features
          </Text>
        )}
        
        {currentTier !== 'free' && !isActive && (
          <TouchableOpacity 
            style={[styles.renewButton, { backgroundColor: Colors.primary }]}
            onPress={handleSubscribe}
          >
            <Text style={styles.renewButtonText}>Renew Subscription</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Restore Purchases */}
      <TouchableOpacity 
        style={[styles.restoreButton, { borderColor: Colors.border }]}
        onPress={handleRestorePurchases}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <>
            <RefreshCw size={16} color={Colors.primary} />
            <Text style={[styles.restoreButtonText, { color: Colors.primary }]}>
              Restore Purchases
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Subscription Plans */}
      <View style={styles.plansContainer}>
        <Text style={[styles.plansTitle, { color: Colors.text }]}>Premium Plan</Text>
        
        {/* Premium Plan */}
        <View 
          style={[
            styles.planCard, 
            { backgroundColor: Colors.card },
            { borderColor: Colors.primary, borderWidth: 2 }
          ]}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planTitle, { color: Colors.text }]}>Premium</Text>
              <View style={styles.priceContainer}>
                {promoApplied && (
                  <Text style={[styles.originalPrice, { color: Colors.subtext }]}>
                    ${4.99}/month
                  </Text>
                )}
                <Text style={[styles.planPrice, { color: Colors.primary }]}>
                  ${getPlanPrice()}/month
                </Text>
              </View>
            </View>
            <View style={[styles.selectedBadge, { backgroundColor: Colors.primary }]}>
              <Check size={16} color="#FFFFFF" />
            </View>
          </View>
          
          {renderFeatureList()}
        </View>
        
        {/* Promo Code */}
        <View style={[styles.promoContainer, { backgroundColor: Colors.card }]}>
          <View style={styles.promoHeader}>
            <Tag size={20} color={Colors.primary} />
            <Text style={[styles.promoTitle, { color: Colors.text }]}>Promo Code</Text>
          </View>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={[styles.promoInput, { 
                backgroundColor: Colors.background,
                color: Colors.text,
                borderColor: Colors.border
              }]}
              placeholder="Enter promo code"
              placeholderTextColor={Colors.subtext}
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={[styles.promoButton, { backgroundColor: Colors.primary }]}
              onPress={handleApplyPromo}
            >
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {promoApplied && (
            <View style={styles.promoApplied}>
              <Check size={16} color={Colors.success} />
              <Text style={[styles.promoAppliedText, { color: Colors.success }]}>
                {promoDiscount}% discount applied!
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Free Trial Button */}
      {canTrial && (
        <TouchableOpacity 
          style={[styles.trialButton, { backgroundColor: Colors.secondary }]}
          onPress={handleStartTrial}
        >
          <Gift size={20} color="#FFFFFF" />
          <Text style={styles.trialButtonText}>
            Start 7-Day Free Trial
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Subscribe Button */}
      <TouchableOpacity 
        style={[
          styles.subscribeButton, 
          { backgroundColor: Colors.primary }
        ]}
        onPress={handleSubscribe}
      >
        <Text style={styles.subscribeButtonText}>
          Subscribe to Premium
        </Text>
      </TouchableOpacity>
      
      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={[styles.benefitsSectionTitle, { color: Colors.text }]}>
          Why Go Premium?
        </Text>
        
        <View style={[styles.benefitCard, { backgroundColor: Colors.card }]}>
          <View style={[styles.benefitIcon, { backgroundColor: Colors.primary }]}>
            <Zap size={24} color="#FFFFFF" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: Colors.text }]}>Advanced Analytics</Text>
            <Text style={[styles.benefitDescription, { color: Colors.subtext }]}>
              Get detailed insights about your nutrition habits and progress over time.
            </Text>
          </View>
        </View>
        
        <View style={[styles.benefitCard, { backgroundColor: Colors.card }]}>
          <View style={[styles.benefitIcon, { backgroundColor: Colors.primary }]}>
            <Star size={24} color="#FFFFFF" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: Colors.text }]}>Data Export</Text>
            <Text style={[styles.benefitDescription, { color: Colors.subtext }]}>
              Export your nutrition data in various formats for external analysis.
            </Text>
          </View>
        </View>
        
        <View style={[styles.benefitCard, { backgroundColor: Colors.card }]}>
          <View style={[styles.benefitIcon, { backgroundColor: Colors.primary }]}>
            <Shield size={24} color="#FFFFFF" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: Colors.text }]}>Ad-Free Experience</Text>
            <Text style={[styles.benefitDescription, { color: Colors.subtext }]}>
              Enjoy the app without any advertisements or interruptions.
            </Text>
          </View>
        </View>
      </View>
      
      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={[styles.faqSectionTitle, { color: Colors.text }]}>
          Frequently Asked Questions
        </Text>
        
        <TouchableOpacity style={[styles.faqItem, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.faqQuestion, { color: Colors.text }]}>
            How do I cancel my subscription?
          </Text>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.faqItem, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.faqQuestion, { color: Colors.text }]}>
            Will I lose my data if I downgrade?
          </Text>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.faqItem, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.faqQuestion, { color: Colors.text }]}>
            How does the free trial work?
          </Text>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Terms and Privacy */}
      <View style={styles.termsSection}>
        <Text style={[styles.termsText, { color: Colors.subtext }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusDetails: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  renewButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  renewButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  restoreButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  plansContainer: {
    padding: 16,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  notIncludedList: {
    marginTop: 8,
  },
  notIncludedTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  notIncludedText: {
    marginLeft: 8,
    fontSize: 14,
  },
  promoContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  promoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  promoApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  promoAppliedText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  trialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trialBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 4,
  },
  trialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subscribeButton: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitsSection: {
    padding: 16,
  },
  benefitsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  faqSection: {
    padding: 16,
  },
  faqSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    flex: 1,
  },
  termsSection: {
    padding: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});