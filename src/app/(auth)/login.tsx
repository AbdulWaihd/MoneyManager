import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { loginUser } from '../../modules/auth/authService';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { loginSchema } from '../../modules/auth/authSchemas';
import { z } from 'zod';


// TypeScript automatically creates an error object from LoginFormData
// type FormErrors = Partial<Record<keyof LoginFormData, string>> & { general?: string };
type FormErrors = {
    email?: string;
    password?: string;
    general?: string;
};

type Test1 = z.ZodError;
type Test2 = z.ZodIssue;

export default function LoginScreen() {
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    // obj.property===obj["property"]--->Because sometimes we don't know the property name beforehand.

    // field as keyof FormErrors---> type assertion-->TypeScript, trust me I know field is a valid key of FormErrors

    const handleInputChange = (field: keyof FormErrors, value: string | boolean) => {
        // field: keyof LoginFormData---> annotation to tell TypeScript that field is a valid key of LoginFormData
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear the error for the field when user starts typing
        if (errors[field as keyof FormErrors]) {
            // field as keyof FormErrors---> assertion to tell TypeScript that field is a valid key of FormErrors
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    // Run Zod Schema 
    // Zod found errors
    //       ↓
    // error.errors contains them in an array
    //       ↓
    // Loop through each error object
    //       ↓
    // Get field name from path[0]
    //       ↓
    // Get message from message
    //       ↓
    // Store them in newErrors object
    //       ↓
    // setErrors(newErrors)
    const validateForm = (): boolean => {
        try {
            loginSchema.parse(formData);
            setErrors({});
            return true;
        }
        catch (error) {
            // Is this actually a ZodError
            if (error instanceof z.ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach(err => {
                    const field = err.path[0] as keyof FormErrors;
                    newErrors[field] = err.message;
                    // zod creates path and msg when the zod validation fails, so we can use them to create our own error object
                });
                setErrors(newErrors);
            }
            return false;
        }
    };
    const getFirebaseErrorMessage = (message: string): string => {
        if (message.includes('user-not-found')) return 'No account found with this email';
        if (message.includes('wrong-password')) return 'Incorrect password';
        if (message.includes('too-many-requests')) return 'Too many failed attempts. Try again later';
        if (message.includes('verify your email')) return 'Please verify your email before logging in';
        return 'Login failed. Please try again';
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setIsLoading(true);
        

    }
}