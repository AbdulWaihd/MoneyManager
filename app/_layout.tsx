import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
const Layout = () => {
    return (
        <Stack>
                <Stack.Screen name="Home" options={{ headerShown: false }} />
        </Stack>
    );
}



export default Layout;
