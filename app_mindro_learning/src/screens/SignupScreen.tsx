// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) return Alert.alert('Invalid Email');
        if (password.length < 6) return Alert.alert('Password too short');
        if (password !== confirmPassword) return Alert.alert('Passwords do not match');
        navigation.navigate('MainTabs');
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <Text className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</Text>
            <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />
            <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />
            <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
            />
            <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl mb-4" onPress={handleSignup}>
                <Text className="text-white text-center font-semibold text-lg">Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-center text-indigo-600 font-medium">Already a member? Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignupScreen;