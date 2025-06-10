import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Search as SearchIcon, 
  Plus, 
  ChevronRight,
  Filter
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Mock food database
const mockFoods = [
  {
    id: '1',
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1 medium (182g)'
  },
  {
    id: '2',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium (118g)'
  },
  {
    id: '3',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g'
  },
  {
    id: '4',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup cooked (195g)'
  },
  {
    id: '5',
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100g'
  },
  {
    id: '6',
    name: 'Avocado',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    servingSize: '1 medium (150g)'
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    servingSize: '170g'
  },
  {
    id: '8',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100g'
  },
  {
    id: '9',
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: '28g (1oz)'
  },
  {
    id: '10',
    name: 'Oatmeal',
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    servingSize: '1 cup cooked (234g)'
  }
];

export default function SearchScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(mockFoods);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(mockFoods);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockFoods.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };
  
  const handleAddFood = (food: any) => {
    Alert.alert(
      'Add Food',
      `Add ${food.name} to your log?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Add',
          onPress: () => {
            Alert.alert('Success', `${food.name} added to your log`);
            router.back();
          }
        }
      ]
    );
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
          
          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesHeader}>
              <Text style={[styles.categoriesTitle, { color: Colors.text }]}>
                Browse Categories
              </Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: Colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.categoriesList}>
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: Colors.card }]}>
                <Text style={[styles.categoryName, { color: Colors.text }]}>Fruits</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: Colors.card }]}>
                <Text style={[styles.categoryName, { color: Colors.text }]}>Vegetables</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: Colors.card }]}>
                <Text style={[styles.categoryName, { color: Colors.text }]}>Proteins</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: Colors.card }]}>
                <Text style={[styles.categoryName, { color: Colors.text }]}>Grains</Text>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </>
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
    marginTop: 8,
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
});