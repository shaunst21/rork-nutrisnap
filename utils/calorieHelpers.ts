import { getMeals } from '../firebase';

// Get total calories for a specific date
export const getCaloriesForDate = async (date: string): Promise<number> => {
  try {
    // Get start and end of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const meals = await getMeals();
    
    // Filter meals for the specific date
    const mealsForDate = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= startDate && mealDate <= endDate;
    });
    
    // Sum calories
    return mealsForDate.reduce((total: number, meal: any) => {
      return total + (meal.calories || 0);
    }, 0);
  } catch (error) {
    console.error('Error getting calories for date:', error);
    return 0;
  }
};

// Get total calories for the current week
export const getCaloriesForWeek = async (): Promise<number> => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const meals = await getMeals();
    
    // Filter meals for the current week
    const mealsForWeek = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= startOfWeek && mealDate <= today;
    });
    
    // Sum calories
    return mealsForWeek.reduce((total: number, meal: any) => {
      return total + (meal.calories || 0);
    }, 0);
  } catch (error) {
    console.error('Error getting calories for week:', error);
    return 0;
  }
};

// Get total calories for the current month
export const getCaloriesForMonth = async (): Promise<number> => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const meals = await getMeals();
    
    // Filter meals for the current month
    const mealsForMonth = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= startOfMonth && mealDate <= today;
    });
    
    // Sum calories
    return mealsForMonth.reduce((total: number, meal: any) => {
      return total + (meal.calories || 0);
    }, 0);
  } catch (error) {
    console.error('Error getting calories for month:', error);
    return 0;
  }
};

// Get most common foods
export const getMostCommonFoods = async (limit: number = 5): Promise<Array<{food: string, count: number}>> => {
  try {
    const meals = await getMeals();
    
    // Count occurrences of each food
    const foodCounts: {[key: string]: number} = {};
    
    meals.forEach((meal: any) => {
      if (meal.food) {
        foodCounts[meal.food] = (foodCounts[meal.food] || 0) + 1;
      }
    });
    
    // Convert to array and sort
    const sortedFoods = Object.entries(foodCounts)
      .map(([food, count]) => ({ food, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return sortedFoods;
  } catch (error) {
    console.error('Error getting most common foods:', error);
    return [];
  }
};

// Calculate average daily calories
export const getAverageDailyCalories = async (): Promise<number> => {
  try {
    const meals = await getMeals();
    
    if (meals.length === 0) {
      return 0;
    }
    
    // Group meals by date
    const mealsByDate: {[key: string]: Array<any>} = {};
    
    meals.forEach((meal: any) => {
      const date = new Date(meal.date).toDateString();
      if (!mealsByDate[date]) {
        mealsByDate[date] = [];
      }
      mealsByDate[date].push(meal);
    });
    
    // Calculate total calories for each date
    const dailyCalories = Object.values(mealsByDate).map(dateMeals => {
      return dateMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
    });
    
    // Calculate average
    const totalCalories = dailyCalories.reduce((sum, calories) => sum + calories, 0);
    return Math.round(totalCalories / dailyCalories.length);
  } catch (error) {
    console.error('Error calculating average daily calories:', error);
    return 0;
  }
};

export default {
  getCaloriesForDate,
  getCaloriesForWeek,
  getCaloriesForMonth,
  getMostCommonFoods,
  getAverageDailyCalories
};