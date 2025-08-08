import { Platform } from 'react-native';

// Google Vision API configuration
const GOOGLE_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || 'your_google_vision_api_key_here';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

interface VisionAPIResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{ x: number; y: number }>;
      };
    }>;
    error?: {
      code: number;
      message: string;
    };
  }>;
}

interface FoodAnalysisResult {
  foodItems: string[];
  confidence: number;
  rawText: string;
}

// Analyze image for food content using Google Vision API
export const analyzeImageForFood = async (imageBase64: string): Promise<FoodAnalysisResult> => {
  try {
    if (GOOGLE_VISION_API_KEY === 'your_google_vision_api_key_here') {
      // Fallback mock response for development
      console.log('Using mock Vision API response - configure your API key');
      return {
        foodItems: ['Apple', 'Banana', 'Sandwich'],
        confidence: 0.85,
        rawText: 'Mock food detection result'
      };
    }

    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '') // Remove data URL prefix if present
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 10
            },
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            }
          ]
        }
      ]
    };

    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Vision API request failed: ${response.status} ${response.statusText}`);
    }

    const data: VisionAPIResponse = await response.json();
    
    if (data.responses[0]?.error) {
      throw new Error(`Vision API error: ${data.responses[0].error.message}`);
    }

    // Extract text from the response
    const textAnnotations = data.responses[0]?.textAnnotations || [];
    const rawText = textAnnotations.length > 0 ? textAnnotations[0].description : '';

    // Simple food detection logic - you can enhance this
    const foodKeywords = [
      'apple', 'banana', 'orange', 'sandwich', 'pizza', 'burger', 'salad',
      'chicken', 'beef', 'fish', 'rice', 'pasta', 'bread', 'cheese',
      'tomato', 'lettuce', 'onion', 'potato', 'carrot', 'broccoli',
      'milk', 'yogurt', 'egg', 'bacon', 'ham', 'turkey', 'tuna',
      'cookie', 'cake', 'chocolate', 'ice cream', 'fruit', 'vegetable'
    ];

    const detectedFoods = foodKeywords.filter(keyword => 
      rawText.toLowerCase().includes(keyword)
    );

    // Calculate confidence based on number of food items detected
    const confidence = Math.min(detectedFoods.length * 0.2 + 0.3, 0.95);

    return {
      foodItems: detectedFoods.length > 0 ? detectedFoods : ['Unknown Food Item'],
      confidence,
      rawText
    };

  } catch (error) {
    console.error('Error analyzing image with Vision API:', error);
    
    // Fallback response
    return {
      foodItems: ['Unknown Food Item'],
      confidence: 0.1,
      rawText: 'Error occurred during analysis'
    };
  }
};

// Enhanced food analysis using AI for better food recognition
export const analyzeImageWithAI = async (imageBase64: string): Promise<FoodAnalysisResult> => {
  try {
    // First try Google Vision API
    const visionResult = await analyzeImageForFood(imageBase64);
    
    // If Vision API found food items, enhance with AI analysis
    if (visionResult.foodItems.length > 0 && visionResult.foodItems[0] !== 'Unknown Food Item') {
      try {
        const aiResponse = await fetch('https://toolkit.rork.com/text/llm/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are a food recognition expert. Analyze the provided text from image recognition and identify specific food items with their estimated quantities. Return only a JSON object with foodItems array and confidence score.'
              },
              {
                role: 'user',
                content: `Analyze this text from food image recognition and identify specific food items: "${visionResult.rawText}". Detected keywords: ${visionResult.foodItems.join(', ')}. Return JSON format: {"foodItems": ["item1", "item2"], "confidence": 0.8}`
              }
            ]
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          try {
            const aiResult = JSON.parse(aiData.completion);
            return {
              foodItems: aiResult.foodItems || visionResult.foodItems,
              confidence: aiResult.confidence || visionResult.confidence,
              rawText: visionResult.rawText
            };
          } catch (parseError) {
            console.log('AI response parsing failed, using Vision API result');
          }
        }
      } catch (aiError) {
        console.log('AI enhancement failed, using Vision API result');
      }
    }
    
    return visionResult;
  } catch (error) {
    console.error('Error in enhanced food analysis:', error);
    return {
      foodItems: ['Unknown Food Item'],
      confidence: 0.1,
      rawText: 'Analysis failed'
    };
  }
};

export default {
  analyzeImageForFood,
  analyzeImageWithAI
};