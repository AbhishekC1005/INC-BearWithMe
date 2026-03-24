// Navigation types
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type JournalStackParamList = {
  JournalsList: undefined;
  JournalWriting: undefined;
  JournalStep3: undefined;
  JournalCompleted: undefined;
};

export type MainTabParamList = {
  Home: { nickname?: string } | undefined;
  Chat: undefined;
  Journals: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  OnboardingStep1: undefined;
  OnboardingStep2:
    | {
        nickname?: string;
        birthday?: string;
        gender?: string;
        chatStyle?: string;
      }
    | undefined;
  OnboardingStep3:
    | {
        nickname?: string;
        birthday?: string;
        gender?: string;
        chatStyle?: string;
        occupation?: string;
        sleepTime?: string;
        wakeUpTime?: string;
        habit?: string;
      }
    | undefined;
  OnboardingComplete:
    | {
        nickname?: string;
      }
    | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Domain types
export interface User {
  id?: string;
  name: string;
  nickname?: string;
  birthday?: string;
  gender?: string;
  chatStyle?: string;
  occupation?: string;
  sleepTime?: string;
  wakeTime?: string;
  workStartTime?: string;
  workEndTime?: string;
  stressors?: string[];
  createdAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodLevel;
  timestamp: string;
}

export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export interface MoodEntry {
  id: string;
  timestamp: string;
  level: MoodLevel;
  intensity: number;
  note?: string;
  triggers: string[];
}

export type ChatRole = 'user' | 'adam';

export interface ChatMessage {
  id: string;
  timestamp: string;
  role: ChatRole;
  content: string;
}

export type PatternType = 'mood' | 'stress' | 'sleep' | 'routine';

export interface Pattern {
  type: PatternType;
  description: string;
  detectedAt: string;
  frequency: number;
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

export interface OnboardingData {
  nickname: string;
  birthday: string;
  chatStyle: string;
  occupation: string;
  sleepTime: string;
  wakeUpTime: string;
  habit: string;
  stressTriggers: string[];
}
