// src/screens/TaskQuizScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getQuizQuestions, QuizQuestion } from '../services/taskQuizService';
import { Task, updateUserTaskProgress } from '../services/taskService';

const { width } = Dimensions.get('window');

const TaskQuizScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { task, language, level } = route.params as { task: Task; language: string; level: string };

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuizQuestions(level, language)
            .then(setQuestions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        if (option === questions[currentIndex].answer) {
            setCorrectCount((prev) => prev + 1);
        }
        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                updateProgressAndFinish(); // atualiza e termina
            }
        }, 1000);
    };

    const updateProgressAndFinish = async () => {
        try {
            const newProgress = Math.min(task.progress + task.weight, 100);
            await updateUserTaskProgress(task.id, newProgress);
        } catch (error) {
            console.error('Erro ao atualizar progresso da tarefa:', error);
        } finally {
            setFinished(true);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading quiz...</Text>
            </SafeAreaView>
        );
    }

    if (finished) {
        const passed = correctCount >= 3;
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
                <Ionicons
                    name={passed ? 'checkmark-circle-outline' : 'close-circle-outline'}
                    size={96}
                    color={passed ? '#16a34a' : '#dc2626'}
                    className="mb-4"
                />
                <Text className="text-4xl font-bold text-gray-800 mb-2">{passed ? 'YOU WIN!' : 'YOU LOSE'}</Text>
                <Text className="text-base text-gray-500 mb-6">
                    You answered {correctCount} of {questions.length} questions correctly.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-indigo-600 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">{passed ? 'Back to Tasks' : 'Try Again'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
                    <Ionicons name="chevron-back" size={24} color="#4f46e5" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 mb-4">{task.title}</Text>
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.question}</Text>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            className={`mb-3 p-4 rounded-xl border ${selectedOption === option
                                    ? option === currentQuestion.answer
                                        ? 'bg-green-200 border-green-500'
                                        : 'bg-red-200 border-red-500'
                                    : 'border-gray-300'
                                }`}
                            onPress={() => handleSelect(option)}
                            disabled={!!selectedOption}
                        >
                            <Text className="text-gray-800 font-medium">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text className="text-sm text-gray-500">
                    Question {currentIndex + 1} of {questions.length}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default TaskQuizScreen;
