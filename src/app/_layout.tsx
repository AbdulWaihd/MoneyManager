import "../global.css";
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { LoadingProvider } from '../contexts/LoadingContext';

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