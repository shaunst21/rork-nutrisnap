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
  HelpCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePreferencesStore } from '@/store/preferencesStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { preferences, updatePreferences } = usePreferencesStore();
  
  const [dailyGoal, setDailyGoal] = useState(preferences.dailyCalorieGoal.toString());
  const [weeklyGoal, setWeeklyGoal] = useState(preferences.weeklyCalorieGoal.toString());
  
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
    
    updatePreferences({
      dailyCalorieGoal: dailyGoalNum,
      weeklyCalorieGoal: weeklyGoalNum,
    });
    
    Alert.alert('Success', 'Calorie goals updated successfully');
  };
  
  const toggleNotifications = () => {
    updatePreferences({
      notifications: !preferences.notifications,
    });
  };
  
  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === 'light' ? 'dark' : 'light',
    });
    
    Alert.alert(
      'Theme Changed',
      'Theme changes will take effect after restarting the app',
      [{ text: 'OK' }]
    );
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calorie Goals</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Daily Calorie Goal</Text>
          </View>
          
          <TextInput
            style={styles.input}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="number-pad"
            placeholder="e.g. 2000"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Weekly Calorie Goal</Text>
          </View>
          
          <TextInput
            style={styles.input}
            value={weeklyGoal}
            onChangeText={setWeeklyGoal}
            keyboardType="number-pad"
            placeholder="e.g. 14000"
          />
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoals}>
          <Text style={styles.saveButtonText}>Save Goals</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Bell size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Notifications</Text>
          </View>
          
          <Switch
            value={preferences.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Moon size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Dark Theme</Text>
          </View>
          
          <Switch
            value={preferences.theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.syncButton}>
          <RefreshCw size={20} color="#FFFFFF" />
          <Text style={styles.syncButtonText}>Sync Data</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Info size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Version</Text>
          </View>
          
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
        
        <TouchableOpacity style={styles.aboutButton}>
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.aboutButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutButton}>
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.aboutButtonText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.error,
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
    backgroundColor: Colors.info,
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
    borderBottomColor: Colors.border,
  },
  aboutButtonText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 16,
    color: Colors.subtext,
  },
});