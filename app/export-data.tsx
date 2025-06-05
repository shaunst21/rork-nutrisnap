import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Download, 
  FileText, 
  Share2, 
  Lock, 
  CheckCircle, 
  X
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useMealStore } from '@/store/mealStore';
import { useStatsStore } from '@/store/statsStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ExportData } from '@/types';

export default function ExportDataScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  const { meals } = useMealStore();
  const stats = useStatsStore();
  const { preferences } = usePreferencesStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const hasExportFeature = hasFeature('data_export');
  
  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    if (!hasExportFeature) {
      Alert.alert(
        'Premium Feature',
        'Data export is a premium feature. Upgrade to access this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Plans', 
            onPress: () => router.push('/premium')
          }
        ]
      );
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Prepare export data
      const exportData: ExportData = {
        meals,
        stats: {
          todayCalories: stats.todayCalories,
          weekCalories: stats.weekCalories,
          monthCalories: stats.monthCalories,
          averageDailyCalories: stats.averageDailyCalories,
          commonFoods: stats.commonFoods,
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          macros: stats.macros
        },
        preferences
      };
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Exporting data in ${format} format:`, exportData);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
      Alert.alert(
        'Export Successful',
        `Your data has been exported in ${format.toUpperCase()} format.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!hasExportFeature) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            Data export is available for premium subscribers. Upgrade to export your nutrition data in various formats.
          </Text>
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/premium')}
          >
            <Text style={styles.upgradeButtonText}>View Premium Plans</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featurePreview}>
          <Text style={[styles.previewTitle, { color: Colors.text }]}>
            With Data Export You Can:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Download size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Export your nutrition data
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <FileText size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Choose from multiple formats (JSON, CSV, PDF)
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Share2 size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Share data with nutritionists or trainers
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: Colors.card }]}
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors.text }]}>Export Data</Text>
        <View style={styles.placeholder} />
      </View>
      
      <Text style={[styles.description, { color: Colors.subtext }]}>
        Export your nutrition data in various formats. You can use this data for personal analysis or share it with your nutritionist or trainer.
      </Text>
      
      <View style={styles.exportOptions}>
        <TouchableOpacity 
          style={[
            styles.exportOption, 
            { backgroundColor: Colors.card },
            isExporting && { opacity: 0.7 }
          ]}
          onPress={() => handleExport('json')}
          disabled={isExporting}
        >
          <View style={[styles.exportIcon, { backgroundColor: Colors.primary }]}>
            <FileText size={24} color="#FFFFFF" />
          </View>
          <View style={styles.exportContent}>
            <Text style={[styles.exportTitle, { color: Colors.text }]}>JSON Format</Text>
            <Text style={[styles.exportDescription, { color: Colors.subtext }]}>
              Export as JSON for technical use or data analysis
            </Text>
          </View>
          {isExporting ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Download size={24} color={Colors.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.exportOption, 
            { backgroundColor: Colors.card },
            isExporting && { opacity: 0.7 }
          ]}
          onPress={() => handleExport('csv')}
          disabled={isExporting}
        >
          <View style={[styles.exportIcon, { backgroundColor: Colors.secondary }]}>
            <FileText size={24} color="#FFFFFF" />
          </View>
          <View style={styles.exportContent}>
            <Text style={[styles.exportTitle, { color: Colors.text }]}>CSV Format</Text>
            <Text style={[styles.exportDescription, { color: Colors.subtext }]}>
              Export as CSV for spreadsheet applications
            </Text>
          </View>
          {isExporting ? (
            <ActivityIndicator color={Colors.secondary} />
          ) : (
            <Download size={24} color={Colors.secondary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.exportOption, 
            { backgroundColor: Colors.card },
            isExporting && { opacity: 0.7 }
          ]}
          onPress={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <View style={[styles.exportIcon, { backgroundColor: Colors.accent }]}>
            <FileText size={24} color="#FFFFFF" />
          </View>
          <View style={styles.exportContent}>
            <Text style={[styles.exportTitle, { color: Colors.text }]}>PDF Report</Text>
            <Text style={[styles.exportDescription, { color: Colors.subtext }]}>
              Export as PDF for easy sharing and printing
            </Text>
          </View>
          {isExporting ? (
            <ActivityIndicator color={Colors.accent} />
          ) : (
            <Download size={24} color={Colors.accent} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.dataSection}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>
          Data to be Exported
        </Text>
        
        <View style={[styles.dataItem, { backgroundColor: Colors.card }]}>
          <Text style={[styles.dataItemTitle, { color: Colors.text }]}>Meal Records</Text>
          <Text style={[styles.dataItemCount, { color: Colors.primary }]}>
            {meals.length} entries
          </Text>
        </View>
        
        <View style={[styles.dataItem, { backgroundColor: Colors.card }]}>
          <Text style={[styles.dataItemTitle, { color: Colors.text }]}>Statistics</Text>
          <Text style={[styles.dataItemCount, { color: Colors.primary }]}>
            Included
          </Text>
        </View>
        
        <View style={[styles.dataItem, { backgroundColor: Colors.card }]}>
          <Text style={[styles.dataItemTitle, { color: Colors.text }]}>Preferences</Text>
          <Text style={[styles.dataItemCount, { color: Colors.primary }]}>
            Included
          </Text>
        </View>
      </View>
      
      {exportSuccess && (
        <View style={[styles.successBanner, { backgroundColor: Colors.success }]}>
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.successText}>Export Successful!</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  exportOptions: {
    paddingHorizontal: 16,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exportContent: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 14,
  },
  dataSection: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dataItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  dataItemCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  premiumCard: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  featurePreview: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  previewFeatures: {
    marginTop: 8,
  },
  previewFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewFeatureText: {
    fontSize: 16,
    marginLeft: 12,
  },
});