import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, Clock, Trash2, Coffee, Sun, Moon, Cookie } from 'lucide-react-native';
import { deleteMeal } from '@/firebase';
import { Meal } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MealCardProps {
  id: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  notes?: string;
  onDelete?: () => void;
}

const MealCard = ({ 
  id, 
  food, 
  calories, 
  date, 
  method, 
  mealType, 
  notes,
  onDelete 
}: MealCardProps) => {
  const Colors = useThemeColors();
  const formattedDate = new Date(date).toLocaleString();
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete ${food}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(id);
              if (onDelete) {
                onDelete();
              }
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('Error', 'Failed to delete meal');
            }
          }
        }
      ]
    );
  };
  
  // Get meal type icon
  const getMealTypeIcon = () => {
    if (!mealType) return null;
    
    const iconSize = 16;
    const iconColor = Colors.mealTypes[mealType];
    
    switch (mealType) {
      case 'breakfast':
        return <Coffee size={iconSize} color={iconColor} />;
      case 'lunch':
        return <Sun size={iconSize} color={iconColor} />;
      case 'dinner':
        return <Moon size={iconSize} color={iconColor} />;
      case 'snack':
        return <Cookie size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.card, { backgroundColor: Colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.foodName, { color: Colors.text }]}>{food}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.calories, { color: Colors.primary }]}>{calories} calories</Text>
      
      {notes && <Text style={[styles.notes, { color: Colors.subtext }]}>{notes}</Text>}
      
      <View style={styles.footer}>
        <View style={styles.methodContainer}>
          {method === 'scan' ? (
            <Camera size={16} color={Colors.primary} />
          ) : (
            <Text style={[styles.manualIcon, { color: Colors.primary }]}>M</Text>
          )}
          <Text style={[styles.methodText, { color: Colors.subtext }]}>
            {method === 'scan' ? 'Scanned' : 'Manual'}
          </Text>
        </View>
        
        {mealType && (
          <View style={styles.mealTypeContainer}>
            {getMealTypeIcon()}
            <Text style={[styles.mealTypeText, { color: Colors.mealTypes[mealType] }]}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>
          </View>
        )}
        
        <View style={styles.timeContainer}>
          <Clock size={16} color={Colors.subtext} />
          <Text style={[styles.timeText, { color: Colors.subtext }]}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  methodText: {
    fontSize: 14,
    marginLeft: 4,
  },
  manualIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  mealTypeText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default MealCard;