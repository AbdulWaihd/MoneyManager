import "../global.css";
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { CurrencyProvider } from '../src/context/CurrencyContext';
import { LoadingProvider } from '../src/context/LoadingContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <LoadingProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
              </Stack>
            </LoadingProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}