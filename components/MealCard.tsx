import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, Clock, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { deleteMeal } from '@/firebase';

interface MealCardProps {
  id: string;
  food: string;
  calories: number;
  date: string;
  method: 'scan' | 'manual';
  onDelete?: () => void;
}

const MealCard = ({ id, food, calories, date, method, onDelete }: MealCardProps) => {
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
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.foodName}>{food}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.calories}>{calories} calories</Text>
      
      <View style={styles.footer}>
        <View style={styles.methodContainer}>
          {method === 'scan' ? (
            <Camera size={16} color={Colors.primary} />
          ) : (
            <Text style={styles.manualIcon}>M</Text>
          )}
          <Text style={styles.methodText}>
            {method === 'scan' ? 'Scanned' : 'Manual'}
          </Text>
        </View>
        
        <View style={styles.timeContainer}>
          <Clock size={16} color={Colors.subtext} />
          <Text style={styles.timeText}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.text,
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
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 4,
  },
  manualIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 4,
  },
});

export default MealCard;