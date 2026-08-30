import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';
import LandingHero from '../components/common/LandingHero';

export default function Index() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (currentUser?.uid) {
        if (!currentUser.emailVerified) {
            return <Redirect href="/(auth)/verify-email" />;
        }
        return <Redirect href="/(app)/home" />;
    }

    return <LandingHero />;
}