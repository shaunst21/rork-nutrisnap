import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  Switch,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Lock,
  Database,
  Save
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import PremiumFeatureModal from '@/components/PremiumFeatureModal';

// Mock custom foods
const mockCustomFoods = [
  {
    id: '1',
    name: "Mom's Lasagna",
    calories: 320,
    protein: 18,
    carbs: 32,
    fat: 12,
    servingSize: '1 slice (250g)',
    isPrivate: true
  },
  {
    id: '2',
    name: "Homemade Protein Shake",
    calories: 220,
    protein: 30,
    carbs: 15,
    fat: 5,
    servingSize: '1 cup (300ml)',
    isPrivate: false
  },
  {
    id: '3',
    name: "Avocado Toast",
    calories: 280,
    protein: 8,
    carbs: 22,
    fat: 18,
    servingSize: '1 slice',
    isPrivate: false
  }
];

export default function CustomFoodsScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  
  const [customFoods, setCustomFoods] = useState(mockCustomFoods);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  
  const hasCustomFoodsFeature = hasFeature('custom_foods');
  
  const filteredFoods = customFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFood = () => {
    if (!hasCustomFoodsFeature) {
      setShowPremiumModal(true);
      return;
    }
    
    setEditMode(true);
    setEditingFood({
      id: Date.now().toString(),
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: '',
      isPrivate: false
    });
  };
  
  const handleEditFood = (food: any) => {
    if (!hasCustomFoodsFeature) {
      setShowPremiumModal(true);
      return;
    }
    
    setEditMode(true);
    setEditingFood({...food});
  };
  
  const handleDeleteFood = (id: string) => {
    if (!hasCustomFoodsFeature) {
      setShowPremiumModal(true);
      return;
    }
    
    Alert.alert(
      'Delete Food',
      'Are you sure you want to delete this custom food?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCustomFoods(customFoods.filter(food => food.id !== id));
            Alert.alert('Success', 'Custom food deleted successfully');
          }
        }
      ]
    );
  };
  
  const handleSaveFood = () => {
    if (!editingFood.name.trim()) {
      Alert.alert('Error', 'Food name is required');
      return;
    }
    
    if (isNaN(editingFood.calories) || editingFood.calories < 0) {
      Alert.alert('Error', 'Please enter a valid calorie value');
      return;
    }
    
    const isNewFood = !customFoods.find(food => food.id === editingFood.id);
    
    if (isNewFood) {
      setCustomFoods([...customFoods, editingFood]);
    } else {
      setCustomFoods(customFoods.map(food => 
        food.id === editingFood.id ? editingFood : food
      ));
    }
    
    setEditMode(false);
    setEditingFood(null);
    Alert.alert('Success', `Custom food ${isNewFood ? 'added' : 'updated'} successfully`);
  };
  
  if (!hasCustomFoodsFeature) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>Custom Foods</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Plus Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            Custom Foods Database is available for Premium Plus subscribers. Upgrade to create and save your own custom foods.
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
            With Custom Foods You Can:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Plus size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Create your own custom foods with detailed nutrition info
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Database size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Build a personal database of your favorite recipes
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Save size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Save time by quickly adding your custom foods to your log
              </Text>
            </View>
          </View>
        </View>
        
        <PremiumFeatureModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Custom Foods Database"
          description="Create and save your own custom foods with detailed nutrition information. Build a personal database of your favorite recipes."
        />
      </View>
    );
  }
  
  if (editMode) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setEditMode(false);
              setEditingFood(null);
            }}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>
            {editingFood.name ? `Edit ${editingFood.name}` : 'Add Custom Food'}
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.editContainer}>
          <View style={[styles.inputGroup, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.inputLabel, { color: Colors.text }]}>Food Name</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors.card,
                  color: Colors.text,
                  borderColor: Colors.border
                }
              ]}
              value={editingFood.name}
              onChangeText={(text) => setEditingFood({...editingFood, name: text})}
              placeholder="Enter food name"
              placeholderTextColor={Colors.subtext}
            />
          </View>
          
          <View style={[styles.inputGroup, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.inputLabel, { color: Colors.text }]}>Serving Size</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors.card,
                  color: Colors.text,
                  borderColor: Colors.border
                }
              ]}
              value={editingFood.servingSize}
              onChangeText={(text) => setEditingFood({...editingFood, servingSize: text})}
              placeholder="e.g. 1 cup, 100g, 1 slice"
              placeholderTextColor={Colors.subtext}
            />
          </View>
          
          <View style={[styles.inputGroup, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.inputLabel, { color: Colors.text }]}>Calories</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors.card,
                  color: Colors.text,
                  borderColor: Colors.border
                }
              ]}
              value={editingFood.calories.toString()}
              onChangeText={(text) => setEditingFood({...editingFood, calories: parseInt(text) || 0})}
              keyboardType="number-pad"
              placeholder="Enter calories"
              placeholderTextColor={Colors.subtext}
            />
          </View>
          
          <View style={styles.macrosContainer}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Macronutrients (g)</Text>
            
            <View style={styles.macrosGrid}>
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.macros.protein }]}>Protein</Text>
                <TextInput
                  style={[
                    styles.macroTextInput, 
                    { 
                      backgroundColor: Colors.card,
                      color: Colors.text,
                      borderColor: Colors.border
                    }
                  ]}
                  value={editingFood.protein.toString()}
                  onChangeText={(text) => setEditingFood({...editingFood, protein: parseInt(text) || 0})}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                />
              </View>
              
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.macros.carbs }]}>Carbs</Text>
                <TextInput
                  style={[
                    styles.macroTextInput, 
                    { 
                      backgroundColor: Colors.card,
                      color: Colors.text,
                      borderColor: Colors.border
                    }
                  ]}
                  value={editingFood.carbs.toString()}
                  onChangeText={(text) => setEditingFood({...editingFood, carbs: parseInt(text) || 0})}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                />
              </View>
              
              <View style={styles.macroInput}>
                <Text style={[styles.macroLabel, { color: Colors.macros.fat }]}>Fat</Text>
                <TextInput
                  style={[
                    styles.macroTextInput, 
                    { 
                      backgroundColor: Colors.card,
                      color: Colors.text,
                      borderColor: Colors.border
                    }
                  ]}
                  value={editingFood.fat.toString()}
                  onChangeText={(text) => setEditingFood({...editingFood, fat: parseInt(text) || 0})}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.subtext}
                />
              </View>
            </View>
          </View>
          
          <View style={[styles.inputGroup, { borderBottomColor: Colors.border }]}>
            <View style={styles.switchContainer}>
              <Text style={[styles.inputLabel, { color: Colors.text }]}>Private Food</Text>
              <Switch
                value={editingFood.isPrivate}
                onValueChange={(value) => setEditingFood({...editingFood, isPrivate: value})}
                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              />
            </View>
            <Text style={[styles.helperText, { color: Colors.subtext }]}>
              Private foods are only visible to you and won't be shared with the community.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: Colors.primary }]}
            onPress={handleSaveFood}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Food</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Custom Foods</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.primary }]}
          onPress={handleAddFood}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: Colors.card }]}>
        <Search size={20} color={Colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: Colors.text }]}
          placeholder="Search your custom foods..."
          placeholderTextColor={Colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.foodsList}>
        {filteredFoods.length === 0 ? (
          <View style={styles.emptyState}>
            <Database size={64} color={Colors.mediumGray} />
            <Text style={[styles.emptyStateTitle, { color: Colors.text }]}>
              No Custom Foods Yet
            </Text>
            <Text style={[styles.emptyStateDescription, { color: Colors.subtext }]}>
              Create your first custom food to start building your personal database.
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: Colors.primary }]}
              onPress={handleAddFood}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyStateButtonText}>Add Custom Food</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredFoods.map(food => (
            <View 
              key={food.id} 
              style={[styles.foodItem, { backgroundColor: Colors.card }]}
            >
              <View style={styles.foodInfo}>
                <View style={styles.foodHeader}>
                  <Text style={[styles.foodName, { color: Colors.text }]}>{food.name}</Text>
                  {food.isPrivate && (
                    <View style={[styles.privateBadge, { backgroundColor: Colors.primary }]}>
                      <Text style={styles.privateBadgeText}>PRIVATE</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.servingSize, { color: Colors.subtext }]}>
                  {food.servingSize}
                </Text>
                
                <View style={styles.nutritionInfo}>
                  <Text style={[styles.calories, { color: Colors.primary }]}>
                    {food.calories} calories
                  </Text>
                  <View style={styles.macros}>
                    <Text style={[styles.macro, { color: Colors.macros.protein }]}>
                      P: {food.protein}g
                    </Text>
                    <Text style={[styles.macro, { color: Colors.macros.carbs }]}>
                      C: {food.carbs}g
                    </Text>
                    <Text style={[styles.macro, { color: Colors.macros.fat }]}>
                      F: {food.fat}g
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.foodActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
                  onPress={() => handleEditFood(food)}
                >
                  <Edit2 size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.error }]}
                  onPress={() => handleDeleteFood(food.id)}
                >
                  <Trash2 size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: 40,
  },
  foodsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  privateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  privateBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  servingSize: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calories: {
    fontSize: 14,
    fontWeight: '500',
  },
  macros: {
    flexDirection: 'row',
  },
  macro: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  foodActions: {
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  editContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    marginTop: 8,
  },
  macrosContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroInput: {
    flex: 1,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  macroTextInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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