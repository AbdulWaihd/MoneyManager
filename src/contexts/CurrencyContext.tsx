// src/context/CurrencyContext.tsx

// RESPONSIBILITY: Manage currency selection and conversion
// - Fetches live exchange rates from API
// - Converts amounts from INR to selected currency
// - Persists currency choice


import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define supported currencies
type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

// Define exchange rates shape
interface ExchangeRates {
    USD: number;
    EUR: number;
    GBP: number;
    INR: number;
}

// Define context shape--->"If an object claims to be CurrencyContextType, it must contain these properties."
interface CurrencyContextType {
    currency: Currency;                      // There must be a property called currency.Its value must follow the Currency type.
    // type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
    rates: ExchangeRates;                    // Exchange rates (INR as base)
    convert: (amountInINR: number) => number; //There must be a function called convert.Receives:a number Returns: a number
    setCurrency: (currency: Currency) => void; // There must be a function called setCurrency. Receives: a Currency Returns: void (nothing)
    isLoading: boolean;                      // True while fetching rates
    error: string | null;                    // Error loading rates
}

// Create context
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider component
export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {

    const [currency, setCurrencyState] = useState<Currency>('INR');
    const [rates, setRates] = useState<ExchangeRates>({
        USD: 1 / 83,
        EUR: 1 / 90,
        GBP: 1 / 105,
        INR: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // EFFECT 1: Load currency choice + fetch exchange rates on app start
    useEffect(() => {
        const loadCurrency = async () => {
            try {
                // Load saved currency choice
                const savedCurrency = await AsyncStorage.getItem('app-currency');
                if (savedCurrency === 'USD' || savedCurrency === 'EUR' || savedCurrency === 'GBP' || savedCurrency === 'INR') {
                    setCurrencyState(savedCurrency);
                }

                // Fetch live exchange rates from exchangerate.host API
                // Using INR as base (convert INR to other currencies)
                const response = await fetch(
                    'https://api.exchangerate-api.com/v4/latest/INR'
                );

                if (!response.ok) throw new Error('Failed to fetch rates');

                const data = await response.json();

                // Extract rates (API returns rates object)
                const newRates: ExchangeRates = {
                    INR: 1,
                    USD: data.rates.USD,
                    EUR: data.rates.EUR,
                    GBP: data.rates.GBP,
                };

                setRates(newRates);
                setError(null);
            } catch (err) {
                console.error('Currency fetch error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Keep using default rates on error
            } finally {
                setIsLoading(false);
            }
        };

        loadCurrency();
    }, []);

    // FUNCTION: Convert amount from INR to selected currency
    // Example: convert(10000) might return 120 if currency is USD
    const convert = (amountInINR: number): number => {
        const rate = rates[currency];
        return amountInINR * rate;
    };

    // FUNCTION: Change currency and persist
    const setCurrency = async (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        try {
            await AsyncStorage.setItem('app-currency', newCurrency);
        } catch (err) {
            console.error('Failed to save currency:', err);
        }
    };

    // Context value
    const value: CurrencyContextType = {
        currency,
        rates,
        convert,
        setCurrency,
        isLoading,
        error,
    };
    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};



// CUSTOM HOOK: Access currency anywhere
// Example: const { currency, convert } = useCurrency();
export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used inside CurrencyProvider');
    }
    return context;
};



// Line by line:
// LineWhatWhycurrency: CurrencyCurrent currency selection (USD, EUR, etc.)So UI knows which currency to display
// rates: ExchangeRatesAll exchange ratesSo convert() can look up the
// rateconvert: (amountInINR: number) => numberFunction that takes INR amount, returns converted amountSo screens can convert ₹10000 → $120setCurrency: (currency: Currency) => voidFunction to change currencySo settings screen can change
// currencyisLoading: booleanTrue while API is fetching ratesSo UI can show loading s
// pinnererror: string | nullError message if API failsSo UI can show error to user