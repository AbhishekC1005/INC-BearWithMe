// BearWithMe Type Definitions

export interface User {
  id: string;
  name: string;
  nickname: string;
  sleepTime: string;
  wakeTime: string;
  workStartTime: string;
  workEndTime: string;
  stressors: string[];
  createdAt: string;
}

export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export interface MoodEntry {
  id: string;
  level: MoodLevel;
  intensity: number; // 1-10
  note: string;
  timestamp: string;
  triggers?: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodLevel;
  timestamp: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'adam';
  content: string;
  timestamp: string;
}

export interface Pattern {
  type: 'stress' | 'sleep' | 'mood' | 'routine';
  description: string;
  detectedAt: string;
  frequency: number;
}

export interface OnboardingData {
  step: number;
  name?: string;
  nickname?: string;
  sleepTime?: string;
  wakeTime?: string;
  workStartTime?: string;
  workEndTime?: string;
  stressors?: string[];
  initialMood?: MoodLevel;
}