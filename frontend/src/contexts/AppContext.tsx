// App Context - Global state management
// Uses backend API as primary store, AsyncStorage as offline fallback.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, MoodEntry, JournalEntry, ChatMessage } from '../types';
import { apiGet, apiPost, apiPatch, apiDelete } from '../services/api';
import { auth } from '../services/firebaseConfig';

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
  updateJournalEntry: (
    id: string,
    entry: Partial<Omit<JournalEntry, 'id' | 'timestamp'>>
  ) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  getJournalEntryById: (id: string) => JournalEntry | undefined;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  clearChat: () => Promise<void>;

  // Loading state
  isLoading: boolean;

  // Sync helper
  refreshFromAPI: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Safe AsyncStorage helpers (offline fallback) ─────────────

const memoryStorage: Record<string, string> = {};

async function safeGetItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStorage[key] ?? null;
  }
}

async function safeSetItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    memoryStorage[key] = value;
  }
}

async function safeRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    delete memoryStorage[key];
  }
}

// ── Backend ↔ Frontend type mappers ──────────────────────────
// Backend uses snake_case; frontend uses camelCase.

function mapUserFromAPI(data: any): User {
  return {
    id: data.id,
    name: data.name,
    nickname: data.nickname ?? undefined,
    birthday: data.birthday ?? undefined,
    gender: data.gender ?? undefined,
    chatStyle: data.chat_style ?? undefined,
    occupation: data.occupation ?? undefined,
    sleepTime: data.sleep_time ?? undefined,
    wakeTime: data.wake_time ?? undefined,
    workStartTime: data.work_start_time ?? undefined,
    workEndTime: data.work_end_time ?? undefined,
    stressors: data.stressors ?? [],
    createdAt: data.created_at,
  };
}

function mapJournalFromAPI(data: any): JournalEntry {
  const d = new Date(data.created_at);
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    mainThing: data.main_thing,
    feeling: data.feeling ?? undefined,
    needFromAdam: data.need_from_adam,
    mood: data.mood,
    moodEmoji: data.mood_emoji,
    timestamp: data.created_at,
    day: d.getDate().toString(),
    month: d.toLocaleString('default', { month: 'short' }),
    year: d.getFullYear().toString(),
  };
}

function mapMoodFromAPI(data: any): MoodEntry {
  return {
    id: data.id,
    timestamp: data.created_at,
    level: data.level,
    intensity: data.intensity,
    note: data.note ?? undefined,
    triggers: data.triggers ?? [],
  };
}

function mapChatFromAPI(data: any): ChatMessage {
  return {
    id: data.id,
    timestamp: data.created_at,
    role: data.role,
    content: data.content,
  };
}

