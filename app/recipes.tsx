import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert
} from 'react-native';
import { 
  Search, 
  Filter, 
  Heart, 
  Clock, 
  Utensils, 
  Lock,
  BookOpen,
  ArrowLeft
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

// Mock recipes
const mockRecipes = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    description: 'A healthy salad with grilled chicken, mixed greens, and balsamic vinaigrette',
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    calories: 350,
    macros: {
      protein: 35,
      carbs: 15,
      fat: 18
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['healthy', 'high-protein', 'lunch'],
    isFavorite: true
  },
  {
    id: '2',
    name: 'Protein Smoothie Bowl',
    description: 'A delicious smoothie bowl with protein powder, fruits, and toppings',
    ingredients: [],
    instructions: [],
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    calories: 420,
    macros: {
      protein: 30,
      carbs: 45,
      fat: 12
    },
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767',
    tags: ['breakfast', 'high-protein', 'quick'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Salmon with Roasted Vegetables',
    description: 'Baked salmon fillet with a variety of roasted vegetables',
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 480,
    macros: {
      protein: 32,
      carbs: 25,
      fat: 28
    },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    tags: ['dinner', 'high-protein', 'omega-3'],
    isFavorite: false
  }
];

export default function RecipesScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  const [recipes, setRecipes] = useState(mockRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  
  const hasRecipeSuggestionsFeature = hasFeature('recipe_suggestions');
  
  const handleRecipePress = (recipeId: string) => {
    if (!hasRecipeSuggestionsFeature) {
      Alert.alert(
        'Premium Feature',
        'Recipe suggestions is a premium feature. Upgrade to access this feature.',
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
    
    // In a real app, this would navigate to a recipe detail screen
    Alert.alert('View Recipe', `This would open the details for recipe ${recipeId}.`);
  };
  
  const toggleFavorite = (recipeId: string) => {
    if (!hasRecipeSuggestionsFeature) {
      Alert.alert(
        'Premium Feature',
        'Recipe suggestions is a premium feature. Upgrade to access this feature.',
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
    
    setRecipes(recipes.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorite: !recipe.isFavorite } 
        : recipe
    ));
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Recipes',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          )
        }}
      />
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {!hasRecipeSuggestionsFeature ? (
          <>
            <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
              <Lock size={40} color={Colors.primary} />
              <Text style={[styles.premiumTitle, { color: Colors.text }]}>
                Premium Feature
              </Text>
              <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
                Recipe suggestions is available for premium subscribers. Upgrade to access hundreds of healthy recipes tailored to your nutritional goals.
              </Text>
              <TouchableOpacity 
                style={[styles.upgradeButton, { backgroundColor: Colors.primary }]}
                onPress={() => router.push('/premium')}
              >
                <Text style={styles.upgradeButtonText}>View Premium Plans</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewContainer}>
              <Text style={[styles.previewTitle, { color: Colors.text }]}>
                Preview Recipes
              </Text>
              
              <FlatList
                data={recipes.slice(0, 2)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.recipeCard, { backgroundColor: Colors.card }]}>
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.recipeImage}
                    />
                    <View style={styles.recipeLock}>
                      <Lock size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.recipeContent}>
                      <Text style={[styles.recipeName, { color: Colors.text }]}>{item.name}</Text>
                      <Text 
                        style={[styles.recipeDescription, { color: Colors.subtext }]}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                      <View style={styles.recipeStats}>
                        <View style={styles.recipeStat}>
                          <Clock size={16} color={Colors.primary} />
                          <Text style={[styles.recipeStatText, { color: Colors.subtext }]}>
                            {item.prepTime + item.cookTime} min
                          </Text>
                        </View>
                        <View style={styles.recipeStat}>
                          <Utensils size={16} color={Colors.primary} />
                          <Text style={[styles.recipeStatText, { color: Colors.subtext }]}>
                            {item.servings} servings
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.previewList}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.searchContainer}>
              <View style={[styles.searchBar, { backgroundColor: Colors.card }]}>
                <Search size={20} color={Colors.subtext} />
                <TextInput
                  style={[styles.searchInput, { color: Colors.text }]}
                  placeholder="Search recipes..."
                  placeholderTextColor={Colors.subtext}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={[styles.filterButton, { backgroundColor: Colors.card }]}>
                <Filter size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.recipeCard, { backgroundColor: Colors.card }]}
                  onPress={() => handleRecipePress(item.id)}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.recipeImage}
                  />
                  <TouchableOpacity 
                    style={[
                      styles.favoriteButton, 
                      { backgroundColor: item.isFavorite ? Colors.error : 'rgba(0, 0, 0, 0.5)' }
                    ]}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Heart 
                      size={20} 
                      color="#FFFFFF" 
                      fill={item.isFavorite ? "#FFFFFF" : "none"} 
                    />
                  </TouchableOpacity>
                  <View style={styles.recipeContent}>
                    <Text style={[styles.recipeName, { color: Colors.text }]}>{item.name}</Text>
                    <Text 
                      style={[styles.recipeDescription, { color: Colors.subtext }]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                    <View style={styles.recipeStats}>
                      <View style={styles.recipeStat}>
                        <Clock size={16} color={Colors.primary} />
                        <Text style={[styles.recipeStatText, { color: Colors.subtext }]}>
                          {item.prepTime + item.cookTime} min
                        </Text>
                      </View>
                      <View style={styles.recipeStat}>
                        <Utensils size={16} color={Colors.primary} />
                        <Text style={[styles.recipeStatText, { color: Colors.subtext }]}>
                          {item.servings} servings
                        </Text>
                      </View>
                    </View>
                    <View style={styles.macrosContainer}>
                      <Text style={[styles.caloriesText, { color: Colors.primary }]}>
                        {item.calories} calories
                      </Text>
                      <View style={styles.macros}>
                        <Text style={[styles.macroText, { color: Colors.macros.protein }]}>
                          P: {item.macros.protein}g
                        </Text>
                        <Text style={[styles.macroText, { color: Colors.macros.carbs }]}>
                          C: {item.macros.carbs}g
                        </Text>
                        <Text style={[styles.macroText, { color: Colors.macros.fat }]}>
                          F: {item.macros.fat}g
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.recipesList}
            />
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipesList: {
    padding: 16,
  },
  recipeCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  recipeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recipeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  recipeStatText: {
    fontSize: 14,
    marginLeft: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  macros: {
    flexDirection: 'row',
  },
  macroText: {
    fontSize: 14,
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
  previewContainer: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  previewList: {
    paddingBottom: 16,
  },
  recipeLock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});