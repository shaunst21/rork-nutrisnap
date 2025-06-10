import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { 
  Lock,
  BookOpen
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.comingSoonCard, { backgroundColor: Colors.card }]}>
        <BookOpen size={64} color={Colors.primary} />
        <Text style={[styles.comingSoonTitle, { color: Colors.text }]}>
          Coming Soon
        </Text>
        <Text style={[styles.comingSoonDescription, { color: Colors.subtext }]}>
          We're working on adding recipe features to the app. Stay tuned for updates!
        </Text>
        
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: Colors.primary }]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.backButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  comingSoonCard: {
    width: '100%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  }
});