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
  MessageCircle,
  HelpCircle
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function SupportScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please enter both subject and message');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject('');
      setMessage('');
      
      Alert.alert(
        'Message Sent',
        'Your support request has been submitted. Our team will respond as soon as possible (typically 3-5 business days).',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1500);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Support</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.supportHeader}>
          <HelpCircle size={48} color={Colors.primary} />
          <Text style={[styles.supportTitle, { color: Colors.text }]}>
            How can we help you?
          </Text>
          <Text style={[styles.supportDescription, { color: Colors.subtext }]}>
            Fill out the form below and our support team will get back to you as soon as possible.
          </Text>
        </View>
        
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
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: Colors.primary },
            isSubmitting && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.faqSection}>
          <Text style={[styles.faqTitle, { color: Colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: Colors.card }]}>
            <Text style={[styles.faqQuestion, { color: Colors.text }]}>
              How do I track my meals?
            </Text>
            <Text style={[styles.faqAnswer, { color: Colors.subtext }]}>
              You can track meals by tapping the "Add Food" button on the home screen or by using the camera icon in the tab bar.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: Colors.card }]}>
            <Text style={[styles.faqQuestion, { color: Colors.text }]}>
              How do I cancel my subscription?
            </Text>
            <Text style={[styles.faqAnswer, { color: Colors.subtext }]}>
              You can cancel your subscription in the Settings tab under "Your Subscription" section.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: Colors.card }]}>
            <Text style={[styles.faqQuestion, { color: Colors.text }]}>
              How do I export my data?
            </Text>
            <Text style={[styles.faqAnswer, { color: Colors.subtext }]}>
              Premium users can export their data from the Settings tab under "Data Management" section.
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={[styles.contactTitle, { color: Colors.text }]}>
            Contact Information
          </Text>
          <Text style={[styles.contactText, { color: Colors.subtext }]}>
            Email: support@nutritionapp.com
          </Text>
          <Text style={[styles.contactText, { color: Colors.subtext }]}>
            Hours: Monday-Friday, 9am-5pm EST
          </Text>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  supportHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  supportDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
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
  faqSection: {
    marginBottom: 24,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 8,
  }
});