// src/modules/auth/authService.ts
// ============================================
// RESPONSIBILITY: Auth service functions
// - Wraps Firebase auth functions
// - Business logic for auth
// ============================================

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    inMemoryPersistence,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../lib/firebase';

// Login user
export const login = async (email: string, password: string) => {
    console.log('Login attempt Email:', email);
    console.log('Login attempt Password length:', password?.length);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Set persistence
// On React Native, auth is already initialized with AsyncStorage persistence (always remembered).
// If the user un-checks "Remember me", we switch to in-memory persistence (session only).
export const setPersistenceMode = async (rememberMe: boolean) => {
    if (!rememberMe) {
        return setPersistence(auth, inMemoryPersistence);
    }
    // When rememberMe is true, the AsyncStorage persistence set at init time is already in effect.
    // Nothing to do — just return.
};

// Send password reset email
export const sendResetPasswordEmail = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

// Logout
export const logout = async () => {
    return signOut(auth);
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Signup user
export const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });
    
    // Send verification email
    await sendEmailVerification(user);

    // Save profile data to Realtime Database (non-fatal — requires DB rules to be set)
    try {
        const profileRef = ref(database, `users/${user.uid}/profile`);
        await set(profileRef, {
            displayName,
            email,
            preferredCurrency: 'INR'
        });
    } catch (dbError) {
        // DB write failed (likely rules not set yet) — account is still created
        console.warn('Profile DB write failed (check database rules):', dbError);
    }

    return user;
};