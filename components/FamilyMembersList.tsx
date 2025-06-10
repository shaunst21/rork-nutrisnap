import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { 
  User, 
  UserPlus, 
  Mail, 
  X, 
  CheckCircle, 
  Clock
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FamilyMember } from '@/types';

// Mock family members
const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    email: 'you@example.com',
    name: 'You (Owner)',
    status: 'active',
    joinedDate: new Date().toISOString()
  },
  {
    id: '2',
    email: 'partner@example.com',
    name: 'Partner',
    status: 'active',
    joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    email: 'child@example.com',
    status: 'pending'
  }
];

const FamilyMembersList = () => {
  const Colors = useThemeColors();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !newMemberEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Check if email already exists
    if (familyMembers.some(member => member.email === newMemberEmail.trim())) {
      Alert.alert('Duplicate Email', 'This email is already in your family plan');
      return;
    }
    
    // Check if maximum members reached (5 including owner)
    if (familyMembers.length >= 5) {
      Alert.alert('Maximum Members', 'Your family plan can have a maximum of 5 members');
      return;
    }
    
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      email: newMemberEmail.trim(),
      status: 'pending'
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberEmail('');
    setShowAddMember(false);
    
    Alert.alert(
      'Invitation Sent',
      `An invitation has been sent to ${newMemberEmail.trim()}`
    );
  };
  
  const handleRemoveMember = (id: string) => {
    // Don't allow removing the owner (first member)
    if (id === '1') {
      Alert.alert('Cannot Remove', 'You cannot remove yourself as the plan owner');
      return;
    }
    
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member from your family plan?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFamilyMembers(familyMembers.filter(member => member.id !== id));
          }
        }
      ]
    );
  };
  
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'pending':
        return <Clock size={16} color={Colors.warning} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Family Members</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: Colors.secondary }]}
          onPress={() => setShowAddMember(true)}
        >
          <UserPlus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {showAddMember && (
        <View style={[styles.addMemberContainer, { backgroundColor: Colors.background }]}>
          <View style={styles.addMemberHeader}>
            <Text style={[styles.addMemberTitle, { color: Colors.text }]}>
              Add Family Member
            </Text>
            <TouchableOpacity onPress={() => setShowAddMember(false)}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.addMemberForm}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.subtext} />
              <TextInput
                style={[styles.input, { color: Colors.text }]}
                placeholder="Enter email address"
                placeholderTextColor={Colors.subtext}
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.inviteButton, { backgroundColor: Colors.secondary }]}
              onPress={handleAddMember}
            >
              <Text style={styles.inviteButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.membersList}>
        {familyMembers.map((member) => (
          <View 
            key={member.id} 
            style={[
              styles.memberItem, 
              { backgroundColor: Colors.background }
            ]}
          >
            <View style={[styles.memberAvatar, { backgroundColor: Colors.secondary }]}>
              <User size={20} color="#FFFFFF" />
            </View>
            
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: Colors.text }]}>
                {member.name || member.email}
              </Text>
              <View style={styles.memberStatus}>
                {renderStatusIcon(member.status)}
                <Text 
                  style={[
                    styles.memberStatusText, 
                    { 
                      color: member.status === 'active' 
                        ? Colors.success 
                        : Colors.warning 
                    }
                  ]}
                >
                  {member.status === 'active' ? 'Active' : 'Invitation Sent'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveMember(member.id)}
            >
              <X size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        
        {familyMembers.length < 5 && !showAddMember && (
          <TouchableOpacity 
            style={[styles.addMemberButton, { borderColor: Colors.border }]}
            onPress={() => setShowAddMember(true)}
          >
            <UserPlus size={20} color={Colors.secondary} />
            <Text style={[styles.addMemberButtonText, { color: Colors.secondary }]}>
              Add Family Member
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.remainingText, { color: Colors.subtext }]}>
        {5 - familyMembers.length} {5 - familyMembers.length === 1 ? 'spot' : 'spots'} remaining
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  membersList: {
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStatusText: {
    fontSize: 14,
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addMemberButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  remainingText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addMemberContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  addMemberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMemberTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addMemberForm: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    marginBottom: 16,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  inviteButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FamilyMembersList;