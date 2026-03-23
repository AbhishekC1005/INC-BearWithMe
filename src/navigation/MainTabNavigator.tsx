import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomNav from '../components/BottomNav';
import { JournalStackParamList, MainTabParamList } from '../types';

import HomeScreen from '../../screens/HomeScreen';
import ChatScreen from '../../screens/ChatScreen';
import JournalsScreen from '../../screens/JournalsScreen';
import JournalWritingScreen from '../../screens/JournalWritingScreen';
import JournalStep3Screen from '../../screens/JournalStep3Screen';
import JournalCompletedScreen from '../../screens/JournalCompletedScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const JournalStack = createNativeStackNavigator<JournalStackParamList>();

const JournalNavigator = () => {
  return (
    <JournalStack.Navigator screenOptions={{ headerShown: false }}>
      <JournalStack.Screen name="JournalsList" component={JournalsScreen} />
      <JournalStack.Screen name="JournalWriting" component={JournalWritingScreen} />
      <JournalStack.Screen name="JournalStep3" component={JournalStep3Screen} />
      <JournalStack.Screen name="JournalCompleted" component={JournalCompletedScreen} />
    </JournalStack.Navigator>
  );
};

const tabKeyFromRoute = (routeName: keyof MainTabParamList) => {
  if (routeName === 'Home') return 'Home';
  if (routeName === 'Chat') return 'Adam';
  if (routeName === 'Journals') return 'Journal';
  return 'Therapist';
};

const routeFromTabKey = (tab: 'Home' | 'Adam' | 'Journal' | 'Therapist'): keyof MainTabParamList => {
  if (tab === 'Home') return 'Home';
  if (tab === 'Adam') return 'Chat';
  if (tab === 'Journal') return 'Journals';
  return 'Profile';
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => (
        <BottomNav
          active={tabKeyFromRoute(state.routeNames[state.index] as keyof MainTabParamList)}
          onTabPress={tab => navigation.navigate(routeFromTabKey(tab))}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Journals" component={JournalNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
