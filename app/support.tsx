import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Send, 
  Lock, 
  Headphones, 
  MessageCircle,
  Clock,
  CheckCircle
} from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import PremiumFeatureModal from '@/components/PremiumFeatureModal';

// Mock support tickets
const mockTickets = [
  {
    id: '1',
    subject: 'App crashing on startup',
    message: 'The app keeps crashing when I try to open it after the latest update.',
    status: 'open',
    createdAt: '2025-06-08T14:30:00Z',
    replies: [
      {
        id: '1-1',
        message: 'Have you tried reinstalling the app?',
        isSupport: true,
        createdAt: '2025-06-08T15:45:00Z'
      }
    ]
  },
  {
    id: '2',
    subject: 'Billing question',
    message: 'I was charged twice for my subscription this month. Can you help?',
    status: 'closed',
    createdAt: '2025-06-01T09:15:00Z',
    replies: [
      {
        id: '2-1',
        message: 'We've checked your account and issued a refund for the duplicate charge. It should appear in your account within 3-5 business days.',
        isSupport: true,
        createdAt: '2025-06-01T11:20:00Z'
      },
      {
        id: '2-2',
        message: 'Thank you! I see the refund pending in my account now.',
        isSupport: false,
        createdAt: '2025-06-01T14:05:00Z'
      },
      {
        id: '2-3',
        message: 'You're welcome! Let us know if you need anything else.',
        isSupport: true,
        createdAt: '2025-06-01T14:30:00Z'
      }
    ]
  }
];

