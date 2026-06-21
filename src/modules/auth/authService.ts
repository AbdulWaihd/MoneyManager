// src/services/firebase/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUserProfile } from '../../lib/database';



// Sign Up
export const signupUser = async (
    email: string,
    password: string,
    displayName: string,
    preferredCurrency: string = 'INR'
) => {

    // Sends email + password to Firebase. If successful, returns the user credential object. If there's an error (like email already in use), it will throw an error.
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // This takes userCredential.user (the user we just created) and attaches the display name to it.
    await updateProfile(userCredential.user, { displayName });

    // Create user profile in Realtime Database
    // This stores app-specific data (currency, etc.)
    await createUserProfile(userCredential.user.uid, {
        displayName,
        email,
        preferredCurrency,
    });

    // Send verification email
    await sendEmailVerification(userCredential.user);

    return userCredential.user;
};

// Login
export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in');
    }
    return userCredential.user;
};

// Logout
export const logoutUser = async () => {
    await signOut(auth);
};

// Reset Password
export const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};



export const changePassword = async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user logged in');

    try {
        // EmailAuthProvider is a Firebase class that creates a credential object — basically a package that bundles email and password together in a format Firebase understands for re-authentication.
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    } catch (error: any) {
        // Firebase error codes
        if (error.code === 'auth/wrong-password') {
            throw new Error('Current password is incorrect');
        }
        if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many attempts. Try again later');
        }
        // Unknown error — rethrow as is
        throw error;
    }

};
// Delete Account
export const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Delete Firebase Auth user
    await deleteUser(user);
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};