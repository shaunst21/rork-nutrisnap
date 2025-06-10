import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreakData } from '@/types';

// Function to update streak when a meal is logged
export const updateStreak = async (): Promise<void> => {
  try {
    // Get current streak data
    const streakDataString = await AsyncStorage.getItem('streak-data');
    let streakData: StreakData = streakDataString 
      ? JSON.parse(streakDataString) 
      : { currentStreak: 0, longestStreak: 0, lastLogDate: null };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If this is the first log ever
    if (!streakData.lastLogDate) {
      streakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastLogDate: today.toISOString()
      };
    } else {
      const lastLogDate = new Date(streakData.lastLogDate);
      lastLogDate.setHours(0, 0, 0, 0);
      
      // Calculate the difference in days
      const diffTime = today.getTime() - lastLogDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // If logged today already, do nothing
      if (diffDays === 0) {
        // Already logged today, no change to streak
      } 
      // If logged yesterday, increment streak
      else if (diffDays === 1) {
        streakData.currentStreak += 1;
        streakData.lastLogDate = today.toISOString();
        
        // Update longest streak if needed
        if (streakData.currentStreak > streakData.longestStreak) {
          streakData.longestStreak = streakData.currentStreak;
        }
      } 
      // If missed a day or more, reset streak
      else {
        streakData.currentStreak = 1;
        streakData.lastLogDate = today.toISOString();
      }
    }
    
    // Save updated streak data
    await AsyncStorage.setItem('streak-data', JSON.stringify(streakData));
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

// Function to check if user has logged a meal today
export const hasLoggedToday = async (): Promise<boolean> => {
  try {
    const streakDataString = await AsyncStorage.getItem('streak-data');
    if (!streakDataString) return false;
    
    const streakData: StreakData = JSON.parse(streakDataString);
    if (!streakData.lastLogDate) return false;
    
    const lastLogDate = new Date(streakData.lastLogDate);
    lastLogDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return lastLogDate.getTime() === today.getTime();
  } catch (error) {
    console.error('Error checking if logged today:', error);
    return false;
  }
};

export default {
  updateStreak,
  hasLoggedToday
};