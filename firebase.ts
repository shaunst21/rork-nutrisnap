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
  return await firestore.getCollection('users/CalorieLens/meals');
};

export const addMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
  return await firestore.addDocument('users/CalorieLens/meals', mealData);
};

export const updateMeal = async (id: string, mealData: Partial<Meal>): Promise<Meal> => {
  return await firestore.updateDocument('users/CalorieLens/meals', id, mealData);
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
    return data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null
    };
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
    return streakData;
  } catch (error) {
    console.error('Error updating streak data:', error);
    throw error;
  }
};

// Check if device is online
export const isOnline = (): boolean => {
  // In a real app, this would check network connectivity
  // For this mock, we'll assume online on iOS and offline on Android for testing
  return Platform.OS === 'ios';
};

// Sync offline data when back online
export const syncOfflineData = async (): Promise<void> => {
  try {
    const offlineData = await AsyncStorage.getItem('offline_meals');
    
    if (offlineData) {
      const meals = JSON.parse(offlineData);
      
      // In a real app, this would batch upload to Firebase
      for (const meal of meals) {
        await addMeal(meal);
      }
      
      // Clear offline data
      await AsyncStorage.removeItem('offline_meals');
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
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
  syncOfflineData
};