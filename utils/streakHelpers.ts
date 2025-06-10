import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStreakData, updateStreakData } from '@/firebase';

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if two dates are consecutive days
const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  
  // Check if the difference is approximately one day
  // We use a range to account for daylight saving time changes
  return diffTime >= oneDayInMs - 1000 && diffTime <= oneDayInMs + 1000;
};

// Update streak when a meal is logged
export const updateStreak = async (): Promise<void> => {
  try {
    // Get current streak data
    const streakData = await getStreakData();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If this is the first log ever
    if (!streakData.lastLogDate) {
      const newStreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastLogDate: today.toISOString()
      };
      
      await updateStreakData(newStreakData);
      await AsyncStorage.setItem('streak-data', JSON.stringify(newStreakData));
      return;
    }
    
    const lastLogDate = new Date(streakData.lastLogDate);
    lastLogDate.setHours(0, 0, 0, 0);
    
    // If already logged today, no change to streak
    if (isSameDay(today, lastLogDate)) {
      return;
    }
    
    // If logged yesterday, increment streak
    if (isConsecutiveDay(lastLogDate, today)) {
      const newCurrentStreak = streakData.currentStreak + 1;
      const newLongestStreak = Math.max(newCurrentStreak, streakData.longestStreak);
      
      const newStreakData = {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastLogDate: today.toISOString()
      };
      
      await updateStreakData(newStreakData);
      await AsyncStorage.setItem('streak-data', JSON.stringify(newStreakData));
      return;
    }
    
    // If more than one day gap, reset streak to 1
    const newStreakData = {
      currentStreak: 1,
      longestStreak: Math.max(1, streakData.longestStreak),
      lastLogDate: today.toISOString()
    };
    
    await updateStreakData(newStreakData);
    await AsyncStorage.setItem('streak-data', JSON.stringify(newStreakData));
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

export default {
  updateStreak
};