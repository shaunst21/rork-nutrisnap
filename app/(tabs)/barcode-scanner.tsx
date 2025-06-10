import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { 
  ArrowLeft, 
  Maximize, 
  Lock, 
  Zap, 
  Database,
  Scan
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import PremiumFeatureModal from '@/components/PremiumFeatureModal';

export default function BarcodeScannerScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const hasBarcodeFeature = hasFeature('barcode_scanning');
  
  useEffect(() => {
    if (!hasBarcodeFeature) {
      setShowPremiumModal(true);
    }
  }, [hasBarcodeFeature]);
  
  const handleBarcodeScan = (data: string) => {
    if (!hasBarcodeFeature) {
      setShowPremiumModal(true);
      return;
    }
    
    setScanning(true);
    
    // Simulate barcode lookup
    setTimeout(() => {
      setScanning(false);
      
      // In a real app, this would look up the barcode in a database
      Alert.alert(
        'Product Found',
        `Scanned barcode: ${data}\n\nProduct: Organic Greek Yogurt\nCalories: 120\nProtein: 15g\nCarbs: 8g\nFat: 3g`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add to Log', 
            onPress: () => {
              Alert.alert('Success', 'Food added to your log');
              router.back();
            }
          }
        ]
      );
    }, 1500);
  };
  
  if (!permission) {
    return <View />;
  }
  
  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>Barcode Scanner</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.permissionContainer}>
          <Scan size={64} color={Colors.primary} />
          <Text style={[styles.permissionTitle, { color: Colors.text }]}>
            Camera Permission Required
          </Text>
          <Text style={[styles.permissionText, { color: Colors.subtext }]}>
            We need camera permission to scan barcodes. Your camera is only used while you're on this screen.
          </Text>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: Colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (!hasBarcodeFeature) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>Barcode Scanner</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Plus Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            Barcode scanning is available for Premium Plus subscribers. Upgrade to scan product barcodes for instant nutrition information.
          </Text>
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/premium')}
          >
            <Text style={styles.upgradeButtonText}>View Premium Plans</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featurePreview}>
          <Text style={[styles.previewTitle, { color: Colors.text }]}>
            With Barcode Scanning You Can:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Maximize size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Instantly scan product barcodes
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Zap size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Get accurate nutrition information
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Database size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Access our database of over 1 million products
              </Text>
            </View>
          </View>
        </View>
        
        <PremiumFeatureModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Barcode Scanner"
          description="Scan product barcodes for instant nutrition information. Access our database of over 1 million products."
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanning ? undefined : (result) => handleBarcodeScan(result.data)}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.cameraHeaderTitle}>Barcode Scanner</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame}>
            {scanning && (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.scanningText}>Searching product...</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.instructionText}>
            Position barcode within the frame
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeholder: {
    width: 40,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  premiumCard: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  featurePreview: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  previewFeatures: {
    marginTop: 8,
  },
  previewFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewFeatureText: {
    fontSize: 16,
    marginLeft: 12,
  },
});