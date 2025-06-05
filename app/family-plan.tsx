import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Users, 
  ArrowLeft, 
  Shield, 
  Mail, 
  RefreshCw, 
  HelpCircle,
  UserPlus
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import FamilyMembersList from '@/components/FamilyMembersList';

export default function FamilyPlanScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { subscription, getSubscriptionTier } = useSubscriptionStore();
  
  const currentTier = getSubscriptionTier();
  const isFamilyPlan = currentTier === 'family';
  
  const handleUpgrade = () => {
    router.push('/premium');
  };
  
  const handleSendInvites = () => {
    Alert.alert(
      'Send Invitations',
      'This would send invitation emails to all family members in your plan.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert(
              'Invitations Sent',
              'Invitation emails have been sent to all family members.'
            );
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Family Plan</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isFamilyPlan ? (
        <>
          <View style={[styles.planCard, { backgroundColor: Colors.card }]}>
            <View style={styles.planHeader}>
              <Users size={24} color={Colors.secondary} />
              <Text style={[styles.planTitle, { color: Colors.text }]}>
                Family Plan
              </Text>
            </View>
            <Text style={[styles.planDescription, { color: Colors.subtext }]}>
              Share premium features with up to 5 family members. Everyone gets their own profile and data.
            </Text>
            
            <View style={styles.planDetails}>
              <View style={styles.planDetail}>
                <Text style={[styles.detailLabel, { color: Colors.subtext }]}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: Colors.success }]}>
                  <Text style={styles.statusBadgeText}>ACTIVE</Text>
                </View>
              </View>
              
              <View style={styles.planDetail}>
                <Text style={[styles.detailLabel, { color: Colors.subtext }]}>Price</Text>
                <Text style={[styles.detailValue, { color: Colors.text }]}>$14.99/month</Text>
              </View>
              
              <View style={styles.planDetail}>
                <Text style={[styles.detailLabel, { color: Colors.subtext }]}>Renewal Date</Text>
                <Text style={[styles.detailValue, { color: Colors.text }]}>
                  {subscription?.endDate 
                    ? new Date(subscription.endDate).toLocaleDateString() 
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.section, { backgroundColor: Colors.card }]}>
            <FamilyMembersList />
            
            <TouchableOpacity 
              style={[styles.sendInvitesButton, { backgroundColor: Colors.secondary }]}
              onPress={handleSendInvites}
            >
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.sendInvitesButtonText}>Send Invitations</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Shield size={20} color={Colors.secondary} />
              <Text style={[styles.infoText, { color: Colors.text }]}>
                Each family member gets their own profile and data privacy
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <RefreshCw size={20} color={Colors.secondary} />
              <Text style={[styles.infoText, { color: Colors.text }]}>
                Family members can join or leave at any time
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <HelpCircle size={20} color={Colors.secondary} />
              <Text style={[styles.infoText, { color: Colors.text }]}>
                Need help? Contact our support team
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.upgradeContainer}>
          <View style={[styles.upgradeCard, { backgroundColor: Colors.card }]}>
            <Users size={64} color={Colors.secondary} />
            <Text style={[styles.upgradeTitle, { color: Colors.text }]}>
              Family Plan
            </Text>
            <Text style={[styles.upgradeDescription, { color: Colors.subtext }]}>
              Share premium features with up to 5 family members. Everyone gets their own profile and data.
            </Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Shield size={20} color={Colors.secondary} />
                <Text style={[styles.featureText, { color: Colors.text }]}>
                  All Premium Plus features for everyone
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <UserPlus size={20} color={Colors.secondary} />
                <Text style={[styles.featureText, { color: Colors.text }]}>
                  Add up to 5 family members
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Mail size={20} color={Colors.secondary} />
                <Text style={[styles.featureText, { color: Colors.text }]}>
                  Easy email invitations
                </Text>
              </View>
            </View>
            
            <View style={styles.pricingContainer}>
              <Text style={[styles.pricingLabel, { color: Colors.subtext }]}>
                Family Plan Price
              </Text>
              <Text style={[styles.pricingValue, { color: Colors.secondary }]}>
                $14.99
                <Text style={[styles.pricingPeriod, { color: Colors.subtext }]}>/month</Text>
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: Colors.secondary }]}
              onPress={handleUpgrade}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Family Plan</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.compareText, { color: Colors.subtext }]}>
            Save up to 70% compared to individual subscriptions
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  planCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  planDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  planDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendInvitesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  sendInvitesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  infoSection: {
    margin: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  upgradeContainer: {
    padding: 16,
    alignItems: 'center',
  },
  upgradeCard: {
    width: '100%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pricingLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  pricingValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pricingPeriod: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  upgradeButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  compareText: {
    fontSize: 14,
    marginTop: 16,
  },
});