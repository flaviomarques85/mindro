// src/screens/LoginScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { getUserByEmail } from '../services/userService';
import { requestVerificationCode } from '../services/authService';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    // Função para criar a animação de tremor
    const startShakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Efeito para executar a animação a cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            startShakeAnimation();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = async () => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }

        setLoading(true);
        try {
            const user = await getUserByEmail(email);
            setUser(user);
            await requestVerificationCode(user.id);
            navigation.navigate('CodeVerification', { userId: user.id, email: user.email });
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'User not found.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <View className="items-center mb-6">
                <Animated.View
                    style={{
                        transform: [{ translateX: shakeAnimation }],
                    }}
                >
                    <Image
                        source={require('../assets/splash-icon.png')}
                        style={{
                            width: 210,
                            height: 250,
                            resizeMode: 'contain',
                        }}
                    />
                </Animated.View>
            </View>
            <Text className="text-3xl font-bold text-center text-gray-800 mb-8">Login</Text>
            <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
            />
            <TouchableOpacity
                className={`bg-indigo-600 py-3 rounded-xl mb-4 ${loading ? 'opacity-50' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text className="text-white text-center font-semibold text-lg">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;
