// App Context - Global state management
// Uses backend API as primary store, AsyncStorage as offline fallback.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User, MoodEntry, JournalEntry, ChatMessage, ChatSession } from '../types';
import { apiGet, apiPost, apiPatch, apiDelete } from '../services/api';
import { auth } from '../services/firebaseConfig';

const STORAGE_KEYS = {
  USER: '@bearwithme_user',
  MOOD_ENTRIES: '@bearwithme_moods',
  JOURNAL_ENTRIES: '@bearwithme_journals',
  CHAT_SESSIONS: '@bearwithme_chat_sessions',
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
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp' | 'sessionId'>) => Promise<void>;
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

  // Chat sessions
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  createChatSession: (title?: string) => Promise<ChatSession>;
  deleteChatSession: (id: string) => Promise<void>;
  refreshChatSessions: () => Promise<void>;

  // Chat messages (per session)
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<ChatMessage>;
  loadSessionMessages: (sessionId: string) => Promise<void>;

  // Loading state
  isLoading: boolean;

  // Sync helper
  refreshFromAPI: () => Promise<void>;

  // Auth
  signOut: () => Promise<void>;
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
    isOnboarded: data.is_onboarded ?? false,
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

function mapSessionFromAPI(data: any): ChatSession {
  return {
    id: data.id,
    title: data.title,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapChatFromAPI(data: any): ChatMessage {
  return {
    id: data.id,
    sessionId: data.session_id,
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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await refreshFromAPI();
        } else {
          setUserState(null);
          setMoodEntries([]);
          setJournalEntries([]);
          setChatSessions([]);
          setChatMessages([]);
          setCurrentSessionId(null);
          setIsOnboardedState(false);
          await Promise.all([
            safeRemoveItem(STORAGE_KEYS.USER),
            safeRemoveItem(STORAGE_KEYS.MOOD_ENTRIES),
            safeRemoveItem(STORAGE_KEYS.JOURNAL_ENTRIES),
            safeRemoveItem(STORAGE_KEYS.CHAT_SESSIONS),
            safeRemoveItem(STORAGE_KEYS.ONBOARDED),
          ]);
        }
      } catch {
        await loadFromStorage();
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFromStorage = async () => {
    try {
      const [userData, moodData, journalData, sessionsData, onboardedData] = await Promise.all([
        safeGetItem(STORAGE_KEYS.USER),
        safeGetItem(STORAGE_KEYS.MOOD_ENTRIES),
        safeGetItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        safeGetItem(STORAGE_KEYS.CHAT_SESSIONS),
        safeGetItem(STORAGE_KEYS.ONBOARDED),
      ]);

      if (userData) setUserState(JSON.parse(userData));
      if (moodData) setMoodEntries(JSON.parse(moodData));
      if (journalData) setJournalEntries(JSON.parse(journalData));
      if (sessionsData) setChatSessions(JSON.parse(sessionsData));
      if (onboardedData) setIsOnboardedState(JSON.parse(onboardedData));
    } catch {
      // Ignore storage failures
    }
  };

  const refreshFromAPI = async () => {
    try {
      const [userData, journalsData, moodsData, sessionsData] = await Promise.all([
        apiGet<any>('/api/users/me').catch(() => null),
        apiGet<any[]>('/api/journals').catch(() => []),
        apiGet<any[]>('/api/moods').catch(() => []),
        apiGet<any[]>('/api/chat/sessions').catch(() => []),
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

      const sessions = (sessionsData ?? []).map(mapSessionFromAPI);
      setChatSessions(sessions);
      await safeSetItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
    } catch {
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
    } catch {}

    const updated = journalEntries.map((j) => (j.id === id ? { ...j, ...entry } : j));
    setJournalEntries(updated);
    await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
  };

  const deleteJournalEntry = async (id: string) => {
    try {
      await apiDelete(`/api/journals/${id}`);
    } catch {}
    const updated = journalEntries.filter((j) => j.id !== id);
    setJournalEntries(updated);
    await safeSetItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
  };

  const getJournalEntryById = (id: string) => {
    return journalEntries.find((j) => j.id === id);
  };

  // ── Chat Sessions ───────────────────────────────

  const refreshChatSessions = async () => {
    try {
      const data = await apiGet<any[]>('/api/chat/sessions');
      const sessions = (data ?? []).map(mapSessionFromAPI);
      setChatSessions(sessions);
      await safeSetItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
    } catch {}
  };

  const createChatSession = async (title?: string): Promise<ChatSession> => {
    const data = await apiPost<any>('/api/chat/sessions', { title: title || 'New Chat' });
    const session = mapSessionFromAPI(data);
    setChatSessions((prev) => [session, ...prev]);
    setCurrentSessionId(session.id);
    setChatMessages([]);
    return session;
  };

  const deleteChatSession = async (id: string) => {
    try {
      await apiDelete(`/api/chat/sessions/${id}`);
    } catch {}
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
      setChatMessages([]);
    }
  };

  // ── Chat Messages (per session) ─────────────────

  const loadSessionMessages = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    try {
      const data = await apiGet<any[]>(`/api/chat/sessions/${sessionId}/messages`);
      const msgs = (data ?? []).map(mapChatFromAPI);
      setChatMessages(msgs);
    } catch {
      setChatMessages([]);
    }
  };

  const sendChatMessage = async (content: string): Promise<ChatMessage> => {
    if (!currentSessionId) {
      throw new Error('No active chat session');
    }

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: currentSessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);

    // Call API — this sends user msg + gets AI reply back
    const data = await apiPost<any>(
      `/api/chat/sessions/${currentSessionId}/messages`,
      { content },
    );
    const aiReply = mapChatFromAPI(data);

    // Replace temp message with real one and add AI reply
    // Reload all messages to get proper IDs
    try {
      const allData = await apiGet<any[]>(
        `/api/chat/sessions/${currentSessionId}/messages`,
      );
      const allMsgs = (allData ?? []).map(mapChatFromAPI);
      setChatMessages(allMsgs);
    } catch {
      setChatMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), aiReply]);
    }

    // Refresh sessions list to pick up title updates
    refreshChatSessions();

    return aiReply;
  };

  // ── Sign Out ────────────────────────────────────

  const signOut = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch {}
      await firebaseSignOut(auth);
    } catch {}
    setUserState(null);
    setMoodEntries([]);
    setJournalEntries([]);
    setChatSessions([]);
    setChatMessages([]);
    setCurrentSessionId(null);
    setIsOnboardedState(false);
    await Promise.all([
      safeRemoveItem(STORAGE_KEYS.USER),
      safeRemoveItem(STORAGE_KEYS.MOOD_ENTRIES),
      safeRemoveItem(STORAGE_KEYS.JOURNAL_ENTRIES),
      safeRemoveItem(STORAGE_KEYS.CHAT_SESSIONS),
      safeRemoveItem(STORAGE_KEYS.ONBOARDED),
    ]);
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
        chatSessions,
        currentSessionId,
        setCurrentSessionId,
        createChatSession,
        deleteChatSession,
        refreshChatSessions,
        chatMessages,
        sendChatMessage,
        loadSessionMessages,
        isLoading,
        refreshFromAPI,
        signOut,
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
