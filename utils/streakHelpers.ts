import { getStreakData, updateStreakData, getMealsForDate } from '../firebase';

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
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  return diffMs <= oneDayMs && !isSameDay(date1, date2);
};

// Update streak when a meal is logged
export const updateStreak = async (): Promise<{
  currentStreak: number;
  longestStreak: number;
}> => {
  try {
    const today = new Date();
    const streakData = await getStreakData();
    
    console.log('Current streak data:', streakData);
    
    // If no last log date, this is the first meal
    if (!streakData.lastLogDate) {
      console.log('First meal ever logged, starting streak at 1');
      const newStreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastLogDate: today.toISOString()
      };
      await updateStreakData(newStreakData);
      return {
        currentStreak: 1,
        longestStreak: 1
      };
    }
    
    const lastLogDate = new Date(streakData.lastLogDate);
    
    // If already logged today, streak doesn't change
    if (isSameDay(today, lastLogDate)) {
      console.log('Already logged a meal today, streak remains at', streakData.currentStreak);
      return {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak
      };
    }
    
    // If consecutive day, increment streak
    if (isConsecutiveDay(today, lastLogDate)) {
      const currentStreak = streakData.currentStreak + 1;
      const longestStreak = Math.max(currentStreak, streakData.longestStreak);
      
      console.log('Consecutive day logged, streak increased to', currentStreak);
      
      await updateStreakData({
        currentStreak,
        longestStreak,
        lastLogDate: today.toISOString()
      });
      
      return {
        currentStreak,
        longestStreak
      };
    }
    
    // If not consecutive, reset streak
    console.log('Non-consecutive day, resetting streak to 1');
    
    await updateStreakData({
      currentStreak: 1,
      longestStreak: streakData.longestStreak,
      lastLogDate: today.toISOString()
    });
    
    return {
      currentStreak: 1,
      longestStreak: streakData.longestStreak
    };
  } catch (error) {
    console.error('Error updating streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0
    };
  }
};

// Check if streak is broken and update accordingly
export const checkAndUpdateStreak = async (): Promise<void> => {
  try {
    const streakData = await getStreakData();
    
    // If no streak data, nothing to check
    if (!streakData.lastLogDate) {
      return;
    }
    
    const today = new Date();
    const lastLogDate = new Date(streakData.lastLogDate);
    const daysSinceLastLog = Math.floor(
      (today.getTime() - lastLogDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    
    console.log('Days since last log:', daysSinceLastLog);
    
    // If more than 1 day has passed, reset streak
    if (daysSinceLastLog > 1) {
      console.log('Streak broken, resetting to 0');
      await updateStreakData({
        currentStreak: 0,
        longestStreak: streakData.longestStreak,
        lastLogDate: null
      });
    }
  } catch (error) {
    console.error('Error checking streak:', error);
  }
};

export default {
  updateStreak,
  checkAndUpdateStreak
};