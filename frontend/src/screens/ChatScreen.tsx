// Chat Screen - Chat with Adam

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../constants/theme';
import { ChatMessage } from '../types';
import { generateAdamResponse } from '../utils/helpers';

export default function ChatScreen() {
  const { user, chatMessages, addChatMessage, clearChat, moodEntries } = useApp();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Add welcome message if chat is empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMsg: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'adam',
        content: `Hey ${user?.nickname || user?.name || 'there'}! 👋 It's so good to see you here. I'm Adam, and I'm here to listen, support, and help you navigate life's ups and downs. No judgment here - just a safe space for you to be yourself. How are you feeling right now?`,
      };
      addChatMessage(welcomeMsg);
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      content: inputText.trim(),
    };

    await addChatMessage(userMessage);
    setInputText('');

    // Simulate AI response delay
    setTimeout(async () => {
      const adamResponse = generateAdamResponse(
        inputText.trim(),
        user,
        moodEntries
      );

      const adamMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'adam',
        content: adamResponse,
      };

      await addChatMessage(adamMessage);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.adamMessageContainer,
      ]}>
        {!isUser && <Text style={styles.adamAvatar}>🐻</Text>}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.adamBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.adamMessageText,
          ]}>
            {item.content}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {isUser && <View style={styles.userAvatarPlaceholder} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chat with Adam</Text>
          <Text style={styles.subtitle}>Your AI companion</Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  clearButton: {
    padding: SPACING.sm,
  },
  clearButtonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  messagesContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  adamMessageContainer: {
    justifyContent: 'flex-start',
  },
  adamAvatar: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  userAvatarPlaceholder: {
    width: 28,
    marginLeft: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  adamBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  adamMessageText: {
    color: COLORS.text,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.md,
  },
});