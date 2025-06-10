import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';
import { useMealStore } from '@/store/mealStore';
import FoodConfirmation from '@/components/FoodConfirmation';
import { processImage } from '@/utils/imageProcessing';
import { useThemeColors } from '@/hooks/useThemeColors';

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
    macros?: {
      protein: number;
      carbs: number;
      fat: number;
    };
  } | null>(null);
  
  const cameraRef = useRef<any>(null);
  const { addMeal } = useMealStore();
  
  // Request permission if not granted
  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
      // If we can't ask again, we need to show instructions to enable camera in settings
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in your device settings to use this feature.",
        [{ text: "OK" }]
      );
    }
  }, [permission]);
  
  const handleCapture = async () => {
    if (isCapturing || isProcessing || !cameraRef.current) return;
    
    setIsCapturing(true);
    
    try {
      if (Platform.OS === 'web') {
        // For web, we'll use a mock image since camera capture is limited on web
        setIsProcessing(true);
        const mockImageUri = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80';
        setCapturedImage(mockImageUri);
        
        // Process the image to detect food
        const result = await processImage(mockImageUri);
        setDetectedFood(result);
      } else {
        // For native platforms, capture an actual photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
          exif: false
        });
        
        setCapturedImage(photo.uri);
        setIsProcessing(true);
        
        // Process the image to detect food
        const result = await processImage(photo.uri, photo.base64);
        setDetectedFood(result);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture or process image. Please try again.');
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };
  
  const handleConfirm = async (
    food: string, 
    calories: number, 
    mealType: string, 
    notes: string,
    macros?: { protein: number; carbs: number; fat: number; }
  ) => {
    try {
      await addMeal({
        name: food,
        calories,
        method: 'scan',
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        notes: notes || undefined,
        imageUri: capturedImage || undefined,
        protein: macros?.protein || 0,
        carbs: macros?.carbs || 0,
        fat: macros?.fat || 0
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
          <Text style={[styles.permissionButtonText, { color: '#FFFFFF' }]}>Grant Permission</Text>
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
          macros={detectedFood.macros}
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
                <ImageIcon size={24} color="#FFFFFF" />
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
    marginTop: 100,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});