// ── Provider ─────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount — try API first, fall back to cache
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // If the user is logged in with Firebase, pull from API
      if (auth.currentUser) {
        await refreshFromAPI();
      } else {
        // Fall back to cached data
        await loadFromStorage();
      }
    } catch {
      await loadFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromStorage = async () => {
    try {
      const [userData, moodData, journalData, chatData, onboardedData] = await Promise.all([
        safeGetItem(STORAGE_KEYS.USER),
        safeGetItem(STORAGE_KEYS.MOOD_ENTRIES),
        safeGetItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        safeGetItem(STORAGE_KEYS.CHAT_HISTORY),
        safeGetItem(STORAGE_KEYS.ONBOARDED),
      ]);

      if (userData) setUserState(JSON.parse(userData));
      if (moodData) setMoodEntries(JSON.parse(moodData));
      if (journalData) setJournalEntries(JSON.parse(journalData));
      if (chatData) setChatMessages(JSON.parse(chatData));
      if (onboardedData) setIsOnboardedState(JSON.parse(onboardedData));
    } catch {
      // Ignore storage failures
    }
  };

  const refreshFromAPI = async () => {
    try {
      const [userData, journalsData, moodsData, chatData] = await Promise.all([
        apiGet<any>('/api/users/me').catch(() => null),
        apiGet<any[]>('/api/journals').catch(() => []),
        apiGet<any[]>('/api/moods').catch(() => []),
        apiGet<any[]>('/api/chat/messages').catch(() => []),
      ]);

      if (userData) {
        const u = mapUserFromAPI(userData);
        setUserState(u);
        await safeSetItem(STORAGE_KEYS.USER, JSON.stringify(u));
      }

      const journals = (journalsData ?? []).map(mapJournalFromAPI);
      setJournalEntries(journals);
      await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journals));

      const moods = (moodsData ?? []).map(mapMoodFromAPI);
      setMoodEntries(moods);
      await safeSetItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(moods));

      const messages = (chatData ?? []).map(mapChatFromAPI);
      setChatMessages(messages);
      await safeSetItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch {
      // If API fails, fall back to storage
      await loadFromStorage();
    }
  };

  // ── User ─────────────────────────────────────────

  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await safeSetItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      await safeRemoveItem(STORAGE_KEYS.USER);
    }
  };

  const setIsOnboarded = async (value: boolean) => {
    setIsOnboardedState(value);
    await safeSetItem(STORAGE_KEYS.ONBOARDED, JSON.stringify(value));
  };

  // ── Moods ────────────────────────────────────────

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    try {
      const data = await apiPost<any>('/api/moods', {
        level: entry.level,
        intensity: entry.intensity,
        note: entry.note ?? null,
        triggers: entry.triggers ?? [],
      });
      const mapped = mapMoodFromAPI(data);
      const updated = [mapped, ...moodEntries];
      setMoodEntries(updated);
      await safeSetItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updated));
    } catch {
      // Offline fallback — save locally
      const newEntry: MoodEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [newEntry, ...moodEntries];
      setMoodEntries(updated);
      await safeSetItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updated));
    }
  };

  const getTodayMood = () => {
    const today = new Date().toDateString();
    return moodEntries.find((entry) => new Date(entry.timestamp).toDateString() === today);
  };

  // ── Journals ─────────────────────────────────────

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    try {
      const data = await apiPost<any>('/api/journals', {
        title: entry.title,
        content: entry.content,
        main_thing: entry.mainThing,
        feeling: entry.feeling ?? null,
        need_from_adam: entry.needFromAdam,
        mood: entry.mood,
        mood_emoji: entry.moodEmoji,
      });
      const mapped = mapJournalFromAPI(data);
      const updated = [mapped, ...journalEntries];
      setJournalEntries(updated);
      await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
    } catch {
      // Offline fallback
      const newEntry: JournalEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [newEntry, ...journalEntries];
      setJournalEntries(updated);
      await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
    }
  };

  const updateJournalEntry = async (
    id: string,
    entry: Partial<Omit<JournalEntry, 'id' | 'timestamp'>>
  ) => {
    try {
      const body: any = {};
      if (entry.title !== undefined) body.title = entry.title;
      if (entry.content !== undefined) body.content = entry.content;
      if (entry.mainThing !== undefined) body.main_thing = entry.mainThing;
      if (entry.feeling !== undefined) body.feeling = entry.feeling;
      if (entry.needFromAdam !== undefined) body.need_from_adam = entry.needFromAdam;
      if (entry.mood !== undefined) body.mood = entry.mood;
      if (entry.moodEmoji !== undefined) body.mood_emoji = entry.moodEmoji;

      await apiPatch(`/api/journals/${id}`, body);
    } catch {
      // ignore API error — update locally anyway
    }

    const updated = journalEntries.map((j) => (j.id === id ? { ...j, ...entry } : j));
    setJournalEntries(updated);
    await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
  };

  const deleteJournalEntry = async (id: string) => {
    try {
      await apiDelete(`/api/journals/${id}`);
    } catch {
      // ignore API error
    }

    const updated = journalEntries.filter((j) => j.id !== id);
    setJournalEntries(updated);
    await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
  };

  const getJournalEntryById = (id: string) => {
    return journalEntries.find((j) => j.id === id);
  };

  // ── Chat ─────────────────────────────────────────

  const addChatMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    try {
      const data = await apiPost<any>('/api/chat/messages', {
        role: message.role,
        content: message.content,
      });
      const mapped = mapChatFromAPI(data);
      const updated = [...chatMessages, mapped];
      setChatMessages(updated);
      await safeSetItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
    } catch {
      // Offline fallback
      const newMessage: ChatMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...chatMessages, newMessage];
      setChatMessages(updated);
      await safeSetItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
    }
  };

  const clearChat = async () => {
    try {
      await apiDelete('/api/chat/messages');
    } catch {
      // ignore API error
    }
    setChatMessages([]);
    await safeRemoveItem(STORAGE_KEYS.CHAT_HISTORY);
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
        updateJournalEntry,
        deleteJournalEntry,
        getJournalEntryById,
        chatMessages,
        addChatMessage,
        clearChat,
        isLoading,
        refreshFromAPI,
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
