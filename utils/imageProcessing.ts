// Mock AI food recognition service
// In a real app, this would connect to Google Vision API or similar

// List of common foods with calorie estimates
const foodDatabase = [
  { 
    name: "Pizza", 
    caloriesPerServing: 285, 
    servingSize: "1 slice"
  },
  { 
    name: "Hamburger", 
    caloriesPerServing: 354, 
    servingSize: "1 burger"
  },
  { 
    name: "Salad", 
    caloriesPerServing: 100, 
    servingSize: "1 cup"
  },
  { 
    name: "Pasta", 
    caloriesPerServing: 200, 
    servingSize: "1 cup"
  },
  { 
    name: "Steak", 
    caloriesPerServing: 350, 
    servingSize: "4 oz"
  },
  { 
    name: "Chicken", 
    caloriesPerServing: 165, 
    servingSize: "3 oz"
  },
  { 
    name: "Fish", 
    caloriesPerServing: 158, 
    servingSize: "3 oz"
  },
  { 
    name: "Rice", 
    caloriesPerServing: 206, 
    servingSize: "1 cup"
  },
  { 
    name: "Bread", 
    caloriesPerServing: 75, 
    servingSize: "1 slice"
  },
  { 
    name: "Apple", 
    caloriesPerServing: 95, 
    servingSize: "1 medium"
  },
  { 
    name: "Banana", 
    caloriesPerServing: 105, 
    servingSize: "1 medium"
  },
  { 
    name: "Orange", 
    caloriesPerServing: 62, 
    servingSize: "1 medium"
  },
  { 
    name: "Yogurt", 
    caloriesPerServing: 150, 
    servingSize: "1 cup"
  },
  { 
    name: "Ice Cream", 
    caloriesPerServing: 273, 
    servingSize: "1 cup"
  },
  { 
    name: "Chocolate", 
    caloriesPerServing: 155, 
    servingSize: "1 oz"
  },
  { 
    name: "Cereal", 
    caloriesPerServing: 120, 
    servingSize: "1 cup"
  },
  { 
    name: "Sandwich", 
    caloriesPerServing: 300, 
    servingSize: "1 sandwich"
  },
  { 
    name: "Soup", 
    caloriesPerServing: 168, 
    servingSize: "1 cup"
  },
  { 
    name: "Burrito", 
    caloriesPerServing: 380, 
    servingSize: "1 burrito"
  },
  { 
    name: "Sushi", 
    caloriesPerServing: 350, 
    servingSize: "6 pieces"
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
    
    // Random confidence level (70-98%)
    const confidence = Math.round((Math.random() * 28 + 70) * 100) / 100;
    
    return {
      food: food.name,
      calories,
      servingSize: food.servingSize,
      confidence
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process food image');
  }
};

export default {
  processImage
};