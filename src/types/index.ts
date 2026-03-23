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
  Home: undefined;
  Chat: undefined;
  Journals: NavigatorScreenParams<JournalStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  OnboardingStep1: undefined;
  OnboardingStep2: undefined;
  OnboardingStep3: undefined;
  OnboardingComplete: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Domain types
export interface JournalEntry {
  id: string;
  day: string;
  month: string;
  title: string;
  date: Date;
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
