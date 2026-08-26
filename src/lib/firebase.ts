// src/lib/firebase.ts
// ============================================
// RESPONSIBILITY: Core Firebase initialization
// - Initialize Firebase app
// - Export auth and database instances
// ============================================

import { initializeApp } from 'firebase/app';
// @ts-ignore - TS doesn't resolve react-native exports correctly by default
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize auth with AsyncStorage persistence---->This line initializes Firebase Authentication AND tells it: "Save the user's login session to AsyncStorage so they stay logged in even if the app closes."

// initializeAuth()---->A Firebase function that sets up the Authentication module.

// It takes 2 parameters:

// app — the Firebase app instance (from line 18)
// { persistence: ... } — configuration object (options)

// Returns An Auth object — the authentication module you use for login, logout, etc.
// The Configuration Object--->  persistence: getReactNativePersistence(AsyncStorage),

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  // getReactNativePersistence()---->A Firebase function that creates a "persistence adapter" — a bridge between Firebase and React Native.
});



export const database = getDatabase(app);

export default app;