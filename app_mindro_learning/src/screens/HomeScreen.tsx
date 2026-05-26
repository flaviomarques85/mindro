// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Animated, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUserLessons, Lesson } from '../services/lessonService';
import { getUserCourses, Course } from '../services/courseService';
import { getUserTasks, Task } from '../services/taskService';
import { useUser } from '../context/UserContext';

const HomeScreen = () => {
    const { user } = useUser();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [progressRatio, setProgressRatio] = useState(0);
    const [formattedProgressText, setFormattedProgressText] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const animatedWidth = useRef(new Animated.Value(0)).current;

    // Função para carregar dados do usuário
    const fetchData = async () => {
        try {
            if (!user?.id) return;

            const [userLessons, userCourses, userTasks] = await Promise.all([
                getUserLessons(user.id),
                getUserCourses(user.id),
                getUserTasks(user.id),
            ]);

            setLessons(userLessons);
            setCourses(userCourses);

            const totalProgress = userTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
            const goalMinutes = userTasks.length * 100;
            const completedMinutes = Math.round(totalProgress);

            const formatTime = (minutes: number) => {
                const hrs = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hrs}:${mins.toString().padStart(2, '0')}h`;
            };

            const ratio = goalMinutes > 0 ? totalProgress / goalMinutes : 0;
            setProgressRatio(ratio);
            setFormattedProgressText(
                `This week: ${formatTime(completedMinutes)} of ${Math.round(goalMinutes / 60)}h goal`
            );

            Animated.timing(animatedWidth, {
                toValue: ratio,
                duration: 600,
                useNativeDriver: false,
            }).start();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    // Recarrega os dados ao voltar à tela
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [user])
    );

    // Pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const animatedStyle = {
        width: animatedWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
    };

    // Exibe loading inicial se nada carregado
    if (!courses.length && !lessons.length && !formattedProgressText && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Carregando dados...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Saudação */}
                <View className="mb-4 items-end">
                    <Text className="text-xs font-bold text-gray-700">Hello, {user?.name ?? '...'}</Text>
                </View>

                {/* Cursos */}
                <Text className="text-xl font-bold text-gray-800 mb-2">Enabled Courses</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {courses.map((course) => (
                        <View key={course.id} className="mr-4 w-48">
                            <Image source={course.image} className="w-full h-28 rounded-xl mb-2" resizeMode="cover" />
                            <Text className="font-semibold text-gray-800">{course.title}</Text>
                            <Text className="text-sm text-gray-500">Level: {course.level}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Lições */}
                <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Upcoming Lessons</Text>
                {lessons.map((lesson) => (
                    <View key={lesson.id} className="flex-row items-center bg-gray-100 rounded-xl p-4 mb-3">
                        <View>
                            <Text className="text-gray-500 mr-4">{lesson.date}</Text>
                            <Text className="text-gray-500 mr-4">{lesson.time}</Text>
                        </View>
                        <View className="flex-1 flex-row items-center">
                            <Image source={lesson.flag} className="w-6 h-6 mr-2" resizeMode="contain" />
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-800">{lesson.language}</Text>
                                <Text className="text-sm text-gray-500">{lesson.weekday}</Text>
                            </View>
                        </View>
                        <View className={`ml-2 px-2 py-1 rounded-full ${lesson.status === 'Confirmed' ? 'bg-green-500' : lesson.status === 'Finished' ? 'bg-purple-800 text-purple-100' : 'bg-orange-500'}`}>
                            <Text className="text-white text-xs">{lesson.status}</Text>
                        </View>
                    </View>
                ))}

                {/* Progresso semanal */}
                <Text className="text-xl font-bold text-gray-800 mt-8 mb-2">Your Week Progress</Text>
                <View className="bg-indigo-100 p-4 rounded-xl">
                    <Text className="text-sm text-gray-700">{formattedProgressText}</Text>
                    <View className="bg-indigo-300 h-2 w-full rounded-full mt-2 overflow-hidden">
                        <Animated.View className="bg-indigo-600 h-2 rounded-full" style={animatedStyle} />
                    </View>
                    {progressRatio < 0.5 && (
                        <Text className="text-xs text-red-500 mt-2 font-medium">
                            Let’s go! Complete your tasks to reach this week’s goal!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
