// src/navigation/index.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import Onboarding from '../screens/Onboarding';
import LanguageSelector from '../screens/LanguageSelector';
import AuthNavigator from '../screens/AuthNavigator';
import MainTabs from '../screens/MainTabs';
import LoginScreen from '../screens/LoginScreen'
import TaskQuizScreen from '../screens/TaskQuizScreen';
import TaskVocabularyScreen from '../screens/TaskVocabularyScreen';
import CodeVerificationScreen from '../screens/CodeVerificationScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const [initialRoute, setInitialRoute] = useState<'Splash' | 'Onboarding' | 'LanguageSelector' | 'Auth' | 'MainTabs'>('Splash');

    useEffect(() => {
        const checkOnboarding = async () => {
            const seen = await getSeenOnboarding();
            setInitialRoute(seen ? 'LanguageSelector' : 'Onboarding');
        };
        checkOnboarding();
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="LanguageSelector" component={LanguageSelector} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} />
            <Stack.Screen name="TaskQuiz" component={TaskQuizScreen} />
            <Stack.Screen name="TaskVocabulary" component={TaskVocabularyScreen} />

        </Stack.Navigator>
    );
};

export default RootNavigator;
