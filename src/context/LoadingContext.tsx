import react, { createContext, useContext, useState } from 'react';
import{ActivityIndicator, View} from 'react-native';

// Define context shape
interface LoadingContextType {
    isLoading: boolean; // True when loading, false otherwise
    setIsLoading: (loading: boolean) => void; // Function to update loading state
}

// Create context with default values
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component - wraps the app
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading,setIsLoading]=useState(false);

    const value: LoadingContextType = { isLoading, setIsLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {isLoading &&(
                <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Appear above everything
          }}
        >
            <ActivityIndicator size="large" color="#0057bf" />
        </View>
            )}

        </LoadingContext.Provider>
    )
};

export const useLoading =(): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
