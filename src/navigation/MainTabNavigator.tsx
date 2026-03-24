import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomNav from '../components/BottomNav';
import { MainTabParamList, JournalsStackParamList } from '../types';

import HomeScreen from '../../screens/HomeScreen';
import ChatScreen from '../../screens/ChatScreen';
import JournalsScreen from '../../screens/JournalsScreen';
import JournalDetailScreen from '../../screens/JournalDetailScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const JournalsStack = createNativeStackNavigator<JournalsStackParamList>();

const JournalsStackNavigator = () => {
  return (
    <JournalsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <JournalsStack.Screen name="JournalsList" component={JournalsScreen} />
      <JournalsStack.Screen name="JournalDetail" component={JournalDetailScreen} />
    </JournalsStack.Navigator>
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
      <Tab.Screen name="Journals" component={JournalsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
