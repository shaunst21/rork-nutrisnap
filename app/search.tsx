import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Search as SearchIcon, 
  Plus, 
  ChevronRight,
  Filter,
  X
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useMealStore } from '@/store/mealStore';
import MealTypeSelector from '@/components/MealTypeSelector';

// Comprehensive food database
const foodDatabase = [
  // Fruits
  {
    id: '1',
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1 medium (182g)',
    category: 'Fruits'
  },
  {
    id: '2',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium (118g)',
    category: 'Fruits'
  },
  {
    id: '3',
    name: 'Orange',
    calories: 62,
    protein: 1.2,
    carbs: 15.4,
    fat: 0.2,
    servingSize: '1 medium (131g)',
    category: 'Fruits'
  },
  {
    id: '4',
    name: 'Strawberries',
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    servingSize: '1 cup (144g)',
    category: 'Fruits'
  },
  {
    id: '5',
    name: 'Blueberries',
    calories: 84,
    protein: 1.1,
    carbs: 21.4,
    fat: 0.5,
    servingSize: '1 cup (148g)',
    category: 'Fruits'
  },
  {
    id: '6',
    name: 'Grapes',
    calories: 104,
    protein: 1.1,
    carbs: 27.3,
    fat: 0.2,
    servingSize: '1 cup (151g)',
    category: 'Fruits'
  },
  {
    id: '7',
    name: 'Pineapple',
    calories: 82,
    protein: 0.9,
    carbs: 21.6,
    fat: 0.2,
    servingSize: '1 cup chunks (165g)',
    category: 'Fruits'
  },
  {
    id: '8',
    name: 'Watermelon',
    calories: 46,
    protein: 0.9,
    carbs: 11.5,
    fat: 0.2,
    servingSize: '1 cup diced (152g)',
    category: 'Fruits'
  },
  {
    id: '9',
    name: 'Avocado',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    servingSize: '1 medium (150g)',
    category: 'Fruits'
  },
  {
    id: '10',
    name: 'Mango',
    calories: 99,
    protein: 1.4,
    carbs: 24.7,
    fat: 0.6,
    servingSize: '1 cup sliced (165g)',
    category: 'Fruits'
  },
  
  // Vegetables
  {
    id: '11',
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    servingSize: '1 cup chopped (91g)',
    category: 'Vegetables'
  },
  {
    id: '12',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100g',
    category: 'Vegetables'
  },
  {
    id: '13',
    name: 'Carrots',
    calories: 50,
    protein: 1.1,
    carbs: 12,
    fat: 0.3,
    servingSize: '1 cup chopped (128g)',
    category: 'Vegetables'
  },
  {
    id: '14',
    name: 'Bell Pepper',
    calories: 31,
    protein: 1,
    carbs: 7.6,
    fat: 0.3,
    servingSize: '1 medium (119g)',
    category: 'Vegetables'
  },
  {
    id: '15',
    name: 'Cucumber',
    calories: 16,
    protein: 0.7,
    carbs: 3.8,
    fat: 0.1,
    servingSize: '1 cup sliced (104g)',
    category: 'Vegetables'
  },
  {
    id: '16',
    name: 'Tomato',
    calories: 22,
    protein: 1.1,
    carbs: 4.8,
    fat: 0.2,
    servingSize: '1 medium (123g)',
    category: 'Vegetables'
  },
  {
    id: '17',
    name: 'Lettuce',
    calories: 5,
    protein: 0.5,
    carbs: 1,
    fat: 0.1,
    servingSize: '1 cup shredded (36g)',
    category: 'Vegetables'
  },
  {
    id: '18',
    name: 'Onion',
    calories: 44,
    protein: 1.2,
    carbs: 10.3,
    fat: 0.1,
    servingSize: '1 medium (110g)',
    category: 'Vegetables'
  },
  {
    id: '19',
    name: 'Potato',
    calories: 163,
    protein: 4.3,
    carbs: 37,
    fat: 0.2,
    servingSize: '1 medium (173g)',
    category: 'Vegetables'
  },
  {
    id: '20',
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    servingSize: '1 medium (130g)',
    category: 'Vegetables'
  },
  
  // Proteins
  {
    id: '21',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '22',
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '23',
    name: 'Ground Beef (90% lean)',
    calories: 176,
    protein: 26,
    carbs: 0,
    fat: 8,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '24',
    name: 'Tuna',
    calories: 116,
    protein: 25.5,
    carbs: 0,
    fat: 0.8,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '25',
    name: 'Eggs',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 5,
    servingSize: '1 large (50g)',
    category: 'Proteins'
  },
  {
    id: '26',
    name: 'Tofu',
    calories: 76,
    protein: 8,
    carbs: 2,
    fat: 4.5,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '27',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    servingSize: '170g',
    category: 'Proteins'
  },
  {
    id: '28',
    name: 'Cottage Cheese',
    calories: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '29',
    name: 'Pork Chop',
    calories: 143,
    protein: 26,
    carbs: 0,
    fat: 4,
    servingSize: '100g',
    category: 'Proteins'
  },
  {
    id: '30',
    name: 'Turkey Breast',
    calories: 135,
    protein: 30,
    carbs: 0,
    fat: 1,
    servingSize: '100g',
    category: 'Proteins'
  },
  
  // Grains
  {
    id: '31',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup cooked (195g)',
    category: 'Grains'
  },
  {
    id: '32',
    name: 'White Rice',
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    servingSize: '1 cup cooked (195g)',
    category: 'Grains'
  },
  {
    id: '33',
    name: 'Quinoa',
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fat: 3.6,
    servingSize: '1 cup cooked (185g)',
    category: 'Grains'
  },
  {
    id: '34',
    name: 'Oatmeal',
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    servingSize: '1 cup cooked (234g)',
    category: 'Grains'
  },
  {
    id: '35',
    name: 'Whole Wheat Bread',
    calories: 81,
    protein: 4,
    carbs: 15,
    fat: 1.1,
    servingSize: '1 slice (38g)',
    category: 'Grains'
  },
  {
    id: '36',
    name: 'White Bread',
    calories: 75,
    protein: 2.6,
    carbs: 14,
    fat: 1,
    servingSize: '1 slice (30g)',
    category: 'Grains'
  },
  {
    id: '37',
    name: 'Pasta',
    calories: 221,
    protein: 8.1,
    carbs: 43.2,
    fat: 1.3,
    servingSize: '1 cup cooked (140g)',
    category: 'Grains'
  },
  {
    id: '38',
    name: 'Bagel',
    calories: 245,
    protein: 9.6,
    carbs: 47.9,
    fat: 1.7,
    servingSize: '1 medium (105g)',
    category: 'Grains'
  },
  {
    id: '39',
    name: 'Cereal',
    calories: 110,
    protein: 2,
    carbs: 24,
    fat: 1,
    servingSize: '1 cup (30g)',
    category: 'Grains'
  },
  {
    id: '40',
    name: 'Granola',
    calories: 120,
    protein: 3,
    carbs: 18,
    fat: 5,
    servingSize: '1/4 cup (30g)',
    category: 'Grains'
  },
  
  // Dairy
  {
    id: '41',
    name: 'Milk (2%)',
    calories: 122,
    protein: 8.1,
    carbs: 11.7,
    fat: 4.8,
    servingSize: '1 cup (244g)',
    category: 'Dairy'
  },
  {
    id: '42',
    name: 'Cheddar Cheese',
    calories: 113,
    protein: 7,
    carbs: 0.4,
    fat: 9.3,
    servingSize: '1 slice (28g)',
    category: 'Dairy'
  },
  {
    id: '43',
    name: 'Yogurt (Plain)',
    calories: 59,
    protein: 3.5,
    carbs: 5,
    fat: 3.3,
    servingSize: '100g',
    category: 'Dairy'
  },
  {
    id: '44',
    name: 'Butter',
    calories: 102,
    protein: 0.1,
    carbs: 0,
    fat: 11.5,
    servingSize: '1 tbsp (14g)',
    category: 'Dairy'
  },
  {
    id: '45',
    name: 'Ice Cream',
    calories: 137,
    protein: 2.3,
    carbs: 16,
    fat: 7,
    servingSize: '1/2 cup (66g)',
    category: 'Dairy'
  },
  
  // Snacks
  {
    id: '46',
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: '28g (1oz)',
    category: 'Snacks'
  },
  {
    id: '47',
    name: 'Potato Chips',
    calories: 152,
    protein: 2,
    carbs: 15,
    fat: 10,
    servingSize: '28g (1oz)',
    category: 'Snacks'
  },
  {
    id: '48',
    name: 'Chocolate Bar',
    calories: 235,
    protein: 3.5,
    carbs: 26,
    fat: 13,
    servingSize: '1 bar (44g)',
    category: 'Snacks'
  },
  {
    id: '49',
    name: 'Popcorn',
    calories: 106,
    protein: 3.4,
    carbs: 21,
    fat: 1.2,
    servingSize: '3 cups (24g)',
    category: 'Snacks'
  },
  {
    id: '50',
    name: 'Trail Mix',
    calories: 173,
    protein: 5,
    carbs: 12,
    fat: 12,
    servingSize: '1/4 cup (30g)',
    category: 'Snacks'
  }
];

