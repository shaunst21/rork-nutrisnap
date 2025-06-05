import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Send, Cpu, Lock, X, User, ArrowLeft } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useThemeColors } from '@/hooks/useThemeColors';

// Message types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample AI responses
const aiResponses = [
  "Based on your meal history, I recommend increasing your protein intake by adding more lean meats, eggs, or plant-based proteins to your diet.",
  "Your calorie intake has been consistently below your goal. Consider adding healthy snacks between meals to reach your nutritional targets.",
  "I notice you've been logging fewer meals on weekends. Try meal prepping on Fridays to maintain consistency in your nutrition.",
  "Great job maintaining your streak! Your consistency is key to achieving your nutrition goals.",
  "Looking at your macros, your carb intake is higher than recommended for your goals. Consider swapping some carbs for more vegetables and proteins.",
  "Your water intake seems low based on your meal patterns. Remember to stay hydrated throughout the day for optimal health and metabolism.",
  "I've analyzed your eating patterns and noticed you tend to consume more calories in the evening. Consider shifting some of those calories to earlier in the day.",
  "Based on your recent logs, you might benefit from adding more fiber-rich foods like whole grains, beans, and vegetables to your diet."
];

export default function AiCoachScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { hasFeature } = useSubscriptionStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Nutrition Coach. How can I help you with your nutrition goals today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  const hasAiCoachFeature = hasFeature('ai_coach');
  
  const handleSend = () => {
    if (!hasAiCoachFeature) {
      Alert.alert(
        'Premium Feature',
        'AI Nutrition Coach is a premium feature. Upgrade to access this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Plans', 
            onPress: () => router.push('/premium')
          }
        ]
      );
      return;
    }
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isAi = item.sender === 'ai';
    
    return (
      <View 
        style={[
          styles.messageBubble, 
          isAi 
            ? [styles.aiMessage, { backgroundColor: Colors.card }] 
            : [styles.userMessage, { backgroundColor: Colors.primary }]
        ]}
      >
        <View style={styles.messageHeader}>
          <View style={styles.senderInfo}>
            {isAi ? (
              <Cpu size={16} color={Colors.primary} />
            ) : (
              <User size={16} color="#FFFFFF" />
            )}
            <Text 
              style={[
                styles.senderName, 
                { color: isAi ? Colors.primary : '#FFFFFF' }
              ]}
            >
              {isAi ? 'AI Coach' : 'You'}
            </Text>
          </View>
          <Text 
            style={[
              styles.timestamp, 
              { color: isAi ? Colors.subtext : 'rgba(255, 255, 255, 0.8)' }
            ]}
          >
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={[styles.messageText, { color: isAi ? Colors.text : '#FFFFFF' }]}>
          {item.text}
        </Text>
      </View>
    );
  };
  
  if (!hasAiCoachFeature) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>AI Nutrition Coach</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={[styles.premiumCard, { backgroundColor: Colors.card }]}>
          <Lock size={40} color={Colors.primary} />
          <Text style={[styles.premiumTitle, { color: Colors.text }]}>
            Premium Feature
          </Text>
          <Text style={[styles.premiumDescription, { color: Colors.subtext }]}>
            AI Nutrition Coach is available for premium subscribers. Upgrade to get personalized nutrition advice and recommendations.
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
            With AI Nutrition Coach You Can:
          </Text>
          
          <View style={styles.previewFeatures}>
            <View style={styles.previewFeature}>
              <Cpu size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Get personalized nutrition advice
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Cpu size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Ask questions about your diet and nutrition
              </Text>
            </View>
            
            <View style={styles.previewFeature}>
              <Cpu size={24} color={Colors.primary} />
              <Text style={[styles.previewFeatureText, { color: Colors.text }]}>
                Receive meal suggestions based on your goals
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>AI Nutrition Coach</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isTyping && (
        <View style={[styles.typingIndicator, { backgroundColor: Colors.card }]}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={[styles.typingText, { color: Colors.text }]}>AI is typing...</Text>
        </View>
      )}
      
      <View style={[styles.inputContainer, { backgroundColor: Colors.card }]}>
        <TextInput
          style={[styles.input, { color: Colors.text }]}
          placeholder="Ask your nutrition question..."
          placeholderTextColor={Colors.subtext}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: Colors.primary },
            !message.trim() && { opacity: 0.5 }
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});