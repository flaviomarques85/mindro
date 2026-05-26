// src/screens/CodeVerificationScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { requestVerificationCode, verifyCode } from '../services/authService';

const CODE_LENGTH = 4;
const RESEND_INTERVAL = 60;

const CodeVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { userId, email } = route.params as { userId: string; email: string };

    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [timer, setTimer] = useState(RESEND_INTERVAL);
    const [status, setStatus] = useState<'default' | 'success' | 'error'>('default');
    const inputs = useRef<Array<TextInput | null>>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startTimer = () => {
        clearTimer();
        setTimer(RESEND_INTERVAL);
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return clearTimer;
    }, []);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setStatus('default');

        if (value && index < CODE_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }

        if (newCode.every((digit) => digit !== '')) {
            Keyboard.dismiss();
            handleVerify(newCode.join(''));
        }
    };

    const handleVerify = async (joinedCode: string) => {
        try {
            await verifyCode(userId, joinedCode);
            setStatus('success');
            setTimeout(() => navigation.navigate('Onboarding'), 1000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => {
                setCode(Array(CODE_LENGTH).fill(''));
                setStatus('default');
                inputs.current[0]?.focus();
            }, 3000);
        }
    };

    const getBorderColor = () => {
        if (status === 'success') return 'border-green-500';
        if (status === 'error') return 'border-red-500';
        return 'border-gray-300';
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2">OTP Verification</Text>
            <Text className="text-gray-600 mb-8 text-center">
                Enter the verification code sent to <Text className="font-semibold">{email}</Text>
            </Text>

            <View className="flex-row justify-center gap-3 mb-6">
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            inputs.current[index] = ref;
                        }}
                        value={digit}
                        onChangeText={val => handleChange(val, index)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
                                inputs.current[index - 1]?.focus();
                            }
                        }}
                        keyboardType="number-pad"
                        maxLength={1}
                        textContentType="oneTimeCode"
                        className={`w-16 h-16 text-2xl font-bold text-center border rounded-xl ${getBorderColor()}`}
                    />

                ))}
            </View>
            {/* Status icons */}
            {status === 'success' && (
                <View className="items-center mb-4">
                    <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
                </View>
            )}
            {status === 'error' && (
                <View className="items-center mb-4">
                    <Ionicons name="close-circle" size={40} color="#ef4444" />
                </View>
            )}

            {timer > 0 ? (
                <Text className="text-center text-gray-500">Resend code in {timer}s</Text>
            ) : (
                <TouchableOpacity
                    onPress={async () => {
                        try {
                            await requestVerificationCode(userId);
                            startTimer();
                            Alert.alert('Code Sent', `A new code was sent to ${email}`);
                        } catch (error) {
                            Alert.alert('Error', 'Could not resend the code.');
                        }
                    }}
                >
                    <Text className="text-center text-indigo-600 font-medium">Resend Code</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default CodeVerificationScreen;