// Group foods by category
const foodCategories = foodDatabase.reduce((categories, food) => {
  if (!categories[food.category]) {
    categories[food.category] = [];
  }
  categories[food.category].push(food);
  return categories;
}, {} as Record<string, typeof foodDatabase>);

export default function SearchScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { addMeal } = useMealStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(foodDatabase);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [mealType, setMealType] = useState<string>('');
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    // Initial search results
    setSearchResults(foodDatabase);
  }, []);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(foodDatabase);
      return;
    }
    
    setIsSearching(true);
    
    // Search by name
    setTimeout(() => {
      const filteredResults = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 300);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchResults(foodCategories[category] || []);
  };
  
  const handleAddFood = (food: any) => {
    setSelectedFood(food);
    setModalVisible(true);
  };
  
  const confirmAddFood = async () => {
    if (!selectedFood) return;
    
    const multiplier = parseFloat(quantity) || 1;
    
    try {
      const newMeal = {
        food: selectedFood.name,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
        fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
        mealType: mealType || 'other',
        method: 'manual',
        notes: `${quantity} serving(s) of ${selectedFood.servingSize}`
      };
      
      await addMeal(newMeal);
      
      Alert.alert(
        'Success',
        `${selectedFood.name} added to your log`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add food to your log');
    } finally {
      setModalVisible(false);
    }
  };
  
  const renderFoodItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.foodItem, { backgroundColor: Colors.card }]}
      onPress={() => handleAddFood(item)}
    >
      <View style={styles.foodInfo}>
        <Text style={[styles.foodName, { color: Colors.text }]}>{item.name}</Text>
        <Text style={[styles.servingSize, { color: Colors.subtext }]}>
          {item.servingSize}
        </Text>
      </View>
      
      <View style={styles.nutritionInfo}>
        <Text style={[styles.calories, { color: Colors.primary }]}>
          {item.calories} cal
        </Text>
        <View style={styles.macros}>
          <Text style={[styles.macro, { color: Colors.macros.protein }]}>
            P: {item.protein}g
          </Text>
          <Text style={[styles.macro, { color: Colors.macros.carbs }]}>
            C: {item.carbs}g
          </Text>
          <Text style={[styles.macro, { color: Colors.macros.fat }]}>
            F: {item.fat}g
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: Colors.primary }]}
        onPress={() => handleAddFood(item)}
      >
        <Plus size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        { 
          backgroundColor: Colors.card,
          borderColor: selectedCategory === item ? Colors.primary : 'transparent',
          borderWidth: selectedCategory === item ? 2 : 0,
        }
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={[styles.categoryName, { color: Colors.text }]}>{item}</Text>
      <ChevronRight size={20} color={Colors.primary} />
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Search Foods</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: Colors.card }]}>
          <SearchIcon size={20} color={Colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: Colors.text }]}
            placeholder="Search for foods..."
            placeholderTextColor={Colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: Colors.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: Colors.text }]}>
            Searching...
          </Text>
        </View>
      ) : (
        <>
          {searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: Colors.text }]}>
                No results found
              </Text>
              <Text style={[styles.emptyStateDescription, { color: Colors.subtext }]}>
                Try a different search term or browse our categories
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.foodsList}
            />
          )}
          
          {!selectedCategory && (
            <View style={styles.categoriesContainer}>
              <View style={styles.categoriesHeader}>
                <Text style={[styles.categoriesTitle, { color: Colors.text }]}>
                  Browse Categories
                </Text>
              </View>
              
              <FlatList
                data={Object.keys(foodCategories)}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.categoriesList}
              />
            </View>
          )}
        </>
      )}
      
      {/* Add Food Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors.text }]}>
                Add {selectedFood?.name}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalLabel, { color: Colors.text }]}>Serving Size</Text>
              <Text style={[styles.modalServingSize, { color: Colors.subtext }]}>
                {selectedFood?.servingSize}
              </Text>
              
              <Text style={[styles.modalLabel, { color: Colors.text }]}>Quantity</Text>
              <TextInput
                style={[styles.quantityInput, { 
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border
                }]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={Colors.subtext}
              />
              
              <Text style={[styles.modalLabel, { color: Colors.text }]}>Meal Type</Text>
              <MealTypeSelector
                selectedType={mealType}
                onSelect={setMealType}
              />
              
              <View style={styles.nutritionSummary}>
                <Text style={[styles.summaryTitle, { color: Colors.text }]}>
                  Nutrition Summary
                </Text>
                
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors.subtext }]}>Calories:</Text>
                  <Text style={[styles.summaryValue, { color: Colors.text }]}>
                    {selectedFood ? Math.round(selectedFood.calories * (parseFloat(quantity) || 1)) : 0} cal
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors.subtext }]}>Protein:</Text>
                  <Text style={[styles.summaryValue, { color: Colors.macros.protein }]}>
                    {selectedFood ? Math.round(selectedFood.protein * (parseFloat(quantity) || 1) * 10) / 10 : 0}g
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors.subtext }]}>Carbs:</Text>
                  <Text style={[styles.summaryValue, { color: Colors.macros.carbs }]}>
                    {selectedFood ? Math.round(selectedFood.carbs * (parseFloat(quantity) || 1) * 10) / 10 : 0}g
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors.subtext }]}>Fat:</Text>
                  <Text style={[styles.summaryValue, { color: Colors.macros.fat }]}>
                    {selectedFood ? Math.round(selectedFood.fat * (parseFloat(quantity) || 1) * 10) / 10 : 0}g
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: Colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: Colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addFoodButton, { backgroundColor: Colors.primary }]}
                onPress={confirmAddFood}
              >
                <Text style={styles.addFoodButtonText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  foodsList: {
    paddingHorizontal: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
  },
  nutritionInfo: {
    marginRight: 12,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  macros: {
    flexDirection: 'row',
    marginTop: 4,
  },
  macro: {
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    padding: 16,
    flex: 1,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    paddingBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalServingSize: {
    fontSize: 14,
    marginBottom: 16,
  },
  quantityInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  nutritionSummary: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addFoodButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFoodButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});