export default function SupportScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  
  const [tickets, setTickets] = useState(mockTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const hasPrioritySupport = hasFeature('priority_support');
  
  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please enter both subject and message');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        id: Date.now().toString(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        createdAt: new Date().toISOString(),
        replies: []
      };
      
      setTickets([newTicket, ...tickets]);
      setSubject('');
      setMessage('');
      setShowNewTicket(false);
      setIsSubmitting(false);
      
      Alert.alert(
        'Ticket Created',
        hasPrioritySupport 
          ? 'Your support ticket has been created. Our team will respond within 24 hours.'
          : 'Your support ticket has been created. Our team will respond as soon as possible (typically 3-5 business days).'
      );
    }, 1500);
  };
  
  const handleSendReply = () => {
    if (!reply.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReply = {
        id: Date.now().toString(),
        message: reply.trim(),
        isSupport: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, replies: [...ticket.replies, newReply] }
          : ticket
      );
      
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        replies: [...selectedTicket.replies, newReply]
      });
      setReply('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleCloseTicket = () => {
    Alert.alert(
      'Close Ticket',
      'Are you sure you want to close this support ticket?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Close Ticket',
          onPress: () => {
            const updatedTickets = tickets.map(ticket => 
              ticket.id === selectedTicket.id 
                ? { ...ticket, status: 'closed' }
                : ticket
            );
            
            setTickets(updatedTickets);
            setSelectedTicket({
              ...selectedTicket,
              status: 'closed'
            });
            
            Alert.alert('Success', 'Ticket has been closed');
          }
        }
      ]
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleNewTicket = () => {
    if (!hasPrioritySupport) {
      setShowPremiumModal(true);
      return;
    }
    
    setShowNewTicket(true);
  };
  
  const handleViewTicket = (ticket: any) => {
    if (!hasPrioritySupport) {
      setShowPremiumModal(true);
      return;
    }
    
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
  };
  
  if (!hasPrioritySupport) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>Priority Support</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Plus Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            Priority Support is available for Premium Plus subscribers. Upgrade to get faster responses and dedicated support.
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
            With Priority Support You Get:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Headphones size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Dedicated support team
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Clock size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Faster response times (within 24 hours)
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <MessageCircle size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Direct messaging with our support team
              </Text>
            </View>
          </View>
        </View>
        
        <PremiumFeatureModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Priority Support"
          description="Get faster responses and dedicated support from our team. Premium Plus members receive responses within 24 hours."
        />
      </View>
    );
  }
  
  if (showNewTicket) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowNewTicket(false)}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>New Support Ticket</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.newTicketContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: Colors.text }]}>Subject</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors.card,
                  color: Colors.text,
                  borderColor: Colors.border
                }
              ]}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor={Colors.subtext}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: Colors.text }]}>Message</Text>
            <TextInput
              style={[
                styles.messageInput, 
                { 
                  backgroundColor: Colors.card,
                  color: Colors.text,
                  borderColor: Colors.border
                }
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Please describe your issue in detail..."
              placeholderTextColor={Colors.subtext}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.priorityNote}>
            <CheckCircle size={20} color={Colors.success} />
            <Text style={[styles.priorityNoteText, { color: Colors.text }]}>
              As a Premium Plus member, you'll receive a response within 24 hours.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              { backgroundColor: Colors.primary },
              isSubmitting && { opacity: 0.7 }
            ]}
            onPress={handleCreateTicket}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Ticket</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  
  if (showTicketDetail && selectedTicket) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowTicketDetail(false)}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>Ticket Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.ticketDetailContainer}>
          <View style={[styles.ticketHeader, { backgroundColor: Colors.card }]}>
            <View style={styles.ticketHeaderTop}>
              <Text style={[styles.ticketSubject, { color: Colors.text }]}>
                {selectedTicket.subject}
              </Text>
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: selectedTicket.status === 'open' 
                    ? Colors.success 
                    : Colors.mediumGray 
                }
              ]}>
                <Text style={styles.statusBadgeText}>
                  {selectedTicket.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={[styles.ticketDate, { color: Colors.subtext }]}>
              Created: {formatDate(selectedTicket.createdAt)}
            </Text>
          </View>
          
          <View style={styles.messagesContainer}>
            <View style={[styles.messageItem, { backgroundColor: Colors.card }]}>
              <View style={styles.messageHeader}>
                <Text style={[styles.messageSender, { color: Colors.text }]}>You</Text>
                <Text style={[styles.messageDate, { color: Colors.subtext }]}>
                  {formatDate(selectedTicket.createdAt)}
                </Text>
              </View>
              <Text style={[styles.messageContent, { color: Colors.text }]}>
                {selectedTicket.message}
              </Text>
            </View>
            
            {selectedTicket.replies.map((reply: any) => (
              <View 
                key={reply.id} 
                style={[
                  styles.messageItem, 
                  { 
                    backgroundColor: reply.isSupport ? Colors.supportBubble : Colors.card,
                    alignSelf: reply.isSupport ? 'flex-start' : 'flex-end'
                  }
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text 
                    style={[
                      styles.messageSender, 
                      { color: reply.isSupport ? Colors.supportText : Colors.text }
                    ]}
                  >
                    {reply.isSupport ? 'Support Team' : 'You'}
                  </Text>
                  <Text 
                    style={[
                      styles.messageDate, 
                      { color: reply.isSupport ? 'rgba(255, 255, 255, 0.7)' : Colors.subtext }
                    ]}
                  >
                    {formatDate(reply.createdAt)}
                  </Text>
                </View>
                <Text 
                  style={[
                    styles.messageContent, 
                    { color: reply.isSupport ? Colors.supportText : Colors.text }
                  ]}
                >
                  {reply.message}
                </Text>
              </View>
            ))}
          </View>
          
          {selectedTicket.status === 'open' && (
            <View style={styles.replyContainer}>
              <TextInput
                style={[
                  styles.replyInput, 
                  { 
                    backgroundColor: Colors.card,
                    color: Colors.text,
                    borderColor: Colors.border
                  }
                ]}
                value={reply}
                onChangeText={setReply}
                placeholder="Type your reply..."
                placeholderTextColor={Colors.subtext}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <View style={styles.replyActions}>
                <TouchableOpacity 
                  style={[styles.closeTicketButton, { borderColor: Colors.border }]}
                  onPress={handleCloseTicket}
                >
                  <Text style={[styles.closeTicketButtonText, { color: Colors.text }]}>
                    Close Ticket
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sendReplyButton, 
                    { backgroundColor: Colors.primary },
                    isSubmitting && { opacity: 0.7 }
                  ]}
                  onPress={handleSendReply}
                  disabled={isSubmitting || !reply.trim()}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Send size={16} color="#FFFFFF" />
                      <Text style={styles.sendReplyButtonText}>Send</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Priority Support</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.priorityBanner}>
        <Headphones size={24} color="#FFFFFF" />
        <Text style={styles.priorityBannerText}>
          Priority Support Active
        </Text>
      </View>
      
      <View style={styles.ticketsHeader}>
        <Text style={[styles.ticketsTitle, { color: Colors.text }]}>Your Support Tickets</Text>
        <TouchableOpacity 
          style={[styles.newTicketButton, { backgroundColor: Colors.primary }]}
          onPress={handleNewTicket}
        >
          <Text style={styles.newTicketButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.ticketsList}>
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={Colors.mediumGray} />
            <Text style={[styles.emptyStateTitle, { color: Colors.text }]}>
              No Support Tickets
            </Text>
            <Text style={[styles.emptyStateDescription, { color: Colors.subtext }]}>
              You haven't created any support tickets yet. Need help with something?
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: Colors.primary }]}
              onPress={handleNewTicket}
            >
              <Text style={styles.emptyStateButtonText}>Create Your First Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tickets.map(ticket => (
            <TouchableOpacity 
              key={ticket.id}
              style={[styles.ticketItem, { backgroundColor: Colors.card }]}
              onPress={() => handleViewTicket(ticket)}
            >
              <View style={styles.ticketItemHeader}>
                <Text style={[styles.ticketItemSubject, { color: Colors.text }]}>
                  {ticket.subject}
                </Text>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: ticket.status === 'open' 
                      ? Colors.success 
                      : Colors.mediumGray 
                  }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {ticket.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text 
                style={[styles.ticketItemPreview, { color: Colors.subtext }]}
                numberOfLines={2}
              >
                {ticket.message}
              </Text>
              
              <View style={styles.ticketItemFooter}>
                <Text style={[styles.ticketItemDate, { color: Colors.subtext }]}>
                  {formatDate(ticket.createdAt)}
                </Text>
                <Text style={[styles.ticketItemReplies, { color: Colors.primary }]}>
                  {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  priorityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    marginBottom: 16,
  },
  priorityBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ticketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  ticketsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newTicketButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newTicketButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  ticketsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ticketItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketItemSubject: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketItemPreview: {
    fontSize: 14,
    marginBottom: 12,
  },
  ticketItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketItemDate: {
    fontSize: 12,
  },
  ticketItemReplies: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  newTicketContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 120,
  },
  priorityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  priorityNoteText: {
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ticketDetailContainer: {
    flex: 1,
  },
  ticketHeader: {
    padding: 16,
    marginBottom: 16,
  },
  ticketHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  ticketDate: {
    fontSize: 14,
  },
  messagesContainer: {
    padding: 16,
  },
  messageItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 22,
  },
  replyContainer: {
    padding: 16,
    marginTop: 8,
  },
  replyInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  closeTicketButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  closeTicketButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sendReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendReplyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
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
  supportBubble: {
    backgroundColor: '#2196F3',
  },
  supportText: {
    color: '#FFFFFF',
  },
});