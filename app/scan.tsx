import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X, Zap } from 'lucide-react-native';
import { processImage } from '@/utils/imageProcessing';
import FoodConfirmation from '@/components/FoodConfirmation';
import { useMealStore } from '@/store/mealStore';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ScanScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [detectedFood, setDetectedFood] = useState({
    food: '',
    calories: 0,
    confidence: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });
  
  const { addMeal } = useMealStore();
  
  useEffect(() => {
    requestPermission();
  }, []);
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  const takePicture = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, we would use the camera to take a picture
      // Since we can't actually take a picture in this mock, we'll simulate it
      const mockImageUri = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
      
      // Process the image
      const result = await processImage(mockImageUri);
      
      setDetectedFood({
        food: result.food,
        calories: result.calories,
        confidence: result.confidence,
        macros: result.macros
      });
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to process food image');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const pickImage = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process the selected image
        const imageUri = result.assets[0].uri;
        const foodResult = await processImage(imageUri);
        
        setDetectedFood({
          food: foodResult.food,
          calories: foodResult.calories,
          confidence: foodResult.confidence,
          macros: foodResult.macros
        });
        
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to process food image');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirm = async (
    food: string, 
    calories: number, 
    mealType: string, 
    notes: string,
    macros: { protein: number; carbs: number; fat: number; }
  ) => {
    try {
      await addMeal({
        food,
        calories,
        method: 'scan',
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        notes: notes || undefined,
        macros
      });
      
      setShowConfirmation(false);
      router.back();
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save meal');
    }
  };
  
  const handleCancel = () => {
    setShowConfirmation(false);
  };
  
  if (!permission?.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: Colors.background }]}>
        <Text style={[styles.permissionText, { color: Colors.text }]}>
          We need camera permission to scan your food
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
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Camera size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.topRight]} />
            <View style={[styles.scanCorner, styles.bottomLeft]} />
            <View style={[styles.scanCorner, styles.bottomRight]} />
            
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <Zap size={32} color="#FFFFFF" />
                <Text style={styles.processingText}>Analyzing food...</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.instructionText}>
            Position your food in the frame and tap the button to scan
          </Text>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={pickImage}
              disabled={isProcessing}
            >
              <ImageIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.disabledButton]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
      
      {Platform.OS !== 'web' && (
        <Modal
          visible={showConfirmation}
          transparent
          animationType="fade"
        >
          <FoodConfirmation
            food={detectedFood.food}
            calories={detectedFood.calories}
            confidence={detectedFood.confidence}
            macros={detectedFood.macros}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </Modal>
      )}
      
      {Platform.OS === 'web' && showConfirmation && (
        <View style={styles.webConfirmationOverlay}>
          <FoodConfirmation
            food={detectedFood.food}
            calories={detectedFood.calories}
            confidence={detectedFood.confidence}
            macros={detectedFood.macros}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFFFFF',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: 0,
    left: 0,
  },
  topRight: {
    right: 0,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    top: undefined,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: undefined,
    left: undefined,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  processingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  instructionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal: 32,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  placeholder: {
    width: 50,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
  webConfirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});