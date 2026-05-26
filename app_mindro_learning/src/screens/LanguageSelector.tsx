// src/screens/LanguageSelector.tsx
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const languages = [
    { id: 'en', name: 'English', icon: require('../assets/flags/en.png'), disabled: true },
    { id: 'es', name: 'Spanish', icon: require('../assets/flags/es.png'), disabled: false },
    { id: 'fr', name: 'French', icon: require('../assets/flags/fr.png'), disabled: false },
    { id: 'de', name: 'German', icon: require('../assets/flags/de.png'), disabled: true },
    { id: 'it', name: 'Italian', icon: require('../assets/flags/it.png'), disabled: false },
];

const LanguageSelector = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleContinue = () => {
        if (!selected) return;
        alert("Your request has been successfully sent to the teacher.")
        navigation.navigate('MainTabs');
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 py-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
                <Ionicons name="chevron-back" size={24} color="#4f46e5" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">Choose a language</Text>
            <FlatList
                data={languages}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ alignItems: 'center' }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => !item.disabled && handleSelect(item.id)}
                        disabled={item.disabled}
                        className={`w-36 h-36 m-2 items-center justify-center rounded-2xl border ${selected === item.id ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'
                            } ${item.disabled ? 'opacity-40' : ''}`}
                    >
                        <Image source={item.icon} className="w-12 h-12 mb-2" resizeMode="contain" />
                        <Text className={`font-medium ${item.disabled ? 'text-gray-400' : 'text-gray-800'}`}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                disabled={!selected}
                onPress={handleContinue}
                className={`mt-10 py-3 rounded-xl ${selected ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
            >
                <Text className="text-white text-center font-semibold text-lg">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LanguageSelector;
