// App color scheme
const lightColors = {
  primary: '#4A6FA5', // Soft blue
  secondary: '#9BC1BC', // Soft teal
  accent: '#F4B942', // Warm yellow
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#333333',
  subtext: '#6C757D',
  border: '#E9ECEF',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  lightGray: '#E0E0E0',
  mediumGray: '#9E9E9E',
  darkGray: '#616161',
  
  // Meal types
  mealTypes: {
    breakfast: '#FF9E80', // Soft orange
    lunch: '#FFD180', // Light amber
    dinner: '#B388FF', // Soft purple
    snack: '#80D8FF', // Light blue
  },
  goalMet: '#CCFF90', // Light green
  goalNotMet: '#FF8A80', // Light red
  
  // Macros
  macros: {
    protein: '#FF5252', // Red
    carbs: '#448AFF', // Blue
    fat: '#FFAB40', // Orange
  }
};

const darkColors = {
  primary: '#5B7DB1', // Lighter blue for dark mode
  secondary: '#7EADA8', // Lighter teal for dark mode
  accent: '#FFD166', // Brighter yellow for dark mode
  background: '#121212', // Dark background
  card: '#1E1E1E', // Dark card
  text: '#E0E0E0', // Light text
  subtext: '#9E9E9E', // Medium gray text
  border: '#333333', // Dark border
  success: '#66BB6A', // Lighter green
  error: '#EF5350', // Lighter red
  warning: '#FFA726', // Lighter orange
  info: '#42A5F5', // Lighter blue
  lightGray: '#424242', // Darker light gray
  mediumGray: '#757575', // Darker medium gray
  darkGray: '#9E9E9E', // Darker dark gray
  
  // Meal types (slightly brighter for dark mode)
  mealTypes: {
    breakfast: '#FF9E80', // Keep same
    lunch: '#FFD180', // Keep same
    dinner: '#B388FF', // Keep same
    snack: '#80D8FF', // Keep same
  },
  goalMet: '#CCFF90', // Keep same
  goalNotMet: '#FF8A80', // Keep same
  
  // Macros (slightly brighter for dark mode)
  macros: {
    protein: '#FF5252', // Red
    carbs: '#448AFF', // Blue
    fat: '#FFAB40', // Orange
  }
};

// Export colors based on theme
export default {
  light: lightColors,
  dark: darkColors,
  // Default export for backward compatibility
  ...lightColors
};