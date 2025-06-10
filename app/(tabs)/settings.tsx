import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  TextInput,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { 
  Target, 
  Bell, 
  Moon, 
  Info, 
  Trash2, 
  RefreshCw,
  Shield,
  HelpCircle,
  Crown,
  CreditCard,
  LogOut,
  Gift
} from 'lucide-react-native';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useThemeStore } from '@/store/themeStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferencesStore();
  const { theme, toggleTheme } = useThemeStore();
  const { 
    subscription, 
    cancelSubscription, 
    updateAutoRenew, 
    isSubscriptionActive, 
    getSubscriptionTier,
    getRemainingDays,
    isTrialAvailable,
    restorePurchases,
    isLoading
  } = useSubscriptionStore();
  
  const [dailyGoal, setDailyGoal] = useState(preferences.dailyCalorieGoal.toString());
  const [weeklyGoal, setWeeklyGoal] = useState(preferences.weeklyCalorieGoal.toString());
  
  const currentTier = getSubscriptionTier();
  const isActive = isSubscriptionActive();
  const remainingDays = getRemainingDays();
  const canTrial = isTrialAvailable();
  
  const handleSaveGoals = () => {
    const dailyGoalNum = parseInt(dailyGoal, 10);
    const weeklyGoalNum = parseInt(weeklyGoal, 10);
    
    if (isNaN(dailyGoalNum) || dailyGoalNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid daily calorie goal');
      return;
    }
    
    if (isNaN(weeklyGoalNum) || weeklyGoalNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weekly calorie goal');
      return;
    }
    
    const updatedPreferences = {
      dailyCalorieGoal: dailyGoalNum,
      weeklyCalorieGoal: weeklyGoalNum,
    };
    
    updatePreferences(updatedPreferences);
    
    Alert.alert('Success', 'Nutrition goals updated successfully');
  };
  
  const toggleNotifications = () => {
    updatePreferences({
      notifications: !preferences.notifications,
    });
  };
  
  const handleToggleTheme = () => {
    toggleTheme();
    updatePreferences({
      theme: theme === 'light' ? 'dark' : 'light',
    });
  };
  
  const handleToggleAutoRenew = () => {
    if (!subscription) return;
    
    updateAutoRenew(!subscription.autoRenew);
  };
  
  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelSubscription();
            Alert.alert(
              'Subscription Canceled',
              'Your subscription has been canceled. You will still have access until the end of your current billing period.'
            );
          },
        },
      ]
    );
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
  
  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                'Data Cleared',
                'All app data has been cleared. Please restart the app.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear app data');
            }
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Subscription Section */}
      {currentTier !== 'free' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Your Subscription</Text>
          
          <View style={[styles.subscriptionCard, { backgroundColor: Colors.card }]}>
            <View style={styles.subscriptionHeader}>
              <Crown size={24} color={Colors.accent} />
              <Text style={[styles.subscriptionTitle, { color: Colors.text }]}>
                Premium
              </Text>
              {subscription?.isTrial && (
                <View style={[styles.trialBadge, { backgroundColor: Colors.secondary }]}>
                  <Text style={styles.trialBadgeText}>TRIAL</Text>
                </View>
              )}
            </View>
            
            <View style={styles.subscriptionDetails}>
              <Text style={[styles.subscriptionStatus, { color: Colors.text }]}>
                Status: {isActive ? 'Active' : 'Inactive'}
              </Text>
              
              {remainingDays > 0 && (
                <Text style={[styles.subscriptionDays, { color: Colors.text }]}>
                  {remainingDays} days remaining
                </Text>
              )}
              
              <View style={styles.subscriptionToggle}>
                <Text style={[styles.autoRenewText, { color: Colors.text }]}>Auto-renew</Text>
                <Switch
                  value={subscription?.autoRenew || false}
                  onValueChange={handleToggleAutoRenew}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: Colors.error }]}
              onPress={handleCancelSubscription}
            >
              <Text style={[styles.cancelButtonText, { color: Colors.error }]}>
                Cancel Subscription
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {currentTier === 'free' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Subscription</Text>
          
          <TouchableOpacity 
            style={[
              styles.premiumButton, 
              { backgroundColor: canTrial ? Colors.secondary : Colors.primary }
            ]}
            onPress={() => router.push('/premium')}
          >
            {canTrial ? (
              <>
                <Gift size={20} color="#FFFFFF" />
                <Text style={styles.premiumButtonText}>Start 7-Day Free Trial</Text>
              </>
            ) : (
              <>
                <Crown size={20} color="#FFFFFF" />
                <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.restoreButton, { borderColor: Colors.border }]}
            onPress={handleRestorePurchases}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={[styles.restoreButtonText, { color: Colors.primary }]}>
                Restoring...
              </Text>
            ) : (
              <>
                <RefreshCw size={16} color={Colors.primary} />
                <Text style={[styles.restoreButtonText, { color: Colors.primary }]}>
                  Restore Purchases
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Nutrition Goals</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={[styles.settingTitle, { color: Colors.text }]}>Daily Calorie Goal</Text>
          </View>
          
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.text
              }
            ]}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="number-pad"
            placeholder="e.g. 2000"
            placeholderTextColor={Colors.mediumGray}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={[styles.settingTitle, { color: Colors.text }]}>Weekly Calorie Goal</Text>
          </View>
          
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.text
              }
            ]}
            value={weeklyGoal}
            onChangeText={setWeeklyGoal}
            keyboardType="number-pad"
            placeholder="e.g. 14000"
            placeholderTextColor={Colors.mediumGray}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: Colors.primary }]} 
          onPress={handleSaveGoals}
        >
          <Text style={styles.saveButtonText}>Save Nutrition Goals</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>App Settings</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingHeader}>
            <Bell size={20} color={Colors.primary} />
            <Text style={[styles.settingTitle, { color: Colors.text }]}>Notifications</Text>
          </View>
          
          <Switch
            value={preferences.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingHeader}>
            <Moon size={20} color={Colors.primary} />
            <Text style={[styles.settingTitle, { color: Colors.text }]}>Dark Theme</Text>
          </View>
          
          <Switch
            value={theme === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Account</Text>
        
        <TouchableOpacity style={[styles.accountButton, { borderBottomColor: Colors.border }]}>
          <CreditCard size={20} color={Colors.primary} />
          <Text style={[styles.accountButtonText, { color: Colors.text }]}>Payment Methods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.accountButton, { borderBottomColor: Colors.border }]}>
          <LogOut size={20} color={Colors.primary} />
          <Text style={[styles.accountButtonText, { color: Colors.text }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Data Management</Text>
        
        <TouchableOpacity 
          style={[styles.dangerButton, { backgroundColor: Colors.error }]} 
          onPress={clearAllData}
        >
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.syncButton, { backgroundColor: Colors.info }]}>
          <RefreshCw size={20} color="#FFFFFF" />
          <Text style={styles.syncButtonText}>Sync Data</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>About</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: Colors.border }]}>
          <View style={styles.settingHeader}>
            <Info size={20} color={Colors.primary} />
            <Text style={[styles.settingTitle, { color: Colors.text }]}>Version</Text>
          </View>
          
          <Text style={[styles.versionText, { color: Colors.subtext }]}>1.0.0</Text>
        </View>
        
        <TouchableOpacity style={[styles.aboutButton, { borderBottomColor: Colors.border }]}>
          <Shield size={20} color={Colors.primary} />
          <Text style={[styles.aboutButtonText, { color: Colors.text }]}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.aboutButton, { borderBottomColor: Colors.border }]}
          onPress={() => router.push('/premium')}
        >
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={[styles.aboutButtonText, { color: Colors.text }]}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  syncButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 16,
  },
  subscriptionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subscriptionDetails: {
    marginBottom: 16,
  },
  subscriptionStatus: {
    fontSize: 16,
    marginBottom: 4,
  },
  subscriptionDays: {
    fontSize: 16,
    marginBottom: 12,
  },
  subscriptionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoRenewText: {
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  accountButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  trialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  trialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  }
});