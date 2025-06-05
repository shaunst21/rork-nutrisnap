import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const Colors = useThemeColors();
  const borderColor = color || Colors.primary;
  
  return (
    <View style={[styles.card, { backgroundColor: Colors.card, borderLeftColor: borderColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.subtext }]}>{title}</Text>
        <Text style={[styles.value, { color: borderColor }]}>{value}</Text>
      </View>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
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
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginLeft: 16,
  },
});

export default StatCard;