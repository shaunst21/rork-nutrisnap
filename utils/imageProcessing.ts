// Mock AI food recognition service
// In a real app, this would connect to Google Vision API or similar

// List of common foods with calorie estimates and macros
const foodDatabase = [
  { 
    name: "Pizza", 
    caloriesPerServing: 285, 
    servingSize: "1 slice",
    macros: { protein: 12, carbs: 36, fat: 10 }
  },
  { 
    name: "Hamburger", 
    caloriesPerServing: 354, 
    servingSize: "1 burger",
    macros: { protein: 20, carbs: 40, fat: 17 }
  },
  { 
    name: "Salad", 
    caloriesPerServing: 100, 
    servingSize: "1 cup",
    macros: { protein: 2, carbs: 5, fat: 7 }
  },
  { 
    name: "Pasta", 
    caloriesPerServing: 200, 
    servingSize: "1 cup",
    macros: { protein: 7, carbs: 40, fat: 1 }
  },
  { 
    name: "Steak", 
    caloriesPerServing: 350, 
    servingSize: "4 oz",
    macros: { protein: 35, carbs: 0, fat: 21 }
  },
  { 
    name: "Chicken", 
    caloriesPerServing: 165, 
    servingSize: "3 oz",
    macros: { protein: 31, carbs: 0, fat: 3.6 }
  },
  { 
    name: "Fish", 
    caloriesPerServing: 158, 
    servingSize: "3 oz",
    macros: { protein: 22, carbs: 0, fat: 7 }
  },
  { 
    name: "Rice", 
    caloriesPerServing: 206, 
    servingSize: "1 cup",
    macros: { protein: 4, carbs: 45, fat: 0.4 }
  },
  { 
    name: "Bread", 
    caloriesPerServing: 75, 
    servingSize: "1 slice",
    macros: { protein: 3, carbs: 13, fat: 1 }
  },
  { 
    name: "Apple", 
    caloriesPerServing: 95, 
    servingSize: "1 medium",
    macros: { protein: 0.5, carbs: 25, fat: 0.3 }
  },
  { 
    name: "Banana", 
    caloriesPerServing: 105, 
    servingSize: "1 medium",
    macros: { protein: 1.3, carbs: 27, fat: 0.4 }
  },
  { 
    name: "Orange", 
    caloriesPerServing: 62, 
    servingSize: "1 medium",
    macros: { protein: 1.2, carbs: 15, fat: 0.2 }
  },
  { 
    name: "Yogurt", 
    caloriesPerServing: 150, 
    servingSize: "1 cup",
    macros: { protein: 12, carbs: 17, fat: 3.8 }
  },
  { 
    name: "Ice Cream", 
    caloriesPerServing: 273, 
    servingSize: "1 cup",
    macros: { protein: 4.6, carbs: 31, fat: 14 }
  },
  { 
    name: "Chocolate", 
    caloriesPerServing: 155, 
    servingSize: "1 oz",
    macros: { protein: 2.2, carbs: 17, fat: 9 }
  },
  { 
    name: "Cereal", 
    caloriesPerServing: 120, 
    servingSize: "1 cup",
    macros: { protein: 3, carbs: 24, fat: 1 }
  },
  { 
    name: "Sandwich", 
    caloriesPerServing: 300, 
    servingSize: "1 sandwich",
    macros: { protein: 15, carbs: 35, fat: 10 }
  },
  { 
    name: "Soup", 
    caloriesPerServing: 168, 
    servingSize: "1 cup",
    macros: { protein: 5, carbs: 15, fat: 10 }
  },
  { 
    name: "Burrito", 
    caloriesPerServing: 380, 
    servingSize: "1 burrito",
    macros: { protein: 15, carbs: 50, fat: 12 }
  },
  { 
    name: "Sushi", 
    caloriesPerServing: 350, 
    servingSize: "6 pieces",
    macros: { protein: 9, carbs: 42, fat: 12 }
  }
];

// Simulate AI processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Process image and return food information
export const processImage = async (imageUri: string): Promise<{
  food: string;
  calories: number;
  servingSize: string;
  confidence: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}> => {
  try {
    // Simulate processing delay (0.5-2 seconds)
    await delay(Math.random() * 1500 + 500);
    
    // Randomly select a food from the database
    const randomIndex = Math.floor(Math.random() * foodDatabase.length);
    const food = foodDatabase[randomIndex];
    
    // Add some randomness to calories to simulate different portion sizes
    const calorieVariation = Math.random() * 0.3 + 0.85; // 85% to 115% of base calories
    const calories = Math.round(food.caloriesPerServing * calorieVariation);
    
    // Apply the same variation to macros
    const protein = Math.round(food.macros.protein * calorieVariation * 10) / 10;
    const carbs = Math.round(food.macros.carbs * calorieVariation * 10) / 10;
    const fat = Math.round(food.macros.fat * calorieVariation * 10) / 10;
    
    // Random confidence level (70-98%)
    const confidence = Math.round((Math.random() * 28 + 70) * 100) / 100;
    
    return {
      food: food.name,
      calories,
      servingSize: food.servingSize,
      confidence,
      macros: {
        protein,
        carbs,
        fat
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process food image');
  }
};

export default {
  processImage
};