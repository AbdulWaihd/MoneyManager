// src/context/ThemeContext.tsx
// ============================================
// RESPONSIBILITY: Manage theme (light/dark mode)
// - Reads theme from AsyncStorage on startup
// - Persists theme choice when user toggles
// - Applied via Tailwind dark: classes
// ============================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme type (only two options)
type Theme = 'light' | 'dark';

// Define context shape
interface ThemeContextType {
    theme: Theme;           // Current theme: 'light' or 'dark'
    toggleTheme: () => void; // Function to switch theme
    isLoading: boolean;     // True while loading from AsyncStorage
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isLoading, setIsLoading] = useState(true);

    // EFFECT 1: Load theme from device storage on app start
    useEffect(() => {
        const loadTheme = async () => {
            try {
                // Read saved theme from AsyncStorage
                const savedTheme = await AsyncStorage.getItem('app-theme');

                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setTheme(savedTheme);
                    applyTheme(savedTheme);
                } else {
                    // No saved theme, default to light
                    setTheme('light');
                    applyTheme('light');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
                setTheme('light');
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, []);

    // FUNCTION: Apply theme to app
    // In React Native, this updates Tailwind's dark class
    const applyTheme = (newTheme: Theme) => {
        // For web (Expo Web): update document class
        if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    // FUNCTION: Toggle theme and persist
    const toggleTheme = async () => {
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);

        // Save to device storage
        try {
            await AsyncStorage.setItem('app-theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    // Context value
    const value: ThemeContextType = {
        theme,
        toggleTheme,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// CUSTOM HOOK: Access theme anywhere
// Example: const { theme, toggleTheme } = useTheme();
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return context;
};