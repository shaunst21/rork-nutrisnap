import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Lock, X, Crown } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  featureName: string;
  description: string;
}

const PremiumFeatureModal = ({ 
  visible, 
  onClose, 
  featureName, 
  description 
}: PremiumFeatureModalProps) => {
  const Colors = useThemeColors();
  const router = useRouter();
  
  const handleViewPlans = () => {
    onClose();
    router.push('/premium');
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { backgroundColor: Colors.background }]}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
              
              <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
                  <Lock size={32} color="#FFFFFF" />
                </View>
                
                <Text style={[styles.title, { color: Colors.text }]}>Premium Feature</Text>
                
                <Text style={[styles.featureName, { color: Colors.primary }]}>
                  {featureName}
                </Text>
                
                <Text style={[styles.description, { color: Colors.subtext }]}>
                  {description}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.upgradeButton, { backgroundColor: Colors.primary }]}
                  onPress={handleViewPlans}
                >
                  <Crown size={20} color="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>View Premium Plans</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={onClose}>
                  <Text style={[styles.cancelText, { color: Colors.subtext }]}>
                    Maybe Later
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 16,
    padding: 8,
  },
});

export default PremiumFeatureModal;