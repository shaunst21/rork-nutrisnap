import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Meal } from '@/types';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAk4rzM_FaTE6HzmjLQIDttga0PTkn6LRM",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "calorielens-e05c7.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "calorielens-e05c7",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "calorielens-e05c7.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "130019186099",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:130019186099:web:31d7c31061e8271b8d27c6"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Fallback to mock implementation if Firebase is not configured
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

// Create Firebase instance (use real Firebase with provided credentials)
const firestore = null; // We'll use real Firebase now
const useMockFirestore = false;

// Helper functions for common operations
export const getMeals = async (): Promise<Meal[]> => {
  if (useMockFirestore) {
    return await firestore!.getCollection('users/CalorieLens/meals');
  }
  
  try {
    const mealsRef = collection(db, 'meals');
    const snapshot = await getDocs(query(mealsRef, orderBy('date', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
  } catch (error) {
    console.error('Error getting meals from Firebase:', error);
    return [];
  }
};

export const addMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
  if (useMockFirestore) {
    return await firestore!.addDocument('users/CalorieLens/meals', mealData);
  }
  
  try {
    const mealsRef = collection(db, 'meals');
    const docRef = await addDoc(mealsRef, {
      ...mealData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...mealData } as Meal;
  } catch (error) {
    console.error('Error adding meal to Firebase:', error);
    throw error;
  }
};

export const updateMeal = async (id: string, mealData: Partial<Meal>): Promise<Meal> => {
  if (useMockFirestore) {
    return await firestore!.updateDocument('users/CalorieLens/meals', id, mealData);
  }
  
  try {
    const mealRef = doc(db, 'meals', id);
    await updateDoc(mealRef, {
      ...mealData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...mealData } as Meal;
  } catch (error) {
    console.error('Error updating meal in Firebase:', error);
    throw error;
  }
};

export const deleteMeal = async (id: string): Promise<boolean> => {
  if (useMockFirestore) {
    return await firestore!.deleteDocument('users/CalorieLens/meals', id);
  }
  
  try {
    const mealRef = doc(db, 'meals', id);
    await deleteDoc(mealRef);
    return true;
  } catch (error) {
    console.error('Error deleting meal from Firebase:', error);
    return false;
  }
};

export const getMealsForDate = async (date: string): Promise<Meal[]> => {
  // Get start and end of day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  if (useMockFirestore) {
    return await firestore!.query('users/CalorieLens/meals', [
      { field: 'date', operator: '>=', value: startDate.toISOString() },
      { field: 'date', operator: '<=', value: endDate.toISOString() }
    ]);
  }
  
  try {
    const mealsRef = collection(db, 'meals');
    const q = query(
      mealsRef,
      where('date', '>=', startDate.toISOString()),
      where('date', '<=', endDate.toISOString()),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
  } catch (error) {
    console.error('Error getting meals for date from Firebase:', error);
    return [];
  }
};

export const getStreakData = async () => {
  try {
    const data = await AsyncStorage.getItem('streak-data');
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

export const updateStreakData = async (streakData: any) => {
  try {
    await AsyncStorage.setItem('streak-data', JSON.stringify(streakData));
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