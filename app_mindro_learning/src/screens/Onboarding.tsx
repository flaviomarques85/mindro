import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { setSeenOnboarding } from '../services/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { cn } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    LanguageSelector: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'The lessons you need to learn',
        subtitle: 'Practice every day to improve your fluency.',
        image: require('../assets/onboarding1.png'),
    },
    {
        key: '2',
        title: 'Take your time to learn',
        subtitle: 'You choose the pace, we provide the guidance.',
        image: require('../assets/onboarding2.png'),
    },
    {
        key: '3',
        title: 'Confidence in your words',
        subtitle: 'Build your vocabulary and speak with confidence.',
        image: require('../assets/onboarding3.png'),
    },
];

const Onboarding = () => {
    const [currentIndex, setCurrentIndex] = useState<any>(0);
    const navigation = useNavigation<any>();

    const handleContinue = async () => {
        //await setSeenOnboarding();
        navigation.navigate('MainTabs');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={{ width }} className="items-center justify-center px-6">
                        <Image source={item.image} className="w-72 h-72 mb-6" resizeMode="contain" />
                        <Text className="text-2xl font-bold text-center text-gray-800 mb-2">{item.title}</Text>
                        <Text className="text-base text-center text-gray-600">{item.subtitle}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.key}
            />
            <View className="flex-row justify-center mt-4">
                {slides.map((_, i) => (
                    <View
                        key={i}
                        className={`h-2 w-2 mx-1 rounded-full ${i === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                    />

                ))}
            </View>
            {currentIndex === slides.length - 1 && (
                <View className="p-6">
                    <TouchableOpacity onPress={handleContinue} className="bg-indigo-600 py-3 rounded-xl">
                        <Text className="text-white text-center font-semibold text-lg">Começar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Onboarding;
