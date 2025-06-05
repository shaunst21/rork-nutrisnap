import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MoreVertical, Crown, BookOpen, FileText, MessageSquare, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MoreMenuProps {
  showPremiumOption?: boolean;
}

export default function MoreMenu({ showPremiumOption = true }: MoreMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const Colors = useThemeColors();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false);
    router.push(route);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <MoreVertical size={24} color={Colors.text} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View 
            style={[
              styles.menuContainer, 
              { 
                backgroundColor: Colors.card,
                shadowColor: Colors.text,
                borderColor: Colors.border
              }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: Colors.text }]}>More Options</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {showPremiumOption && (
              <TouchableOpacity 
                style={[styles.menuItem, { borderBottomColor: Colors.border }]} 
                onPress={() => handleMenuItemPress('/premium')}
              >
                <Crown size={20} color={Colors.accent} />
                <Text style={[styles.menuItemText, { color: Colors.text }]}>Premium</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: Colors.border }]} 
              onPress={() => handleMenuItemPress('/recipes')}
            >
              <BookOpen size={20} color={Colors.primary} />
              <Text style={[styles.menuItemText, { color: Colors.text }]}>Recipes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: Colors.border }]} 
              onPress={() => handleMenuItemPress('/export-data')}
            >
              <FileText size={20} color={Colors.primary} />
              <Text style={[styles.menuItemText, { color: Colors.text }]}>Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem]} 
              onPress={() => handleMenuItemPress('/ai-coach')}
            >
              <MessageSquare size={20} color={Colors.primary} />
              <Text style={[styles.menuItemText, { color: Colors.text }]}>AI Coach</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});