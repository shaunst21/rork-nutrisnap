import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  FlatList
} from 'react-native';
import { 
  Calendar, 
  Plus, 
  ChevronRight, 
  Lock, 
  Clock, 
  Utensils, 
  BarChart2
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

// Mock meal plans
const mockMealPlans = [
  {
    id: '1',
    name: 'Weight Loss Plan',
    description: 'A balanced meal plan designed for weight loss',
    days: [],
    totalCalories: 1800,
    totalMacros: {
      protein: 135,
      carbs: 180,
      fat: 60
    },
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Muscle Building',
    description: 'High protein meal plan for muscle growth',
    days: [],
    totalCalories: 2500,
    totalMacros: {
      protein: 200,
      carbs: 250,
      fat: 70
    },
    isActive: false,
    createdAt: new Date().toISOString()
  }
];

export default function MealPlansScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  const [mealPlans, setMealPlans] = useState(mockMealPlans);
  
  const hasMealPlanningFeature = hasFeature('meal_planning');
  
  const handleCreatePlan = () => {
    if (!hasMealPlanningFeature) {
      Alert.alert(
        'Premium Feature',
        'Meal planning is a premium feature. Upgrade to access this feature.',
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
    
    // In a real app, this would navigate to a meal plan creation screen
    Alert.alert('Create Plan', 'This would open the meal plan creation screen.');
  };
  
  const handlePlanPress = (planId: string) => {
    if (!hasMealPlanningFeature) {
      Alert.alert(
        'Premium Feature',
        'Meal planning is a premium feature. Upgrade to access this feature.',
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
    
    // In a real app, this would navigate to a meal plan detail screen
    Alert.alert('View Plan', `This would open the details for plan ${planId}.`);
  };
  
  if (!hasMealPlanningFeature) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            Meal planning is available for premium subscribers. Upgrade to create personalized meal plans based on your nutritional goals.
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
            With Meal Planning You Can:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Calendar size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Create weekly meal plans
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Utensils size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Get recipe suggestions
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <BarChart2 size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Track nutritional goals
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Clock size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Save time on meal prep
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Meal Plans</Text>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: Colors.primary }]}
          onPress={handleCreatePlan}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Plan</Text>
        </TouchableOpacity>
      </View>
      
      {mealPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar size={64} color={Colors.mediumGray} />
          <Text style={[styles.emptyStateTitle, { color: Colors.text }]}>
            No Meal Plans Yet
          </Text>
          <Text style={[styles.emptyStateDescription, { color: Colors.subtext }]}>
            Create your first meal plan to get started with organized nutrition.
          </Text>
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: Colors.primary }]}
            onPress={handleCreatePlan}
          >
            <Text style={styles.emptyStateButtonText}>Create Your First Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mealPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.planCard, 
                { backgroundColor: Colors.card },
                item.isActive && styles.activePlanCard
              ]}
              onPress={() => handlePlanPress(item.id)}
            >
              {item.isActive && (
                <View style={[styles.activeBadge, { backgroundColor: Colors.success }]}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              )}
              
              <Text style={[styles.planName, { color: Colors.text }]}>{item.name}</Text>
              <Text style={[styles.planDescription, { color: Colors.subtext }]}>
                {item.description}
              </Text>
              
              <View style={styles.planStats}>
                <View style={styles.planStat}>
                  <Text style={[styles.planStatValue, { color: Colors.primary }]}>
                    {item.totalCalories}
                  </Text>
                  <Text style={[styles.planStatLabel, { color: Colors.subtext }]}>
                    calories/day
                  </Text>
                </View>
                
                <View style={styles.planStat}>
                  <Text style={[styles.planStatValue, { color: Colors.macros.protein }]}>
                    {item.totalMacros.protein}g
                  </Text>
                  <Text style={[styles.planStatLabel, { color: Colors.subtext }]}>
                    protein
                  </Text>
                </View>
                
                <View style={styles.planStat}>
                  <Text style={[styles.planStatValue, { color: Colors.macros.carbs }]}>
                    {item.totalMacros.carbs}g
                  </Text>
                  <Text style={[styles.planStatLabel, { color: Colors.subtext }]}>
                    carbs
                  </Text>
                </View>
                
                <View style={styles.planStat}>
                  <Text style={[styles.planStatValue, { color: Colors.macros.fat }]}>
                    {item.totalMacros.fat}g
                  </Text>
                  <Text style={[styles.planStatLabel, { color: Colors.subtext }]}>
                    fat
                  </Text>
                </View>
              </View>
              
              <View style={styles.planFooter}>
                <Text style={[styles.planDays, { color: Colors.subtext }]}>
                  7-day plan
                </Text>
                <ChevronRight size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  plansList: {
    padding: 16,
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
  activePlanCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planStat: {
    alignItems: 'center',
  },
  planStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planStatLabel: {
    fontSize: 12,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDays: {
    fontSize: 14,
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