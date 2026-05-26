import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getUserTasks, Task } from '../services/taskService';

const TasksScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const taskRoutes: Record<string, string> = {
        quiz: 'TaskQuiz',
        vocabulary: 'TaskVocabulary',
    };

    const loadTasks = async () => {
        if (!user?.id) return;
        try {
            const fetchedTasks = await getUserTasks(user.id);
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [user])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        loadTasks();
    };

    const handlePress = (task: Task) => {
        if (task.status === 'Completed') return;
        const route = taskRoutes[task.description];
        if (route) {
            navigation.navigate(route, {
                task,
                language: 'English',
                level: 'B1',
            });
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading tasks...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white px-4 py-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Weekly Tasks</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item)} className="mb-4">
                        <View className="p-4 border border-gray-200 rounded-xl">
                            <Text className="font-semibold text-gray-800 mb-1">{item.title}</Text>
                            <Text className="text-sm text-gray-500 mb-1">Status: {item.status}</Text>
                            <View className="bg-gray-200 h-2 rounded-full">
                                <View
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-8">No tasks found.</Text>
                }
            />
        </SafeAreaView>
    );
};

export default TasksScreen;
