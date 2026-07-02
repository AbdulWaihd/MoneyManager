import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SettingsScreen, ChangePasswordScreen, ContactUsScreen } from '@/modules/settings';

export default function SettingsRoute() {
    const params = useLocalSearchParams();
    
    if (params.action === 'change-password') {
        return <ChangePasswordScreen />;
    }
    
    if (params.action === 'contact-us') {
        return <ContactUsScreen />;
    }
    
    return <SettingsScreen />;
}