import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Users, UserPlus, X, Mail, Check } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSubscriptionStore } from '@/store/subscriptionStore';

interface FamilyMembersListProps {
  onUpdate?: (members: string[]) => void;
}

const FamilyMembersList = ({ onUpdate }: FamilyMembersListProps) => {
  const Colors = useThemeColors();
  const { subscription, setSubscription } = useSubscriptionStore();
  
  const [members, setMembers] = useState<string[]>(
    subscription?.familyMembers || ['you@example.com']
  );
  const [newMember, setNewMember] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddMember = () => {
    if (!newMember.trim()) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    
    if (!newMember.includes('@') || !newMember.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    
    if (members.includes(newMember.trim())) {
      Alert.alert('Duplicate Email', 'This email is already in your family plan.');
      return;
    }
    
    if (members.length >= 5) {
      Alert.alert('Maximum Reached', 'You can only add up to 5 family members.');
      return;
    }
    
    const updatedMembers = [...members, newMember.trim()];
    setMembers(updatedMembers);
    setNewMember('');
    setIsAdding(false);
    
    if (subscription && subscription.tier === 'family') {
      setSubscription({
        ...subscription,
        familyMembers: updatedMembers
      });
    }
    
    if (onUpdate) {
      onUpdate(updatedMembers);
    }
  };
  
  const handleRemoveMember = (email: string) => {
    if (email === 'you@example.com') {
      Alert.alert('Cannot Remove', 'You cannot remove yourself from the family plan.');
      return;
    }
    
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${email} from your family plan?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedMembers = members.filter(m => m !== email);
            setMembers(updatedMembers);
            
            if (subscription && subscription.tier === 'family') {
              setSubscription({
                ...subscription,
                familyMembers: updatedMembers
              });
            }
            
            if (onUpdate) {
              onUpdate(updatedMembers);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Users size={20} color={Colors.secondary} />
        <Text style={[styles.title, { color: Colors.text }]}>Family Members</Text>
      </View>
      
      <FlatList
        data={members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[styles.memberItem, { backgroundColor: Colors.card }]}>
            <View style={styles.memberInfo}>
              <Mail size={16} color={Colors.secondary} />
              <Text style={[styles.memberEmail, { color: Colors.text }]}>{item}</Text>
              {item === 'you@example.com' && (
                <View style={[styles.ownerBadge, { backgroundColor: Colors.secondary }]}>
                  <Text style={styles.ownerBadgeText}>YOU</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveMember(item)}
            >
              <X size={16} color={item === 'you@example.com' ? Colors.mediumGray : Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          isAdding ? (
            <View style={[styles.addMemberContainer, { backgroundColor: Colors.card }]}>
              <TextInput
                style={[styles.addMemberInput, { color: Colors.text }]}
                placeholder="Enter email address"
                placeholderTextColor={Colors.subtext}
                value={newMember}
                onChangeText={setNewMember}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              <View style={styles.addMemberActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { borderColor: Colors.border }]}
                  onPress={() => setIsAdding(false)}
                >
                  <Text style={[styles.actionButtonText, { color: Colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    { backgroundColor: Colors.secondary }
                  ]}
                  onPress={handleAddMember}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            members.length < 5 && (
              <TouchableOpacity 
                style={[styles.addButton, { borderColor: Colors.secondary }]}
                onPress={() => setIsAdding(true)}
              >
                <UserPlus size={16} color={Colors.secondary} />
                <Text style={[styles.addButtonText, { color: Colors.secondary }]}>
                  Add Family Member
                </Text>
              </TouchableOpacity>
            )
          )
        }
        style={styles.membersList}
      />
      
      <Text style={[styles.infoText, { color: Colors.subtext }]}>
        You can add up to 5 family members to your plan. Each member will receive an invitation email.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  membersList: {
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberEmail: {
    marginLeft: 8,
    fontSize: 14,
  },
  ownerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  ownerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  addMemberContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  addMemberInput: {
    fontSize: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  addMemberActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});

export default FamilyMembersList;