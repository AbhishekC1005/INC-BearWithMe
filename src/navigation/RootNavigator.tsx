import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StatusBar } from 'react-native';
import { RootStackParamList } from '../types';
import { MainTabNavigator } from './MainTabNavigator';

// Auth Screens
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../SignUpScreen';

// Onboarding Screens
import OnboardingStep1 from '../../screens/OnboardingStep1';
import OnboardingStep2 from '../../screens/OnboardingStep2';
import OnboardingStep3 from '../../screens/OnboardingStep3';
import OnboardingComplete from '../../screens/OnboardingComplete';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
        },
      }}
      initialRouteName="Login"
    >
      {/* Auth Flow */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Onboarding Flow */}
      <Stack.Screen name="OnboardingStep1" component={OnboardingStep1} />
      <Stack.Screen name="OnboardingStep2" component={OnboardingStep2} />
      <Stack.Screen name="OnboardingStep3" component={OnboardingStep3} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingComplete} />

      {/* Main App Flow */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};
