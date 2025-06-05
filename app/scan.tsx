import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, X, Image } from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import FoodConfirmation from '@/components/FoodConfirmation';
import { processImage } from '@/utils/imageProcessing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Platform } from 'react-native';

export default function ScanScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedFood, setDetectedFood] = useState<{
    food: string;
    calories: number;
    confidence: number;
  } | null>(null);
  
  const cameraRef = useRef<any>(null);
  const { addMeal } = useMealStore();
  
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);
  
  const handleCapture = async () => {
    if (isCapturing || isProcessing) return;
    
    setIsCapturing(true);
    
    try {
      // Simulate taking a photo since we can't actually capture in this environment
      setIsProcessing(true);
      setIsCapturing(false);
      
      // Mock image URI
      const mockImageUri = 'https://example.com/mock-food-image.jpg';
      setCapturedImage(mockImageUri);
      
      // Process the image to detect food
      const result = await processImage(mockImageUri);
      
      setDetectedFood({
        food: result.food,
        calories: result.calories,
        confidence: result.confidence
      });
      
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirm = async (
    food: string, 
    calories: number, 
    mealType: string, 
    notes: string
  ) => {
    try {
      await addMeal({
        food,
        calories,
        method: 'scan',
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        notes: notes || undefined,
        image: capturedImage || undefined
      });
      
      router.back();
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('Error', 'Failed to add meal');
    }
  };
  
  const handleCancel = () => {
    setCapturedImage(null);
    setDetectedFood(null);
  };
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <Text style={[styles.permissionText, { color: Colors.text }]}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity 
          style={[styles.permissionButton, { backgroundColor: Colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {detectedFood ? (
        <FoodConfirmation
          food={detectedFood.food}
          calories={detectedFood.calories}
          confidence={detectedFood.confidence}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: Colors.text }]}>Scan Food</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={cameraRef}
            >
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.processingText}>Analyzing food...</Text>
                </View>
              )}
              
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={[styles.flipButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
                  onPress={toggleCameraFacing}
                >
                  <Camera size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.captureButton, 
                { backgroundColor: Colors.primary },
                (isCapturing || isProcessing) && styles.disabledButton
              ]}
              onPress={handleCapture}
              disabled={isCapturing || isProcessing}
            >
              {isCapturing || isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Image size={24} color="#FFFFFF" />
              )}
              <Text style={styles.captureButtonText}>
                {isProcessing ? 'Processing...' : 'Capture Food'}
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.instructions, { color: Colors.subtext }]}>
              Position your camera so the food is clearly visible in the frame, then tap the button to capture.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    margin: 16,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 14,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});