import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image
} from 'react-native';
import { 
  Crown, 
  Check, 
  X, 
  ChevronRight, 
  Star, 
  Zap, 
  Shield
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
    getRemainingDays
  } = useSubscriptionStore();
  
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('premium');
  
  const currentTier = getSubscriptionTier();
  const isActive = isSubscriptionActive();
  const remainingDays = getRemainingDays();
  
  const handleSubscribe = () => {
    // In a real app, this would open a payment flow
    Alert.alert(
      'Subscription',
      `This would start the payment process for ${selectedTier === 'premium' ? 'Premium' : 'Premium Plus'} subscription.`,
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
              tier: selectedTier,
              startDate: now.toISOString(),
              endDate: endDate.toISOString(),
              autoRenew: true,
              status: 'active'
            });
            
            Alert.alert(
              'Success',
              `You are now subscribed to ${selectedTier === 'premium' ? 'Premium' : 'Premium Plus'}!`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };
  
  const renderFeatureList = (tier: SubscriptionTier) => {
    const tierFeatures = features.filter(feature => feature.tiers.includes(tier));
    
    return (
      <View style={styles.featureList}>
        {tierFeatures.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color={Colors.success} />
            <Text style={[styles.featureText, { color: Colors.text }]}>{feature.name}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  const renderNotIncludedFeatures = (tier: SubscriptionTier) => {
    const notIncludedFeatures = features.filter(feature => !feature.tiers.includes(tier));
    
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
            {currentTier === 'free' ? 'Free Plan' : currentTier === 'premium' ? 'Premium' : 'Premium Plus'}
          </Text>
        </View>
        
        {currentTier !== 'free' && (
          <View style={styles.statusDetails}>
            <Text style={[styles.statusText, { color: Colors.text }]}>
              Status: {isActive ? 'Active' : 'Inactive'}
            </Text>
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
            onPress={() => setSelectedTier(currentTier)}
          >
            <Text style={styles.renewButtonText}>Renew Subscription</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Subscription Plans */}
      <View style={styles.plansContainer}>
        <Text style={[styles.plansTitle, { color: Colors.text }]}>Choose Your Plan</Text>
        
        {/* Premium Plan */}
        <TouchableOpacity 
          style={[
            styles.planCard, 
            { backgroundColor: Colors.card },
            selectedTier === 'premium' && { borderColor: Colors.primary, borderWidth: 2 }
          ]}
          onPress={() => setSelectedTier('premium')}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planTitle, { color: Colors.text }]}>Premium</Text>
              <Text style={[styles.planPrice, { color: Colors.primary }]}>$4.99/month</Text>
            </View>
            {selectedTier === 'premium' && (
              <View style={[styles.selectedBadge, { backgroundColor: Colors.primary }]}>
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          {renderFeatureList('premium')}
          {renderNotIncludedFeatures('premium')}
        </TouchableOpacity>
        
        {/* Premium Plus Plan */}
        <TouchableOpacity 
          style={[
            styles.planCard, 
            { backgroundColor: Colors.card },
            selectedTier === 'premium_plus' && { borderColor: Colors.accent, borderWidth: 2 }
          ]}
          onPress={() => setSelectedTier('premium_plus')}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planTitle, { color: Colors.text }]}>Premium Plus</Text>
              <Text style={[styles.planPrice, { color: Colors.accent }]}>$9.99/month</Text>
            </View>
            {selectedTier === 'premium_plus' && (
              <View style={[styles.selectedBadge, { backgroundColor: Colors.accent }]}>
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          <View style={[styles.bestValueBadge, { backgroundColor: Colors.accent }]}>
            <Text style={styles.bestValueText}>BEST VALUE</Text>
          </View>
          
          {renderFeatureList('premium_plus')}
        </TouchableOpacity>
      </View>
      
      {/* Subscribe Button */}
      <TouchableOpacity 
        style={[
          styles.subscribeButton, 
          { backgroundColor: selectedTier === 'premium' ? Colors.primary : Colors.accent }
        ]}
        onPress={handleSubscribe}
      >
        <Text style={styles.subscribeButtonText}>
          Subscribe to {selectedTier === 'premium' ? 'Premium' : 'Premium Plus'}
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
            <Text style={[styles.benefitTitle, { color: Colors.text }]}>Meal Planning</Text>
            <Text style={[styles.benefitDescription, { color: Colors.subtext }]}>
              Create and manage weekly meal plans tailored to your nutritional goals.
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
            Can I switch between plans?
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
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  subscribeButton: {
    margin: 16,
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