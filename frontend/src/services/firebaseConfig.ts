// Firebase configuration for React Native
// Replace the placeholder values with your Firebase project config.
// Find them at: Firebase Console → Project Settings → General → Your apps → Web app

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore – react-native async storage persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC5czagzIpJKHN9Hi-VDRAjuGWw_ycAa0U',
  authDomain: 'bearwithme-822a7.firebaseapp.com',
  projectId: 'bearwithme-822a7',
  storageBucket: 'bearwithme-822a7.firebasestorage.app',
  messagingSenderId: '585485707727',
  appId: '1:585485707727:web:5632fd13505f5a81140aba',
  measurementId: 'G-EPLN6YHENB',
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use standard getAuth for React Native
const auth = getAuth(app);

export { app, auth };
export default firebaseConfig;
