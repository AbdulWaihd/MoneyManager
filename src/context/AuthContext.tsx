import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { User } from '../types/user.types';

// Define context shape

interface AuthContextType {
    currentUser: User | null;           // Logged in user or null
    uid: string | null;                 // User ID (shortcut for currentUser?.uid)
    isLoading: boolean;                 // True while checking auth state on app start
    error: string | null;               // Error message if auth failed
}
// Every AuthContext MUST contain these 4 values.
// these are later created in others 

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component - wraps the app
// React.ReactNode is a TypeScript type that means "anything React can render." It can be  <Stack>,<View>or <text>

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // EFFECT: Listen to auth state changes
    // This runs ONCE on app startup
    // Firebase returns the current user (if logged in) or null

    useEffect(() => {
        // onAuthStateChanged returns unsubscribe function
        // We call it on cleanup to prevent memory leaks
        // onAuthStateChanged is a Firebase listener. It watches the authentication state 24/7 and fires a callback every time something changes — user logs in, logs out, session expires, app restarts.
        // Without it you'd have to manually check if user is logged in on every screen.
        const unsubscribe = onAuthStateChanged(
            auth,
            //   Callback Firebase calls every time auth state changes. firebaseUser is either a Firebase user object or null.
            (firebaseUser) => {
                if (firebaseUser) {
                    // User is logged in - convert Firebase user to our User type-->why :bcz Firebase user is a huge object. We only want a few fields, so we create a new object that matches our User type.
                    setCurrentUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || '',
                    });
                    setError(null);
                } else {
                    // User is NOT logged in
                    setCurrentUser(null);
                    setError(null);
                }
                // Auth check complete - don't show splash screen anymore
                setIsLoading(false);
            },
            (error) => {
                // Auth check failed (network error, etc.)
                setError(error.message);
                setIsLoading(false);
            }
        );

        // Cleanup: unsubscribe from auth listener when component unmounts
        return unsubscribe;
    }, []);

    //   context value-passed to all children of this provider else AuthContext.Provider needs a single value prop to pass data down. You can't pass multiple separate things — only one value. So you package everything into one object first.
    const value: AuthContextType = {
        currentUser,
        uid: currentUser?.uid || null,
        isLoading,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

// Custom hook that provides easy, safe access to AuthContext.
// Acts as a wrapper around useContext(AuthContext) so components
// can access currentUser, uid, loading, and error state without
// importing AuthContext directly.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;

};


// ==========================================================
// AUTH FLOW - HOW EVERYTHING CONNECTS
// ==========================================================
//
// _layout.tsx
// <AuthProvider>
//    <Stack />
// </AuthProvider>
//
// Stack and all screens become "children" of AuthProvider.
//
// AuthProvider sits at the top of the app and manages
// authentication state globally.
//
// ==========================================================
// APP STARTUP FLOW
// ==========================================================
//
// App Starts
//      ↓
// AuthProvider mounts
//      ↓
// useEffect runs once
//      ↓
// onAuthStateChanged starts listening to Firebase Auth
//      ↓
// Firebase checks:
// "Is a user already logged in?"
//      ↓
// Returns:
// firebaseUser  OR  null
//
// ==========================================================
// IF USER IS LOGGED IN
// ==========================================================
//
// Firebase returns:
//
// {
//   uid: "abc123",
//   email: "user@gmail.com",
//   displayName: "John"
// }
//
//      ↓
//
// setCurrentUser({
//   uid,
//   email,
//   displayName
// })
//
//      ↓
//
// currentUser state updates
//      ↓
// AuthProvider re-renders
//      ↓
// Context value updates
//      ↓
// Every component using useAuth()
// automatically receives new data
//
// ==========================================================
// IF USER IS NOT LOGGED IN
// ==========================================================
//
// Firebase returns null
//
//      ↓
//
// setCurrentUser(null)
//
//      ↓
//
// App knows no user is authenticated
//
// ==========================================================
// LOGIN FLOW
// ==========================================================
//
// Login Screen
//      ↓
// loginUser(email, password)
//      ↓
// Firebase signs user in
//      ↓
// Firebase auth state changes internally
//      ↓
// onAuthStateChanged fires automatically
//      ↓
// setCurrentUser(...)
//      ↓
// Context updates
//      ↓
// All subscribed screens re-render
//      ↓
// Router redirects to Home Screen
//
// ==========================================================
// LOGOUT FLOW
// ==========================================================
//
// logoutUser()
//      ↓
// Firebase signs user out
//      ↓
// onAuthStateChanged fires automatically
//      ↓
// firebaseUser = null
//      ↓
// setCurrentUser(null)
//      ↓
// Context updates
//      ↓
// All screens know user is logged out
//
// ==========================================================
// CONTEXT VALUE
// ==========================================================
//
// The Provider stores:
//
// {
//   currentUser,
//   uid,
//   isLoading,
//   error
// }
//
// Any component can access this data using:
//
// const { currentUser, uid } = useAuth();
//
// No prop drilling required.
//
// ==========================================================
// useAuth()
// ==========================================================
//
// Custom hook that opens the AuthContext box.
//
// Internally:
// useAuth()
//      ↓
// useContext(AuthContext)
//      ↓
// Reads latest value from Provider
//
// Every component using useAuth()
// automatically subscribes to AuthContext.
//
// When context value changes:
//      ↓
// Component automatically re-renders.
//
// ==========================================================