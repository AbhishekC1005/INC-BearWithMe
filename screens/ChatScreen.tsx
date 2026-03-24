import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from '../src/types';

// Design tokens from Figma
const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  inputBackground: '#7857e126',
  inputBorder: '#7857e1',
  placeholder: '#b7a8ea',
};

type ChatMessage = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Chat'>>();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(14)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(10)).current;
  const hasAnimatedRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimatedRef.current) {
        heroOpacity.setValue(0);
        heroTranslateY.setValue(14);
        footerOpacity.setValue(0);
        footerTranslateY.setValue(10);
      }

      const entranceAnimation = Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.timing(heroTranslateY, {
          toValue: 0,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(footerOpacity, {
              toValue: 1,
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(footerTranslateY, {
              toValue: 0,
              duration: 280,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);

      entranceAnimation.start();
      hasAnimatedRef.current = true;

      return () => {
        entranceAnimation.stop();
      };
    }, [footerOpacity, footerTranslateY, heroOpacity, heroTranslateY])
  );

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

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    const replyText = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];
    setTimeout(() => {
      setMessages((prev) => [
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] },
          ]}
        >
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={22} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Adam(AI)</Text>

          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="close" size={26} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero */}
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] },
          ]}
        >
          <Image
            source={require('../assets/bear_sitting.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.readyText}>Adam is ready to chat.</Text>

          <Text style={styles.subtitle}>
            I've read through your reflection. Whenever you're ready, let's talk through it
            together.
          </Text>
        </Animated.View>

        {/* Messages */}
        <View style={styles.messagesArea}>
          <ScrollView
            ref={scrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((item) => (
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
        <Animated.View
          style={[
            styles.inputContainer,
            { paddingBottom: Math.max(36, insets.bottom + 18) },
            { opacity: footerOpacity, transform: [{ translateY: footerTranslateY }] },
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Start Conversation"
              placeholderTextColor={colors.placeholder}
              value={message}
              onChangeText={setMessage}
            />

            <Ionicons name="mic-outline" size={20} color={colors.primary} />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonIdle]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons name="arrow-up" size={22} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.primary,
    fontWeight: '100',
    letterSpacing: -0.7,
    marginTop: -1,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 320,
    height: 320,
    marginBottom: -10,
  },
  readyText: {
    fontSize: 32,
    fontFamily: 'Urbanist-Medium',
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    marginBottom: 5,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 12,
    maxWidth: 335,
    marginLeft: 30,
    marginRight: 30,
  },
  messagesArea: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  messagesScroll: {
    width: '100%',
  },
  messagesContent: {
    paddingVertical: 6,
    gap: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 16,
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
    paddingTop: 6,
    paddingBottom: 12,
    gap: 5,
  },
  inputWrapper: {
    flex: 1,
    height: 44,
    backgroundColor: colors.inputBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist',
    color: colors.primary,
    paddingVertical: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonIdle: {
    opacity: 1,
  },
});

export default ChatScreen;
