// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

const SplashScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useUser();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (user) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [user]);

    return (
        <SafeAreaView className="flex-1 bg-indigo-800 items-center justify-center">
            <Image
                source={require('../assets/splash-icon.png')}
                className="w-48 h-48"
                resizeMode="contain"
            />
        </SafeAreaView>
    );
};

export default SplashScreen;