// App Context - Global state management

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, MoodEntry, JournalEntry, ChatMessage, MoodLevel } from '../types';

const STORAGE_KEYS = {
  USER: '@bearwithme_user',
  MOOD_ENTRIES: '@bearwithme_moods',
  JOURNAL_ENTRIES: '@bearwithme_journals',
  CHAT_HISTORY: '@bearwithme_chat',
  ONBOARDED: '@bearwithme_onboarded',
};

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => Promise<void>;

  // Mood entries
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  getTodayMood: () => MoodEntry | undefined;

  // Journal entries
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => Promise<void>;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  clearChat: () => Promise<void>;

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, moodData, journalData, chatData, onboardedData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
      ]);

      if (userData) setUserState(JSON.parse(userData));
      if (moodData) setMoodEntries(JSON.parse(moodData));
      if (journalData) setJournalEntries(JSON.parse(journalData));
      if (chatData) setChatMessages(JSON.parse(chatData));
      if (onboardedData) setIsOnboardedState(JSON.parse(onboardedData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const setIsOnboarded = async (value: boolean) => {
    setIsOnboardedState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, JSON.stringify(value));
  };

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...moodEntries];
    setMoodEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updated));
  };

  const getTodayMood = () => {
    const today = new Date().toDateString();
    return moodEntries.find(entry => new Date(entry.timestamp).toDateString() === today);
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
  };

  const addChatMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
  };

  const clearChat = async () => {
    setChatMessages([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isOnboarded,
        setIsOnboarded,
        moodEntries,
        addMoodEntry,
        getTodayMood,
        journalEntries,
        addJournalEntry,
        chatMessages,
        addChatMessage,
        clearChat,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}