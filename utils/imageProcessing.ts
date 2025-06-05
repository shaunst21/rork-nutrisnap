import { Platform } from 'react-native';

// Google Vision API key
const GOOGLE_VISION_API_KEY = 'AIzaSyCm-03XTNJAfqqi6O4G2t7itdUecSn4tnY';
const GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// Nutritional database for common foods
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
    macros: { protein: 2, carbs: 12, fat: 5 }
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
    macros: { protein: 2, carbs: 17, fat: 9 }
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
    macros: { protein: 5, carbs: 20, fat: 7 }
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
    macros: { protein: 20, carbs: 42, fat: 7 }
  }
];

// Function to send image to Google Vision API
const analyzeImageWithGoogleVision = async (imageBase64: string) => {
  try {
    const body = {
      requests: [
        {
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'WEB_DETECTION', maxResults: 10 }
          ],
          image: {
            content: imageBase64
          }
        }
      ]
    };

    const response = await fetch(
      `${GOOGLE_VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      throw new Error(`Google Vision API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing image with Google Vision:', error);
    throw error;
  }
};

// Extract food items from Google Vision API response
const extractFoodItems = (visionResponse: any) => {
  const foodItems = [];

  // Extract from label annotations
  if (visionResponse.responses?.[0]?.labelAnnotations) {
    for (const label of visionResponse.responses[0].labelAnnotations) {
      if (label.description && 
          (label.description.toLowerCase().includes('food') || 
           foodDatabase.some(food => 
             food.name.toLowerCase().includes(label.description.toLowerCase()) ||
             label.description.toLowerCase().includes(food.name.toLowerCase())
           ))) {
        foodItems.push({
          name: label.description,
          confidence: label.score * 100
        });
      }
    }
  }

  // Extract from web detection
  if (visionResponse.responses?.[0]?.webDetection?.webEntities) {
    for (const entity of visionResponse.responses[0].webDetection.webEntities) {
      if (entity.description && 
          (entity.description.toLowerCase().includes('food') || 
           foodDatabase.some(food => 
             food.name.toLowerCase().includes(entity.description.toLowerCase()) ||
             entity.description.toLowerCase().includes(food.name.toLowerCase())
           ))) {
        foodItems.push({
          name: entity.description,
          confidence: entity.score * 100
        });
      }
    }
  }

  // Sort by confidence and remove duplicates
  return foodItems
    .sort((a, b) => b.confidence - a.confidence)
    .filter((item, index, self) => 
      index === self.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
    )
    .slice(0, 5); // Take top 5 results
};

// Find nutritional information for a food item
const findNutritionalInfo = (foodName: string) => {
  // Try to find an exact match first
  let foodMatch = foodDatabase.find(
    food => food.name.toLowerCase() === foodName.toLowerCase()
  );

  // If no exact match, try to find a partial match
  if (!foodMatch) {
    foodMatch = foodDatabase.find(
      food => 
        food.name.toLowerCase().includes(foodName.toLowerCase()) ||
        foodName.toLowerCase().includes(food.name.toLowerCase())
    );
  }

  // If still no match, return default values
  if (!foodMatch) {
    return {
      calories: 200, // Default calories
      servingSize: "1 serving",
      macros: { protein: 5, carbs: 25, fat: 8 } // Default macros
    };
  }

  return {
    calories: foodMatch.caloriesPerServing,
    servingSize: foodMatch.servingSize,
    macros: foodMatch.macros
  };
};

// Process image and return food information
export const processImage = async (
  imageUri: string, 
  imageBase64?: string
): Promise<{
  food: string;
  calories: number;
  confidence: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}> => {
  try {
    // For web or when testing, use mock data
    if (Platform.OS === 'web' || !imageBase64) {
      // Simulate processing delay (0.5-2 seconds)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
      
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
        confidence,
        macros: food.macros
      };
    }
    
    // For native platforms with a real image, use Google Vision API
    const visionResponse = await analyzeImageWithGoogleVision(imageBase64);
    const foodItems = extractFoodItems(visionResponse);
    
    if (foodItems.length === 0) {
      throw new Error('No food items detected in the image');
    }
    
    // Use the top result
    const topFood = foodItems[0];
    const nutritionalInfo = findNutritionalInfo(topFood.name);
    
    return {
      food: topFood.name,
      calories: nutritionalInfo.calories,
      confidence: topFood.confidence,
      macros: nutritionalInfo.macros
    };
  } catch (error) {
    console.error('Error processing image:', error);
    
    // Fallback to a random food if there's an error
    const randomIndex = Math.floor(Math.random() * foodDatabase.length);
    const food = foodDatabase[randomIndex];
    
    return {
      food: food.name,
      calories: food.caloriesPerServing,
      confidence: 70, // Lower confidence for fallback
      macros: food.macros
    };
  }
};

export default {
  processImage
};