import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ScanScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    // Reset the state when the component mounts
    setShowOptions(true);
  }, []);

  const handleManualEntry = () => {
    router.push('/manual-entry');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleTakePicture = async () => {
    // This would be implemented to take a picture and process it
    Alert.alert('Camera', 'This would take a picture and analyze the food');
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <Text style={[styles.message, { color: Colors.text }]}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <Text style={[styles.message, { color: Colors.text }]}>We need your permission to use the camera</Text>
        <TouchableOpacity 
          style={[styles.permissionButton, { backgroundColor: Colors.primary }]} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showOptions) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: Colors.text }]}>Add a Meal</Text>
          <Text style={[styles.subtitle, { color: Colors.subtext }]}>
            Track your nutrition by scanning food or adding it manually
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionCard, { backgroundColor: Colors.card }]} 
              onPress={() => setShowOptions(false)}
            >
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                <Camera size={32} color="#FFFFFF" />
              </View>
              <Text style={[styles.optionTitle, { color: Colors.text }]}>Scan Food</Text>
              <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
                Take a photo of your food and let AI identify it
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionCard, { backgroundColor: Colors.card }]} 
              onPress={handleManualEntry}
            >
              <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
                <Plus size={32} color="#FFFFFF" />
              </View>
              <Text style={[styles.optionTitle, { color: Colors.text }]}>Manual Entry</Text>
              <Text style={[styles.optionDescription, { color: Colors.subtext }]}>
                Enter food details manually for precise tracking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.cameraControls}>
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
            onPress={() => setShowOptions(true)}
          >
            <Text style={styles.cameraButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.captureButton, { borderColor: '#FFFFFF' }]} 
            onPress={handleTakePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
            onPress={toggleCameraFacing}
          >
            <Text style={styles.cameraButtonText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 24,
  },
  optionCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    margin: 24,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
});