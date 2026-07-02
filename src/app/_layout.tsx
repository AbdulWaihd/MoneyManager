import "../../global.css";
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { LoadingProvider } from '../contexts/LoadingContext';

import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ flex: 1, maxWidth: 600, width: '100%', alignSelf: 'center', backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 }}>
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
      </View>
    </View>
  );
}