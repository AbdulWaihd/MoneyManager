// Purpose: Entry point. Logged-in users skip to home. Guests see landing page.

// 1. Problem: Unauthenticated users are redirected directly to Login, so the Landing Page never renders.
//    Fix: Let index.tsx render the Landing Page for guests and only redirect authenticated users to Home.

// 2. Problem: Using router.replace() inside useEffect redirects after rendering, causing unnecessary screen flashes.
//    Fix: Use <Redirect /> during render so navigation happens immediately without rendering the wrong screen first.

// 3. Problem: Relative routes (e.g., "home") can break when folders or route groups change.
//    Fix: Always use absolute paths (e.g., "/(app)/home") for predictable and maintainable navigation.

// 4. Problem: Every user sees the loading spinner before navigation, even when the destination is already known.
//    Fix: Show the spinner only while auth status is unresolved; once resolved, immediately render the Landing Page or redirect to Home.

import { Redirect, useRouter } from "expo-router";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../constants/colors";
import {TYPOGRAPHY} from "../constants/typography";

export default function Index() {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    // Return 1: Firebase hasn't resolved yet. Wait.
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // Return 2: User is logged in. Skip landing. Go straight to home.
    if (currentUser?.uid) {
        return <Redirect href="/(app)/home" />;
    }

    // Return 3: No user. Show landing page to guest.
    return (
        <View className="flex-1 justify-between bg-background px-xl py-2xl">

            {/* App identity */}
            <View className="flex-1 justify-center items-center gap-md">
                <Text className="font-heading text-3xl font-bold text-text-dark text-center"
                style={{ fontFamily: TYPOGRAPHY.fonts.heading }}
                >
                    Expense Tracker
                </Text>
                <Text className="font-body text-sm text-text-light text-center leading-relaxed"

                >
                    Track expenses. {"\n"}Generate reports.{"\n"}Manage budgets.
                </Text>
            </View>

            {/* Actions */}
            <View className="gap-md">
                <TouchableOpacity
                    className="bg-primary py-lg rounded-lg items-center"
                    onPress={() => router.push("/(auth)/signup")}
                >
                    <Text className="font-body text-md font-bold text-surface">
                        Get Started
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-surface py-lg rounded-lg items-center border border-primary"
                    onPress={() => router.push("/(auth)/login")}
                >
                    <Text className="font-body text-md font-medium text-primary">
                        Login
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}