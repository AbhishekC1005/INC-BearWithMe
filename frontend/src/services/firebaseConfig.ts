// Firebase configuration for React Native
// Replace the placeholder values with your Firebase project config.
// Find them at: Firebase Console → Project Settings → General → Your apps → Web app

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-ignore – export exists at runtime, types lag behind
  getReactNativePersistence,
} from 'firebase/auth';
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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use initializeAuth with AsyncStorage persistence so auth state
// survives app restarts (fixes the Firebase WARN about memory persistence).
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Already initialized (hot-reload) — grab existing instance
  auth = getAuth(app);
}

export { app, auth };
export default firebaseConfig;
