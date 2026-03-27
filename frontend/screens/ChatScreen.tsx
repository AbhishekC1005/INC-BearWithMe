import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from '../src/types';
import { useApp } from '../src/contexts/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  inputBackground: '#7857e126',
  inputBorder: '#7857e1',
  placeholder: '#b7a8ea',
  drawerBg: '#2d1f5e',
  drawerItem: 'rgba(255,255,255,0.08)',
  drawerItemActive: 'rgba(120, 87, 225, 0.35)',
};

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Chat'>>();
  const insets = useSafeAreaInsets();
  const {
    chatSessions,
    currentSessionId,
    chatMessages,
    createChatSession,
    deleteChatSession,
    loadSessionMessages,
    sendChatMessage,
    refreshChatSessions,
  } = useApp();

  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasEverSentMessage, setHasEverSentMessage] = useState(false);
  const [heroMounted, setHeroMounted] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(14)).current;
  const heroVisibility = useRef(new Animated.Value(1)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(10)).current;
  const hasAnimatedRef = useRef(false);
  const hasEverSentRef = useRef(false);

  // Load sessions on mount
  useEffect(() => {
    refreshChatSessions();
  }, []);

  // When switching sessions, determine hero state
  useEffect(() => {
    if (chatMessages.length > 0) {
      hasEverSentRef.current = true;
      setHasEverSentMessage(true);
      setHeroMounted(false);
    } else {
      hasEverSentRef.current = false;
      setHasEverSentMessage(false);
      setHeroMounted(true);
      heroVisibility.setValue(1);
    }
  }, [currentSessionId, chatMessages.length]);

  // Keyboard listeners
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      Animated.timing(heroVisibility, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setHeroMounted(false);
      });
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      if (hasEverSentRef.current) return;
      setHeroMounted(true);
      heroVisibility.setValue(0);
      Animated.timing(heroVisibility, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [heroVisibility]);

  // Entrance animation
  useFocusEffect(
    useCallback(() => {
      if (!hasAnimatedRef.current) {
        heroOpacity.setValue(0);
        heroTranslateY.setValue(14);
        footerOpacity.setValue(0);
        footerTranslateY.setValue(10);
      }

      const entranceAnimation = Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(heroTranslateY, { toValue: 0, duration: 360, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(footerOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
            Animated.timing(footerTranslateY, { toValue: 0, duration: 280, useNativeDriver: true }),
          ]),
        ]),
      ]);

      entranceAnimation.start();
      hasAnimatedRef.current = true;
      return () => entranceAnimation.stop();
    }, [footerOpacity, footerTranslateY, heroOpacity, heroTranslateY])
  );

  // ── Drawer ────────────────────────────────────────

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(drawerAnim, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 4 }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setDrawerOpen(false));
  };

  const handleNewChat = async () => {
    closeDrawer();
    try {
      await createChatSession();
    } catch (e: any) {
      Alert.alert('Error', 'Could not create new chat');
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    closeDrawer();
    await loadSessionMessages(sessionId);
  };

  const handleDeleteSession = (sessionId: string, title: string) => {
    Alert.alert('Delete Chat', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteChatSession(sessionId);
        },
      },
    ]);
  };

  // ── Send ──────────────────────────────────────────

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isThinking) return;

    // If no active session, create one first
    if (!currentSessionId) {
      try {
        await createChatSession();
      } catch {
        Alert.alert('Error', 'Could not create chat session');
        return;
      }
    }

    // Hide hero
    hasEverSentRef.current = true;
    setHasEverSentMessage(true);
    Animated.timing(heroVisibility, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setHeroMounted(false);
    });

    setMessage('');
    setIsThinking(true);

    try {
      await sendChatMessage(trimmed);
    } catch (e: any) {
      Alert.alert('Error', 'Adam could not respond. Please try again.');
    } finally {
      setIsThinking(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const inputBottomPadding = Math.max(14, insets.bottom + 8);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Drawer Overlay ── */}
      {drawerOpen && (
        <Animated.View
          style={[styles.drawerOverlay, { opacity: overlayAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeDrawer}
          />
        </Animated.View>
      )}

      {/* ── Left Drawer ── */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerAnim }], paddingTop: insets.top + 12 },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Chat History</Text>
          <TouchableOpacity onPress={closeDrawer}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>

        <ScrollView style={styles.drawerList} showsVerticalScrollIndicator={false}>
          {chatSessions.length === 0 ? (
            <Text style={styles.drawerEmpty}>No chats yet. Start a new one!</Text>
          ) : (
            chatSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.drawerItem,
                  currentSessionId === session.id && styles.drawerItemActive,
                ]}
                onPress={() => handleSelectSession(session.id)}
                onLongPress={() => handleDeleteSession(session.id, session.title)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.drawerItemText} numberOfLines={1}>
                  {session.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* ── Main Chat Area ── */}
      <KeyboardAvoidingView style={styles.body} behavior="padding" keyboardVerticalOffset={0}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] },
          ]}
        >
          <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
            <Ionicons name="menu-outline" size={22} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Adam(AI)</Text>

          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="close" size={26} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero */}
        {heroMounted && (
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: Animated.multiply(heroOpacity, heroVisibility),
                transform: [{ translateY: heroTranslateY }],
              },
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
        )}

        {/* Messages */}
        <View style={styles.messagesArea}>
          <ScrollView
            ref={scrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {chatMessages.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.messageBubble,
                  item.role === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.role === 'user' ? styles.userMessageText : styles.botMessageText,
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            ))}

            {/* Typing indicator */}
            {isThinking && (
              <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  <TypingDot delay={0} />
                  <TypingDot delay={200} />
                  <TypingDot delay={400} />
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Input Area */}
        <Animated.View
          style={[
            styles.inputContainer,
            { paddingBottom: inputBottomPadding },
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
              editable={!isThinking}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Ionicons name="mic-outline" size={20} color={colors.primary} />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, (!message.trim() || isThinking) && styles.sendButtonIdle]}
            onPress={handleSend}
            disabled={!message.trim() || isThinking}
          >
            {isThinking ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Ionicons name="arrow-up" size={22} color={colors.white} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ── Typing Dot Animation ─────────────────────────────

const TypingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, opacity]);

  return (
    <Animated.View style={[styles.typingDot, { opacity }]} />
  );
};

// ── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },

  // ── Drawer ──
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.drawerBg,
    zIndex: 11,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  newChatText: {
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
  },
  drawerList: {
    flex: 1,
  },
  drawerEmpty: {
    fontSize: 13,
    fontFamily: 'Urbanist',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 40,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: colors.drawerItem,
  },
  drawerItemActive: {
    backgroundColor: colors.drawerItemActive,
  },
  drawerItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Urbanist',
    color: '#fff',
  },

  // ── Header ──
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

  // ── Hero ──
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

  // ── Messages ──
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

  // ── Typing indicator ──
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // ── Input ──
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
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
    opacity: 0.6,
  },
});

export default ChatScreen;
