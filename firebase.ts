import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Meal, StreakData } from '@/types';

// Mock Firebase implementation since we can't actually connect to Firebase
// In a real app, this would be replaced with actual Firebase initialization

class MockFirestore {
  async getCollection(path: string) {
    try {
      const data = await AsyncStorage.getItem(`firebase_${path}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting collection:', error);
      return [];
    }
  }

  async addDocument(path: string, data: any) {
    try {
      // Get existing collection
      const collection = await this.getCollection(path);
      
      // Create new document with ID and timestamp
      const newDoc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        ...data
      };
      
      // Add to collection
      collection.push(newDoc);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(`firebase_${path}`, JSON.stringify(collection));
      
      return newDoc;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async updateDocument(path: string, id: string, data: any) {
    try {
      // Get existing collection
      const collection = await this.getCollection(path);
      
      // Find document index
      const index = collection.findIndex((doc: any) => doc.id === id);
      
      if (index !== -1) {
        // Update document
        collection[index] = {
          ...collection[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // Save back to AsyncStorage
        await AsyncStorage.setItem(`firebase_${path}`, JSON.stringify(collection));
        
        return collection[index];
      }
      
      throw new Error('Document not found');
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(path: string, id: string) {
    try {
      // Get existing collection
      const collection = await this.getCollection(path);
      
      // Filter out document
      const newCollection = collection.filter((doc: any) => doc.id !== id);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(`firebase_${path}`, JSON.stringify(newCollection));
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Query methods
  async query(path: string, filters: Array<{field: string, operator: string, value: any}>) {
    try {
      const collection = await this.getCollection(path);
      
      return collection.filter((doc: any) => {
        return filters.every(filter => {
          const { field, operator, value } = filter;
          
          switch (operator) {
            case '==':
              return doc[field] === value;
            case '!=':
              return doc[field] !== value;
            case '>':
              return doc[field] > value;
            case '>=':
              return doc[field] >= value;
            case '<':
              return doc[field] < value;
            case '<=':
              return doc[field] <= value;
            default:
              return true;
          }
        });
      });
    } catch (error) {
      console.error('Error querying collection:', error);
      return [];
    }
  }
}

// Create mock Firebase instance
const firestore = new MockFirestore();

// Helper functions for common operations
export const getMeals = async (): Promise<Meal[]> => {
  const meals = await firestore.getCollection('users/CalorieLens/meals');
  console.log('Retrieved meals:', meals.length);
  return meals;
};

export const addMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
  // Ensure calories is a number
  const processedMealData = {
    ...mealData,
    calories: Number(mealData.calories)
  };
  
  const meal = await firestore.addDocument('users/CalorieLens/meals', processedMealData);
  console.log('Added meal:', meal);
  return meal;
};

export const updateMeal = async (id: string, mealData: Partial<Meal>): Promise<Meal> => {
  // Ensure calories is a number if provided
  const processedMealData = {
    ...mealData
  };
  
  if (mealData.calories !== undefined) {
    processedMealData.calories = Number(mealData.calories);
  }
  
  return await firestore.updateDocument('users/CalorieLens/meals', id, processedMealData);
};

export const deleteMeal = async (id: string): Promise<boolean> => {
  return await firestore.deleteDocument('users/CalorieLens/meals', id);
};

export const getMealsForDate = async (date: string): Promise<Meal[]> => {
  // Get start and end of day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return await firestore.query('users/CalorieLens/meals', [
    { field: 'date', operator: '>=', value: startDate.toISOString() },
    { field: 'date', operator: '<=', value: endDate.toISOString() }
  ]);
};

export const getStreakData = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem('streak_data');
    const streakData = data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null
    };
    
    console.log('Retrieved streak data:', streakData);
    return streakData;
  } catch (error) {
    console.error('Error getting streak data:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null
    };
  }
};

export const updateStreakData = async (streakData: StreakData): Promise<StreakData> => {
  try {
    await AsyncStorage.setItem('streak_data', JSON.stringify(streakData));
    console.log('Updated streak data:', streakData);
    return streakData;
  } catch (error) {
    console.error('Error updating streak data:', error);
    throw error;
  }
};

// Check if device is online
export const isOnline = (): boolean => {
  // In a real app, this would check network connectivity
  // For this mock, we'll assume always online for testing
  return true;
};

// Sync offline data when back online
export const syncOfflineData = async (): Promise<void> => {
  try {
    const offlineData = await AsyncStorage.getItem('offline_meals');
    
    if (offlineData) {
      const meals = JSON.parse(offlineData);
      console.log('Syncing offline meals:', meals.length);
      
      // In a real app, this would batch upload to Firebase
      for (const meal of meals) {
        await addMeal(meal);
      }
      
      // Clear offline data
      await AsyncStorage.removeItem('offline_meals');
      console.log('Offline meals synced and cleared');
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
};

// Add a debug function to add sample meals for testing
export const addSampleMeals = async (): Promise<void> => {
  try {
    const today = new Date();
    
    // Sample meals for today
    const breakfast = {
      food: "Oatmeal with berries",
      calories: 350,
      mealType: "breakfast",
      date: new Date(today).toISOString(),
      method: "manual" as const
    };
    
    const lunch = {
      food: "Chicken salad",
      calories: 450,
      mealType: "lunch",
      date: new Date(today).toISOString(),
      method: "manual" as const
    };
    
    const dinner = {
      food: "Salmon with vegetables",
      calories: 550,
      mealType: "dinner",
      date: new Date(today).toISOString(),
      method: "manual" as const
    };
    
    // Sample meals for yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayBreakfast = {
      food: "Eggs and toast",
      calories: 400,
      mealType: "breakfast",
      date: new Date(yesterday).toISOString(),
      method: "manual" as const
    };
    
    const yesterdayLunch = {
      food: "Turkey sandwich",
      calories: 500,
      mealType: "lunch",
      date: new Date(yesterday).toISOString(),
      method: "manual" as const
    };
    
    // Add all meals
    await addMeal(breakfast);
    await addMeal(lunch);
    await addMeal(dinner);
    await addMeal(yesterdayBreakfast);
    await addMeal(yesterdayLunch);
    
    console.log('Sample meals added');
  } catch (error) {
    console.error('Error adding sample meals:', error);
  }
};

export default {
  firestore,
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  getMealsForDate,
  getStreakData,
  updateStreakData,
  isOnline,
  syncOfflineData,
  addSampleMeals
};