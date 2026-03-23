import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Design tokens from Figma
const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#7857e1',
  textSecondary: '#7857e1',
  inputBackground: 'rgba(120, 87, 225, 0.12)',
  inputBorder: '#7857e1',
};

type ChatMessage = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const dummyReplies = useMemo(
    () => [
      'I hear you. Tell me a little more about how this felt today.',
      'That makes sense. What do you think triggered this feeling?',
      'Thanks for sharing this. Want to try one small next step together?',
      'I am with you. We can break this into one simple step right now.',
    ],
    []
  );

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    const replyText = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replyText,
          sender: 'bot',
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Adam (AI)</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Chat Content */}
      <View style={styles.content}>
        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* Ready Message */}
        <Text style={styles.readyText}>Adam is ready to chat.</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          I've read through your reflection. Whenever you're ready, let's talk
          through it together.
        </Text>

        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(item => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Start Conversation"
            placeholderTextColor="rgba(120, 87, 225, 0.4)"
            value={message}
            onChangeText={setMessage}
          />

          {/* Mic Icon */}
          <View style={styles.micContainer}>
            <View style={styles.micHead} />
            <View style={styles.micStand} />
            <View style={styles.micBase} />
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <View style={styles.arrowIcon}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowHead} />
          </View>
        </TouchableOpacity>
      </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
  },
  menuIcon: {
    width: 14,
    height: 10,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 14,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: '100%',
    maxWidth: 340,
    height: 260,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(120, 87, 225, 0.1)',
    borderRadius: 20,
  },
  readyText: {
    fontSize: 28,
    fontFamily: 'Urbanist',
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Urbanist',
    color: colors.primary,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
    marginBottom: 6,
  },
  messagesScroll: {
    width: '100%',
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 4,
    gap: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(120, 87, 225, 0.25)',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Urbanist',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 16,
  },
  inputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: colors.inputBackground,
    borderRadius: 49,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.primary,
  },
  micContainer: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micHead: {
    width: 12,
    height: 14,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  micStand: {
    width: 2,
    height: 5,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  micBase: {
    width: 6,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 49,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 16,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.white,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    left: 2,
    top: 1,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: colors.white,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    right: 0,
    top: 3,
    transform: [{ rotate: '90deg' }],
  },
});

export default ChatScreen;