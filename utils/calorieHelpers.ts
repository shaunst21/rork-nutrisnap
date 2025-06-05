import { getMeals } from '../firebase';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  getDaysOfWeek
} from './dateHelpers';

// Default macros object to prevent undefined errors
const defaultMacros = {
  protein: 0,
  carbs: 0,
  fat: 0
};

// Get total calories for a specific date
export const getCaloriesForDate = async (date: string): Promise<number> => {
  try {
    const dateObj = new Date(date);
    const start = startOfDay(dateObj);
    const end = endOfDay(dateObj);
    
    const meals = await getMeals();
    
    // Filter meals for the specific date
    const mealsForDate = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
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
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    
    const meals = await getMeals();
    
    // Filter meals for the current week
    const mealsForWeek = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
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

// Get calories for each day of the current week
export const getCaloriesPerDayForWeek = async (): Promise<Array<{day: string, calories: number}>> => {
  try {
    const today = new Date();
    const start = startOfWeek(today);
    const days = getDaysOfWeek();
    
    const meals = await getMeals();
    
    // Initialize result array with 0 calories for each day
    const result = days.map(day => ({ day, calories: 0 }));
    
    // Calculate calories for each day
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(start);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Filter meals for this day
      const mealsForDay = meals.filter((meal: any) => {
        const mealDate = new Date(meal.date);
        return mealDate >= dayStart && mealDate <= dayEnd;
      });
      
      // Sum calories
      const calories = mealsForDay.reduce((total: number, meal: any) => {
        return total + (meal.calories || 0);
      }, 0);
      
      result[i].calories = calories;
    }
    
    return result;
  } catch (error) {
    console.error('Error getting calories per day for week:', error);
    return getDaysOfWeek().map(day => ({ day, calories: 0 }));
  }
};

// Get total calories for the current month
export const getCaloriesForMonth = async (): Promise<number> => {
  try {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    const meals = await getMeals();
    
    // Filter meals for the current month
    const mealsForMonth = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
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

// Get calories by meal type for today
export const getCaloriesByMealType = async (): Promise<{
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  other: number;
}> => {
  try {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    
    const meals = await getMeals();
    
    // Filter meals for today
    const mealsForToday = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
    
    // Initialize result
    const result = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
      other: 0
    };
    
    // Sum calories by meal type
    mealsForToday.forEach((meal: any) => {
      const calories = meal.calories || 0;
      
      if (meal.mealType === 'breakfast') {
        result.breakfast += calories;
      } else if (meal.mealType === 'lunch') {
        result.lunch += calories;
      } else if (meal.mealType === 'dinner') {
        result.dinner += calories;
      } else if (meal.mealType === 'snack') {
        result.snack += calories;
      } else {
        result.other += calories;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting calories by meal type:', error);
    return {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
      other: 0
    };
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

// Get macros for a specific date
export const getMacrosForDate = async (date: string): Promise<{
  protein: number;
  carbs: number;
  fat: number;
}> => {
  try {
    const dateObj = new Date(date);
    const start = startOfDay(dateObj);
    const end = endOfDay(dateObj);
    
    const meals = await getMeals();
    
    // Filter meals for the specific date
    const mealsForDate = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
    
    // Sum macros
    const result = { ...defaultMacros };
    
    mealsForDate.forEach((meal: any) => {
      if (meal.macros) {
        result.protein += meal.macros.protein ?? 0;
        result.carbs += meal.macros.carbs ?? 0;
        result.fat += meal.macros.fat ?? 0;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting macros for date:', error);
    return { ...defaultMacros };
  }
};

// Get macros for the current week
export const getMacrosForWeek = async (): Promise<{
  protein: number;
  carbs: number;
  fat: number;
}> => {
  try {
    const today = new Date();
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    
    const meals = await getMeals();
    
    // Filter meals for the current week
    const mealsForWeek = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
    
    // Sum macros
    const result = { ...defaultMacros };
    
    mealsForWeek.forEach((meal: any) => {
      if (meal.macros) {
        result.protein += meal.macros.protein ?? 0;
        result.carbs += meal.macros.carbs ?? 0;
        result.fat += meal.macros.fat ?? 0;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting macros for week:', error);
    return { ...defaultMacros };
  }
};

// Get macros for the current month
export const getMacrosForMonth = async (): Promise<{
  protein: number;
  carbs: number;
  fat: number;
}> => {
  try {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    const meals = await getMeals();
    
    // Filter meals for the current month
    const mealsForMonth = meals.filter((meal: any) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
    
    // Sum macros
    const result = { ...defaultMacros };
    
    mealsForMonth.forEach((meal: any) => {
      if (meal.macros) {
        result.protein += meal.macros.protein ?? 0;
        result.carbs += meal.macros.carbs ?? 0;
        result.fat += meal.macros.fat ?? 0;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting macros for month:', error);
    return { ...defaultMacros };
  }
};

export default {
  getCaloriesForDate,
  getCaloriesForWeek,
  getCaloriesPerDayForWeek,
  getCaloriesForMonth,
  getMostCommonFoods,
  getCaloriesByMealType,
  getAverageDailyCalories,
  getMacrosForDate,
  getMacrosForWeek,
  getMacrosForMonth
};